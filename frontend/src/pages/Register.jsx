import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import authService from '../services/authService';
import axios from 'axios';

const Register = () => {

    // =========================
    // STATES
    // =========================
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [contraseña, setContraseña] = useState('');

    const [idRol, setIdRol] = useState('');
    const [idPais, setIdPais] = useState('');
    const [idUniversidad, setIdUniversidad] = useState('');

    const [paises, setPaises] = useState([]);
    const [universidades, setUniversidades] = useState([]);

    const [securityPassword, setSecurityPassword] = useState('');

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    // =========================
    // ROLES
    // =========================
    const roles = [
        { id: 1, nombre: 'Administrador' },
        { id: 2, nombre: 'Coordinador' },
        { id: 3, nombre: 'Docente' },
        { id: 4, nombre: 'Estudiante' },
    ];

    // =========================
    // CARGAR PAÍSES
    // =========================
    useEffect(() => {

        const fetchPaises = async () => {
            try {

                const res = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/auth/paises`
                );

                setPaises(res.data);

            } catch (err) {
                console.error('Error cargando países', err);
            }
        };

        fetchPaises();

    }, []);

    // =========================
    // CARGAR UNIVERSIDADES
    // =========================
    useEffect(() => {

        const fetchUniversidades = async () => {

            if (!idPais) {
                setUniversidades([]);
                return;
            }

            try {

                const res = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/auth/universidades/${idPais}`
                );

                setUniversidades(res.data);

            } catch (err) {
                console.error('Error cargando universidades', err);
            }
        };

        fetchUniversidades();

        // limpiar universidad al cambiar país
        setIdUniversidad('');

    }, [idPais]);

    // =========================
    // SUBMIT
    // =========================
    const handleSubmit = async (event) => {

        event.preventDefault();

        setError('');
        setSuccess('');

        // =========================
        // LIMPIAR DATOS
        // =========================
        const nombreLimpio = nombre.trim().toUpperCase();
        const emailLimpio = email.trim().toLowerCase();

        const needsSecurityPassword =
            idRol === '1' || idRol === '2';

        const validSecurityPassword =
            securityPassword === 'contraTest1234';

        const requiresUniversity =
            idRol !== '1';

        // =========================
        // VALIDAR CAMPOS
        // =========================
        if (
            !nombreLimpio ||
            !emailLimpio ||
            !contraseña ||
            !idRol ||
            !idPais ||
            (requiresUniversity && !idUniversidad)
        ) {

            setError(
                'Todos los campos obligatorios deben completarse.'
            );

            return;
        }

        // =========================
        // VALIDAR NOMBRE
        // =========================
        if (nombreLimpio.length < 3) {

            setError(
                'El nombre debe tener mínimo 3 caracteres.'
            );

            return;
        }

        // =========================
        // VALIDAR EMAIL
        // =========================
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(emailLimpio)) {

            setError(
                'Ingresa un correo electrónico válido.'
            );

            return;
        }

        // =========================
        // VALIDAR CONTRASEÑA
        // =========================
        if (contraseña.length < 6) {

            setError(
                'La contraseña debe tener mínimo 6 caracteres.'
            );

            return;
        }

        // =========================
        // VALIDAR CONTRASEÑA SEGURIDAD
        // =========================
        if (needsSecurityPassword && !securityPassword) {

            setError(
                'La contraseña de seguridad es obligatoria para este rol.'
            );

            return;
        }

        if (needsSecurityPassword && !validSecurityPassword) {

            setError(
                'Contraseña de seguridad incorrecta.'
            );

            return;
        }

        // =========================
        // REGISTRO
        // =========================
        try {

            setLoading(true);

            await authService.register({

                nombre: nombreLimpio,

                email: emailLimpio,

                contraseña,

                id_rol: Number(idRol),

                id_pais: Number(idPais),

                id_universidad: requiresUniversity
                    ? Number(idUniversidad)
                    : null,
            });

            setSuccess(
                'Usuario creado correctamente. Redirigiendo a login...'
            );

            setTimeout(() => {
                window.location.href = '/login';
            }, 1200);

        } catch (err) {

            setError(err.message);

        } finally {

            setLoading(false);
        }
    };

    return (

        <div className="flex min-h-[calc(100vh-72px)] items-center justify-center px-4 py-10">

            <div className="w-full max-w-md rounded-3xl bg-white/10 backdrop-blur-lg p-8 shadow-2xl border border-white/20">

                {/* TÍTULO */}
                <h1 className="mb-6 text-3xl font-semibold text-white text-center">
                    Registro
                </h1>

                {/* ERROR */}
                {error && (
                    <div className="mb-4 rounded-lg bg-red-500/20 px-4 py-3 text-sm text-red-200 border border-red-400/30">
                        {error}
                    </div>
                )}

                {/* SUCCESS */}
                {success && (
                    <div className="mb-4 rounded-lg bg-emerald-500/20 px-4 py-3 text-sm text-emerald-200 border border-emerald-400/30">
                        {success}
                    </div>
                )}

                {/* FORM */}
                <form
                    className="space-y-4"
                    onSubmit={handleSubmit}
                >

                    {/* NOMBRE */}
                    <input
                        required
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        placeholder="Nombre completo"
                        style={{ textTransform: 'uppercase' }}
                        className="w-full rounded-2xl bg-white/20 px-4 py-3 text-white placeholder-white/60"
                    />

                    {/* EMAIL */}
                    <input
                        required
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Correo electrónico"
                        className="w-full rounded-2xl bg-white/20 px-4 py-3 text-white placeholder-white/60"
                    />

                    {/* CONTRASEÑA */}
                    <input
                        required
                        type="password"
                        value={contraseña}
                        onChange={(e) => setContraseña(e.target.value)}
                        placeholder="Contraseña"
                        className="w-full rounded-2xl bg-white/20 px-4 py-3 text-white placeholder-white/60"
                    />

                    {/* ROL */}
                    <select
                        required
                        value={idRol}
                        onChange={(e) => setIdRol(e.target.value)}
                        className="w-full rounded-2xl bg-white/20 px-4 py-3 text-white"
                    >

                        <option value="" className="text-black">
                            Selecciona rol
                        </option>

                        {roles.map((r) => (

                            <option
                                key={r.id}
                                value={r.id}
                                className="text-black"
                            >
                                {r.nombre}
                            </option>

                        ))}

                    </select>

                    {/* PAÍS */}
                    <select
                        required
                        value={idPais}
                        onChange={(e) => setIdPais(e.target.value)}
                        className="w-full rounded-2xl bg-white/20 px-4 py-3 text-white"
                    >

                        <option value="" className="text-black">
                            Selecciona país
                        </option>

                        {[...paises]
                            .sort((a, b) =>
                                a.nombre.localeCompare(b.nombre)
                            )
                            .map((p) => (

                                <option
                                    key={p.id}
                                    value={p.id}
                                    className="text-black"
                                >
                                    {p.nombre}
                                </option>

                            ))}

                    </select>

                    {/* UNIVERSIDAD */}
                    {idRol !== '1' && (

                        <select
                            required
                            value={idUniversidad}
                            onChange={(e) =>
                                setIdUniversidad(e.target.value)
                            }
                            className="w-full rounded-2xl bg-white/20 px-4 py-3 text-white"
                        >

                            <option value="" className="text-black">
                                Selecciona universidad
                            </option>

                            {universidades.map((u) => (

                                <option
                                    key={u.id}
                                    value={u.id}
                                    className="text-black"
                                >
                                    {u.nombre}
                                </option>

                            ))}

                        </select>
                    )}

                    {/* CONTRASEÑA SEGURIDAD */}
                    {(idRol === '1' || idRol === '2') && (

                        <input
                            required
                            type="password"
                            value={securityPassword}
                            onChange={(e) =>
                                setSecurityPassword(e.target.value)
                            }
                            placeholder="Contraseña de seguridad"
                            className="w-full rounded-2xl bg-white/20 px-4 py-3 text-white placeholder-white/60"
                        />
                    )}

                    {/* BOTÓN */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-2xl bg-blue-600 px-4 py-3 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                    >

                        {loading
                            ? 'Registrando...'
                            : 'Registrarse'}

                    </button>

                </form>

                {/* LOGIN */}
                <p className="mt-6 text-center text-sm text-white/70">

                    ¿Ya tienes cuenta?{' '}

                    <Link
                        to="/login"
                        className="text-blue-400 hover:text-blue-300"
                    >
                        Inicia sesión
                    </Link>

                </p>

            </div>

        </div>
    );
};

export default Register;