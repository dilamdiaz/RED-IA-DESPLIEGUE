// src/pages/ProyectoDetalle.jsx

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
import { inscribirse } from '../services/colaboracionService';

import EditarProyectoModal from '../components/EditarProyectoModal';

import InscripcionModal from '../components/InscripcionModal';
const ProyectoDetalle = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    const { token, user } = useAuth();

    const [proyecto, setProyecto] = useState(null);

    const [loading, setLoading] = useState(true);
    const [loadingInscripcion, setLoadingInscripcion] = useState(false);

    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const [openEditar, setOpenEditar] = useState(false);

    // 👇 MODAL INSCRITOS
    const [openInscritos, setOpenInscritos] = useState(false);
    const [loadingEstado, setLoadingEstado] = useState(false);

    const resetEstado = () => {
        setProyecto(null);
        setLoading(true);
        setError('');
        setSuccess('');
    };
    // =========================
    // 📦 CARGAR DETALLE
    // =========================

    const cargarDetalle = async () => {
        try {
            setLoading(true);
            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/colaboracion/proyectos/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const data = await res.json();
            if (!data.success) {
                throw new Error(data.message);
            }
            setProyecto(data.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {

        if (!id || !token) return;

        resetEstado();
        cargarDetalle();

    }, [id, token]);

    // =========================
    // 🔐 PERMISOS
    // =========================
    const idUsuario = user?.id;
    const idCreador = proyecto?.id_coordinador;

    const esCreador =
        idUsuario &&
        idCreador &&
        Number(idUsuario) === Number(idCreador);

    // ✅ SOLO SE PUEDE INSCRIBIR EN PLANEACIÓN
    const estadoPermiteInscripcion =
        proyecto?.estado === 'Planeacion';

    const hayCupos =
        proyecto?.cupos === null ||
        proyecto?.cupos > 0;

    const puedeInscribirse =
        !esCreador &&
        estadoPermiteInscripcion &&
        hayCupos;

    // =========================
    // 🧠 ESTADO COLOR
    // =========================
    const getEstadoColor = () => {

        switch (proyecto?.estado) {

            case 'Planeacion':
                return 'bg-yellow-500/20 text-yellow-300';

            case 'En desarrollo':
                return 'bg-emerald-500/20 text-emerald-300';

            case 'Finalizado':
                return 'bg-red-500/20 text-red-300';

            default:
                return 'bg-white/10 text-white';
        }
    };

    // =========================
    // 📝 INSCRIPCIÓN
    // =========================
    const handleInscribirse = async () => {

        try {

            setLoadingInscripcion(true);

            setError('');
            setSuccess('');

            const data = await inscribirse(
                'proyecto',
                id,
                token
            );

            if (!data.success) {
                throw new Error(data.message);
            }

            setSuccess(
                'Te uniste al proyecto correctamente 🚀'
            );
            setTimeout(() => {
                setSuccess('');
            }, 2500);

            // ✅ DESCONTAR CUPO EN FRONT
            setProyecto((prev) => ({
                ...prev,
                cupos:
                    prev.cupos !== null
                        ? prev.cupos - 1
                        : null
            }));

        } catch (err) {

            setError(err.message);
            setTimeout(() => {
                setError('');
            }, 3000);

        } finally {

            setLoadingInscripcion(false);

        }
    };

    // =========================
    // 🔄 CAMBIAR ESTADO
    // =========================
    const handleCambiarEstado = async (nuevoEstado) => {
        try {
            setLoadingEstado(true);
            setError('');
            setSuccess('');

            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/colaboracion/proyectos/${proyecto.id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        ...proyecto,
                        estado: nuevoEstado,
                    }),
                }
            );

            const data = await res.json();

            if (!data.success) {
                throw new Error(data.message);
            }

            setProyecto((prev) => ({
                ...prev,
                estado: nuevoEstado,
            }));

            setSuccess('Estado actualizado correctamente ✅');

            setTimeout(() => setSuccess(''), 2500);

        } catch (err) {
            setError(err.message);
            setTimeout(() => setError(''), 3000);
        } finally {
            setLoadingEstado(false);
        }
    };

    // =========================
    // ✏️ EDITAR
    // =========================
    const handleEditar = () => {
        setError('');
        setSuccess('');
        setOpenEditar(true);
    };



    const handleVerInscritos = () => {
        setError('');
        setSuccess('');
        setOpenInscritos(true);
    };
    // =========================
    // 🗑 ELIMINAR
    // =========================
    const handleEliminar = async () => {

        try {

            const confirmar = window.confirm(
                '¿Seguro que deseas eliminar este proyecto?'
            );

            if (!confirmar) return;

            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/colaboracion/proyectos/${id}`,
                {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await res.json();

            if (!data.success) {
                throw new Error(data.message);
            }

            navigate('/colaboracion');

        } catch (err) {

            setError(err.message);

        }
    };

    // =========================
    // ⏳ ESTADOS
    // =========================
    if (loading) {
        return (
            <p className="text-white text-center mt-10">
                Cargando proyecto...
            </p>
        );
    }

    if (error && !proyecto) {
        return (
            <p className="text-red-400 text-center mt-10">
                {error}
            </p>
        );
    }

    if (!proyecto) return null;

    return (
        <>
            {/* ✨ MODAL EDITAR */}
            <EditarProyectoModal
                open={openEditar}
                onClose={() => setOpenEditar(false)}
                proyecto={proyecto}
                onUpdated={(updatedProyecto) =>
                    setProyecto(updatedProyecto)
                }
            />

            {/* 👥 MODAL INSCRITOS */}
            <InscripcionModal
                open={openInscritos}
                data={proyecto}
                tipo="proyecto"
                onClose={() => setOpenInscritos(false)}
                onRefresh={cargarDetalle}
            />
            <div className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-white/5 p-8 text-white backdrop-blur-xl">

                {/* BOTÓN CERRAR */}
                <div className="flex justify-end">
                    <button
                        onClick={() => navigate(-1)}
                        className="rounded-xl bg-white/10 px-4 py-2 text-sm hover:bg-white/20"
                    >
                        ✖ Cerrar
                    </button>
                </div>

                {/* HEADER */}
                <div className="mt-3 flex flex-wrap items-center gap-3">

                    <span className="rounded-full bg-emerald-500/20 px-4 py-2 text-sm text-emerald-300">
                        🚀 Proyecto Internacional
                    </span>

                    <span className={`rounded-full px-4 py-2 text-sm ${getEstadoColor()}`}>
                        {proyecto.estado}
                    </span>

                    {proyecto.universidad && (
                        <span className="rounded-full bg-blue-500/20 px-4 py-2 text-sm text-blue-300">
                            🏫 {proyecto.universidad}
                        </span>
                    )}

                    {proyecto.pais && (
                        <span className="rounded-full bg-green-500/20 px-4 py-2 text-sm text-green-300">
                            🌎 {proyecto.pais}
                        </span>
                    )}

                </div>

                {/* TITULO */}
                <h1 className="mt-6 text-4xl font-bold">
                    {proyecto.titulo}
                </h1>

                {/* INFO */}
                <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">

                    <h3 className="mb-3 text-sm text-white/50">
                        Información del proyecto
                    </h3>

                    <div className="flex flex-col gap-2">

                        <div className="flex gap-2">
                            <span className="text-white/50">
                                👤 Creador:
                            </span>

                            <span className="font-medium text-white">
                                {proyecto.creador}
                            </span>
                        </div>

                        {proyecto.universidad && (
                            <div className="flex gap-2">
                                <span className="text-white/50">
                                    🏫 Universidad:
                                </span>

                                <span>{proyecto.universidad}</span>
                            </div>
                        )}

                        {proyecto.pais && (
                            <div className="flex gap-2">
                                <span className="text-white/50">
                                    🌎 País:
                                </span>

                                <span>{proyecto.pais}</span>
                            </div>
                        )}

                    </div>
                </div>

                {/* DESCRIPCIÓN */}
                <div className="mt-8 rounded-3xl border border-white/10 bg-black/20 p-6">

                    <h2 className="mb-4 text-xl font-semibold">
                        Descripción del Proyecto
                    </h2>

                    <p className="text-white/70">
                        {proyecto.descripcion}
                    </p>

                </div>


                {/* INFO EXTRA */}
                <div className="mt-8 grid gap-5 md:grid-cols-4">

                    {/* ESTADO */}
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-5">

                        <p className="text-sm text-white/50">
                            Estado
                        </p>

                        {esCreador ? (
                            <div className="mt-3 relative">
                                <select
                                    value={proyecto.estado}
                                    disabled={loadingEstado}
                                    onChange={(e) => handleCambiarEstado(e.target.value)}
                                    className={`w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition
                ${loadingEstado ? 'opacity-50 cursor-not-allowed' : ''}
            `}
                                >
                                    <option value="Planeacion">📌 Planeación</option>
                                    <option value="En desarrollo">🚀 En desarrollo</option>
                                    <option value="Finalizado">✅ Finalizado</option>
                                </select>

                                {/* 🔥 LOADING OVERLAY */}
                                {loadingEstado && (
                                    <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/40 text-white text-sm">
                                        ⏳ Actualizando estado...
                                    </div>
                                )}
                            </div>
                        ) : (
                            <h3 className="mt-2 text-lg font-semibold">
                                📌 {proyecto.estado}
                            </h3>
                        )}

                    </div>

                    {/* COLABORACIÓN */}
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-5">

                        <p className="text-sm text-white/50">
                            Colaboración
                        </p>

                        <h3 className="mt-2 text-lg font-semibold">
                            🤝 Internacional
                        </h3>

                    </div>

                    {/* ÁREA */}
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-5">

                        <p className="text-sm text-white/50">
                            Área
                        </p>

                        <h3 className="mt-2 text-lg font-semibold">
                            🧠 Inteligencia Artificial
                        </h3>

                    </div>

                    {/* CUPOS */}
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-5">

                        <p className="text-sm text-white/50">
                            Cupos disponibles
                        </p>

                        <h3 className="mt-2 text-lg font-semibold">
                            👥 {proyecto.cupos ?? 'Sin límite'}
                        </h3>

                    </div>

                </div>

                {/* 🔗 CONECTARSE AL PROYECTO */}
                {proyecto.tipo_link && proyecto.link_proyecto && (

                    <div className="mt-8 rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-6">

                        <div className="flex items-center justify-between gap-4 flex-wrap">

                            <div>

                                <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs text-emerald-300">
                                    🔗 Conectarse al proyecto
                                </span>

                                <h2 className="mt-4 text-2xl font-bold text-white">
                                    {proyecto.tipo_link === 'whatsapp' && '💬 Grupo de WhatsApp'}
                                    {proyecto.tipo_link === 'discord' && '🎮 Servidor de Discord'}
                                    {proyecto.tipo_link === 'telegram' && '📨 Grupo de Telegram'}
                                    {proyecto.tipo_link === 'github' && '💻 Repositorio GitHub'}
                                    {proyecto.tipo_link === 'meet' && '📹 Reunión Meet'}
                                    {proyecto.tipo_link === 'otro' && '🌐 Enlace del proyecto'}
                                </h2>

                                <p className="mt-2 text-white/70">
                                    Únete al espacio colaborativo del proyecto.
                                </p>

                            </div>

                            <div className="flex gap-3">

                                <button
                                    onClick={() =>
                                        window.open(
                                            proyecto.link_proyecto,
                                            '_blank'
                                        )
                                    }
                                    className="
                        rounded-2xl
                        bg-emerald-500/20
                        px-5
                        py-3
                        font-medium
                        text-emerald-300
                        transition
                        hover:bg-emerald-500/30
                    "
                                >
                                    Entrar
                                </button>

                                <button
                                    onClick={() =>
                                        navigator.clipboard.writeText(
                                            proyecto.link_proyecto
                                        )
                                    }
                                    className="
                        rounded-2xl
                        border border-white/10
                        bg-white/5
                        px-5
                        py-3
                        text-white/70
                        transition
                        hover:bg-white/10
                    "
                                >
                                    Copiar enlace
                                </button>

                            </div>

                        </div>

                    </div>

                )}


                {/* ALERTAS */}
                {success && (
                    <div className="mt-6 rounded-2xl bg-green-500/10 p-4 text-green-300">
                        {success}
                    </div>
                )}

                {error && (
                    <div className="mt-6 rounded-2xl bg-red-500/10 p-4 text-red-300">
                        {error}
                    </div>
                )}

                {/* BOTONES */}
                <div className="mt-10 flex justify-end gap-3">

                    {/* SOLO CREADOR */}
                    {esCreador && (
                        <>
                            <button
                                onClick={handleEditar}
                                className="rounded-2xl bg-white/10 px-5 py-3 hover:bg-white/20"
                            >
                                Editar
                            </button>

                            <button
                                onClick={() => {
                                    setError('');
                                    setSuccess('');
                                    setOpenInscritos(true);
                                }}
                                className="rounded-2xl bg-violet-500/20 px-5 py-3 text-violet-300 hover:bg-violet-500/30"
                            >
                                👥 Ver inscritos
                            </button>
                            <button
                                onClick={handleEliminar}
                                className="rounded-2xl bg-red-500/20 px-5 py-3 text-red-300 hover:bg-red-500/30"
                            >
                                Eliminar
                            </button>
                        </>
                    )}

                    {/* SOLO NO CREADOR */}
                    {!esCreador && (
                        <>
                            {puedeInscribirse ? (

                                <button
                                    onClick={handleInscribirse}
                                    disabled={loadingInscripcion}
                                    className="rounded-2xl bg-emerald-500/20 px-6 py-4 text-sm text-emerald-300 hover:bg-emerald-500/30"
                                >
                                    {loadingInscripcion
                                        ? 'Procesando...'
                                        : 'Unirme al Proyecto'}
                                </button>

                            ) : (

                                <button
                                    disabled
                                    className="cursor-not-allowed rounded-2xl bg-red-500/10 px-6 py-4 text-sm text-red-300"
                                >
                                    {proyecto.estado !== 'Planeacion'
                                        ? 'Inscripciones cerradas'
                                        : 'Sin cupos disponibles'}
                                </button>

                            )}
                        </>
                    )}

                </div>
            </div>

            {/* ✨ MODAL EDITAR */}
            <EditarProyectoModal
                open={openEditar}
                onClose={() => setOpenEditar(false)}
                proyecto={proyecto}
                onUpdated={(updatedProyecto) =>
                    setProyecto(updatedProyecto)
                }
            />
        </>
    );
};


export default ProyectoDetalle;