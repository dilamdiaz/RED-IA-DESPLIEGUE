import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

import {
    inscribirse
} from '../services/colaboracionService';

import { formatDateLong } from '../utils/date';

// 👇 MODALES
import EditarMasterclassModal from '../components/EditarMasterclassModal';
import InscripcionModal from '../components/InscripcionModal';

const MasterclassDetalle = () => {

    const { id } = useParams();

    const navigate = useNavigate();

    const { token, user } = useAuth();

    const [masterclass, setMasterclass] = useState(null);

    const [loading, setLoading] = useState(true);

    const [loadingInscripcion, setLoadingInscripcion] =
        useState(false);

    const [success, setSuccess] = useState('');

    const [error, setError] = useState('');

    // ======================================
    // MODALES
    // ======================================
    const [openEdit, setOpenEdit] = useState(false);

    const [openInscritos, setOpenInscritos] =
        useState(false);

    // ======================================
    // 📦 CARGAR DETALLE
    // ======================================
    const cargarDetalle = async () => {

        try {

            setLoading(true);

            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/colaboracion/masterclass/${id}`,
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

            setMasterclass(data.data);

        } catch (err) {

            setError(err.message);

        } finally {

            setLoading(false);
        }
    };

    // ======================================
    // EFFECT
    // ======================================
    useEffect(() => {

        if (id && token) {
            cargarDetalle();
        }

    }, [id, token]);

    // ======================================
    // 🧠 PERMISOS
    // ======================================
    const idUsuario = user?.id;

    const idCreador =
        masterclass?.id_coordinador;

    const esCreador =
        Number(idUsuario) === Number(idCreador);

    const yaInscrito =
        Number(masterclass?.ya_inscrito) > 0;

    const puedeInscribirse =
        !esCreador &&
        !yaInscrito &&
        (
            masterclass?.cupos === null ||
            masterclass?.cupos > 0
        );
    // ======================================
    // 📝 INSCRIPCIÓN
    // ======================================
    const handleInscribirse = async () => {

        try {

            setLoadingInscripcion(true);

            setError('');
            setSuccess('');

            const data = await inscribirse(
                'masterclass',
                id,
                token
            );

            if (!data.success) {
                throw new Error(data.message);
            }

            setSuccess(
                'Inscripción realizada correctamente ✅'
            );

            // ✅ DESCONTAR CUPOS EN FRONT
            setMasterclass((prev) => ({
                ...prev,
                cupos:
                    prev.cupos !== null
                        ? prev.cupos - 1
                        : null
            }));

        } catch (err) {

            setError(err.message);

        } finally {

            setLoadingInscripcion(false);
        }
    };

    // ======================================
    // ✏️ EDITAR
    // ======================================
    const handleEditar = () => {

        setOpenEdit(true);
    };

    // ======================================
    // 🗑 ELIMINAR
    // ======================================
    const handleEliminar = async () => {

        try {

            const confirmar = window.confirm(
                '¿Seguro que deseas eliminar esta masterclass?'
            );

            if (!confirmar) return;

            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/colaboracion/masterclass/${id}`,
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

    // ======================================
    // ⏳ LOADING
    // ======================================
    if (loading) {

        return (
            <p className="mt-10 text-center text-white">
                Cargando masterclass...
            </p>
        );
    }
    // ======================================
    // FORMATEAR HORA
    // ======================================
    const horaFormateada = masterclass.hora
        ? new Date(`1970-01-01T${masterclass.hora}`)
            .toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
            })
        : 'No definida';
    // ======================================
    // ❌ ERROR
    // ======================================
    if (error && !masterclass) {

        return (
            <p className="mt-10 text-center text-red-400">
                {error}
            </p>
        );
    }

    if (!masterclass) return null;

    return (

        <div
            className="
                mx-auto
                max-w-4xl
                rounded-3xl
                border border-white/10
                bg-white/5
                p-8
                text-white
                backdrop-blur-xl
            "
        >

            {/* ====================================== */}
            {/* CERRAR */}
            {/* ====================================== */}
            <div className="flex justify-end">

                <button
                    onClick={() => navigate(-1)}
                    className="
                        rounded-xl
                        bg-white/10
                        px-4 py-2
                        text-sm
                        transition
                        hover:bg-white/20
                    "
                >
                    ✖ Cerrar
                </button>

            </div>


            {/* ====================================== */}
            {/* TÍTULO */}
            {/* ====================================== */}
            <h1 className="mt-6 text-4xl font-bold">

                {masterclass.titulo}

            </h1>
            {/* ====================================== */}
            {/* BADGES */}
            {/* ====================================== */}
            <div
                className="
                    mt-3
                    flex flex-wrap
                    items-center
                    gap-3
                "
            >

                <span
                    className="
                        rounded-full
                        bg-cyan-500/20
                        px-4 py-2
                        text-sm
                        text-cyan-300
                    "
                >
                    🎓 Masterclass Internacional
                </span>

                {masterclass.universidad && (

                    <span
                        className="
                            rounded-full
                            bg-blue-500/20
                            px-4 py-2
                            text-sm
                            text-blue-300
                        "
                    >
                        🏫 {masterclass.universidad}
                    </span>
                )}

                {masterclass.pais && (

                    <span
                        className="
                            rounded-full
                            bg-green-500/20
                            px-4 py-2
                            text-sm
                            text-green-300
                        "
                    >
                        🌎 {masterclass.pais}
                    </span>
                )}

            </div>

            {/* ====================================== */}
            {/* INFO CREADOR */}
            {/* ====================================== */}
            <div
                className="
                    mt-6
                    rounded-2xl
                    border border-white/10
                    bg-white/5
                    p-5
                "
            >

                <h3 className="mb-3 text-sm text-white/50">
                    Información de la publicación
                </h3>

                <div className="flex flex-col gap-3">

                    <div className="flex items-center gap-2">

                        <span className="text-white/50">
                            👤 Creador:
                        </span>

                        <span className="font-medium text-white">
                            {masterclass.creador}
                        </span>

                    </div>



                </div>

            </div>

            {/* ====================================== */}
            {/* DESCRIPCIÓN */}
            {/* ====================================== */}
            <div
                className="
                    mt-8
                    rounded-3xl
                    border border-white/10
                    bg-black/20
                    p-6
                "
            >

                <h2 className="mb-4 text-xl font-semibold">
                    Descripción
                </h2>

                <p className="leading-relaxed text-white/70">
                    {masterclass.descripcion}
                </p>

            </div>

            {/* ====================================== */}
            {/* INFO */}
            {/* ====================================== */}
            <div
                className="
                    mt-8
                    grid gap-5
                    md:grid-cols-3
                "
            >

                {/* FECHA */}
                <div
                    className="
                        rounded-3xl
                        border border-white/10
                        bg-white/5
                        p-5
                    "
                >

                    <p className="text-sm text-white/50">
                        Fecha
                    </p>

                    <h3 className="mt-2 text-lg font-semibold">
                        📅 {formatDateLong(masterclass.fecha)}
                    </h3>

                </div>

                {/* HORA */}
                <div
                    className="
                        rounded-3xl
                        border border-white/10
                        bg-white/5
                        p-5
                    "
                >

                    <p className="text-xs text-white/50">
                        Hora
                    </p>

                    <h4 className="mt-1 text-sm font-semibold text-white">
                        🕒 {horaFormateada}
                    </h4>

                </div>

                {/* CUPOS */}
                <div
                    className="
                        rounded-3xl
                        border border-white/10
                        bg-white/5
                        p-5
                    "
                >

                    <p className="text-sm text-white/50">
                        Cupos disponibles
                    </p>

                    <h3 className="mt-2 text-lg font-semibold">
                        👥 {masterclass.cupos ?? 'Sin límite'}
                    </h3>

                </div>

            </div>

            {/* ====================================== */}
            {/* ENLACE */}
            {/* ====================================== */}
            {masterclass.enlace && (

                <div
                    className="
                        mt-6
                        rounded-3xl
                        border border-cyan-500/20
                        bg-cyan-500/10
                        p-5
                    "
                >

                    <p className="mb-3 text-sm text-cyan-200">
                        Link oficial de la masterclass
                    </p>

                    <a
                        href={masterclass.enlace}
                        target="_blank"
                        rel="noreferrer"
                        className="
                            inline-flex
                            items-center
                            gap-2
                            rounded-2xl
                            bg-cyan-500/20
                            px-5 py-3
                            text-sm
                            font-medium
                            text-cyan-300
                            transition
                            hover:bg-cyan-500/30
                        "
                    >
                        🔗 Unirse a la masterclass
                    </a>

                </div>
            )}

            {/* ====================================== */}
            {/* ALERTAS */}
            {/* ====================================== */}
            {loadingInscripcion && (

                <div
                    className="
            mt-6
            rounded-2xl
            border border-cyan-400/20
            bg-cyan-500/10
            p-4
            text-cyan-200
            flex items-center gap-3
        "
                >
                    <div
                        className="
                h-5 w-5
                animate-spin
                rounded-full
                border-2
                border-cyan-300
                border-t-transparent
            "
                    />

                    Procesando inscripción y enviando correo...
                </div>
            )}
            {success && (

                <div
                    className="
                        mt-6
                        rounded-2xl
                        bg-green-500/10
                        p-4
                        text-green-300
                    "
                >
                    {success}
                </div>
            )}

            {error && (

                <div
                    className="
                        mt-6
                        rounded-2xl
                        bg-red-500/10
                        p-4
                        text-red-300
                    "
                >
                    {error}
                </div>
            )}

            {/* ====================================== */}
            {/* BOTONES */}
            {/* ====================================== */}
            <div
                className="
                    mt-10
                    flex flex-wrap
                    justify-end
                    gap-3
                "
            >

                {esCreador && (
                    <>
                        <button
                            onClick={handleEditar}
                            className="
                                rounded-2xl
                                bg-white/10
                                px-5 py-3
                                transition
                                hover:bg-white/20
                            "
                        >
                            ✏️ Editar
                        </button>

                        <button
                            onClick={() =>
                                setOpenInscritos(true)
                            }
                            className="
                                rounded-2xl
                                bg-violet-500/20
                                px-5 py-3
                                text-violet-300
                                transition
                                hover:bg-violet-500/30
                            "
                        >
                            👥 Ver inscritos
                        </button>

                        <button
                            onClick={handleEliminar}
                            className="
                                rounded-2xl
                                bg-red-500/20
                                px-5 py-3
                                text-red-300
                                transition
                                hover:bg-red-500/30
                            "
                        >
                            🗑 Eliminar
                        </button>
                    </>
                )}

                {puedeInscribirse ? (

                    <button
                        onClick={handleInscribirse}
                        disabled={loadingInscripcion}
                        className={`
        rounded-2xl
        px-6 py-4
        text-sm
        transition
        flex items-center gap-3
        ${loadingInscripcion
                                ? 'bg-cyan-500/10 text-cyan-200 cursor-not-allowed'
                                : 'bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30'
                            }
    `}
                    >
                        {loadingInscripcion ? (
                            <>
                                <div
                                    className="
                    h-5 w-5
                    animate-spin
                    rounded-full
                    border-2
                    border-cyan-300
                    border-t-transparent
                "
                                />
                                Enviando correo...
                            </>
                        ) : (
                            <>
                                🚀 Inscribirme
                            </>
                        )}
                    </button>

                ) : (

                    !esCreador && (

                        yaInscrito ? (

                            <button
                                disabled
                                className="
                    cursor-not-allowed
                    rounded-2xl
                    bg-green-500/10
                    px-6 py-4
                    text-sm
                    text-green-300
                    border border-green-400/20
                "
                            >
                                ✅ Ya estás inscrito
                            </button>

                        ) : (

                            <button
                                disabled
                                className="
                    cursor-not-allowed
                    rounded-2xl
                    bg-red-500/10
                    px-6 py-4
                    text-sm
                    text-red-300
                "
                            >
                                Sin cupos disponibles
                            </button>

                        )
                    )
                )}

            </div>

            {/* ====================================== */}
            {/* MODAL EDITAR */}
            {/* ====================================== */}
            <EditarMasterclassModal
                open={openEdit}
                onClose={() => setOpenEdit(false)}
                masterclass={masterclass}
                token={token}
                onUpdated={(data) =>
                    setMasterclass(data)
                }
            />

            {/* ====================================== */}
            {/* MODAL INSCRITOS */}
            {/* ====================================== */}
            <InscripcionModal
                open={openInscritos}
                data={masterclass}
                tipo="masterclass"
                onClose={() =>
                    setOpenInscritos(false)
                }
                onRefresh={cargarDetalle}
            />

        </div>
    );
};

export default MasterclassDetalle;