// src/pages/Colaboracion.jsx

import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import {
    obtenerMasterclass,
    obtenerMentorias,
    obtenerProyectos,
} from '../services/colaboracionService';

import MasterclassCard from '../components/MasterclassCard';
import MentoriaCard from '../components/MentoriaCard';
import ProyectoCard from '../components/ProyectoCard';
import CrearMasterclassModal from '../components/CrearMasterclassModal';
import CrearMentoriaModal from '../components/CrearMentoriaModal';
import CrearProyectoModal from '../components/CrearProyectoModal';
import InscripcionModal from '../components/InscripcionModal';

const Colaboracion = () => {
    const { token, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [tab, setTab] = useState('masterclass');
    const [masterclass, setMasterclass] = useState([]);
    const [mentorias, setMentorias] = useState([]);
    const [proyectos, setProyectos] = useState([]);
    const [loading, setLoading] = useState(true);

    const [openMasterclass, setOpenMasterclass] = useState(false);
    const [openMentoria, setOpenMentoria] = useState(false);
    const [openProyecto, setOpenProyecto] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [inscripcionOpen, setInscripcionOpen] = useState(false);
    const [inscripcionData, setInscripcionData] = useState(null);

    // ==========================
    // 🔄 RECUPERAR TAB AL VOLVER
    // ==========================
    useEffect(() => {
        if (location.state?.tab) {
            setTab(location.state.tab);
        }
    }, [location.state]);

    // ==========================
    // 📦 CARGAR DATA
    // ==========================
    const cargarData = async () => {
        try {
            setLoading(true);

            const [masterclassData, mentoriasData, proyectosData] =
                await Promise.all([
                    obtenerMasterclass(token),
                    obtenerMentorias(token),
                    obtenerProyectos(token),
                ]);

            setMasterclass(masterclassData.data || []);
            setMentorias(mentoriasData.data || []);
            setProyectos(proyectosData.data || []);
        } catch (error) {
            console.error(error);
            setMasterclass([]);
            setMentorias([]);
            setProyectos([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) cargarData();
    }, [token]);

    // ==========================
    // 🔐 COORDINADOR
    // ==========================
    const esCoordinador = Number(user?.rol || user?.id_rol) === 2;

    // ==========================
    // 🧠 CAMBIAR TAB (IMPORTANTE)
    // ==========================
    const cambiarTab = (nuevoTab) => {
        setTab(nuevoTab);
        navigate('/colaboracion', { state: { tab: nuevoTab } });
    };

    return (
        <div className="mx-auto max-w-7xl px-4 py-10">

            {/* HEADER */}
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                <div>
                    <h1 className="text-4xl font-bold text-white">
                        Colaboración Académica
                    </h1>

                    <p className="mt-3 max-w-2xl text-white/60">
                        Espacio internacional para compartir conocimiento y proyectos colaborativos.
                    </p>
                </div>

                {/* BOTONES CREAR */}
                {esCoordinador && (
                    <div className="flex flex-wrap gap-3">

                        <button
                            onClick={() => setOpenMasterclass(true)}
                            className="rounded-2xl bg-cyan-500/20 px-5 py-3 text-sm text-cyan-300 hover:bg-cyan-500/30"
                        >
                            + Crear Masterclass
                        </button>

                        <button
                            onClick={() => setOpenMentoria(true)}
                            className="rounded-2xl bg-violet-500/20 px-5 py-3 text-sm text-violet-300 hover:bg-violet-500/30"
                        >
                            + Crear Mentoría
                        </button>

                        <button
                            onClick={() => setOpenProyecto(true)}
                            className="rounded-2xl bg-emerald-500/20 px-5 py-3 text-sm text-emerald-300 hover:bg-emerald-500/30"
                        >
                            + Crear Proyecto
                        </button>

                    </div>
                )}
            </div>

            {/* TABS */}
            <div className="mt-10 flex flex-wrap gap-3">

                <button
                    onClick={() => cambiarTab('masterclass')}
                    className={`rounded-2xl px-5 py-3 text-sm ${tab === 'masterclass'
                        ? 'bg-cyan-500/20 text-cyan-300'
                        : 'bg-white/5 text-white/60'
                        }`}
                >
                    🎓 Masterclass
                </button>

                <button
                    onClick={() => cambiarTab('mentorias')}
                    className={`rounded-2xl px-5 py-3 text-sm ${tab === 'mentorias'
                        ? 'bg-violet-500/20 text-violet-300'
                        : 'bg-white/5 text-white/60'
                        }`}
                >
                    🧠 Mentorías
                </button>

                <button
                    onClick={() => cambiarTab('proyectos')}
                    className={`rounded-2xl px-5 py-3 text-sm ${tab === 'proyectos'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-white/5 text-white/60'
                        }`}
                >
                    🚀 Proyectos
                </button>

            </div>

            {/* CONTENT */}
            <div className="mt-10">

                {loading ? (
                    <p className="text-center text-white/60">Cargando...</p>
                ) : (
                    <>
                        {/* MASTERCLASS */}
                        {tab === 'masterclass' && (
                            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

                                {masterclass.map((item) => (
                                    <MasterclassCard
                                        key={item.id}
                                        masterclass={item}
                                        onClick={() =>
                                            navigate(`/masterclass/${item.id}`, {
                                                state: { tab: 'masterclass' }
                                            })
                                        }
                                    />
                                ))}

                            </div>
                        )}

                        {/* MENTORÍAS */}
                        {tab === 'mentorias' && (
                            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

                                {mentorias.map((item) => (
                                    <MentoriaCard
                                        key={item.id}
                                        mentoria={item}
                                        onClick={() =>
                                            navigate(`/mentoria/${item.id}`, {
                                                state: { tab: 'mentorias' }
                                            })
                                        }
                                    />
                                ))}

                            </div>
                        )}

                        {/* PROYECTOS */}
                        {tab === 'proyectos' && (
                            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

                                {proyectos.map((item) => (
                                    <ProyectoCard
                                        key={item.id}
                                        proyecto={item}
                                        onClick={() =>
                                            navigate(`/proyecto/${item.id}`, {
                                                state: { tab: 'proyectos' }
                                            })
                                        }
                                    />
                                ))}

                            </div>
                        )}
                    </>
                )}
            </div>

            {/* MODALES */}
            <CrearMasterclassModal
                open={openMasterclass}
                onClose={() => setOpenMasterclass(false)}
                onCreated={cargarData}
            />

            <CrearMentoriaModal
                open={openMentoria}
                onClose={() => setOpenMentoria(false)}
                onCreated={cargarData}
            />

            <CrearProyectoModal
                open={openProyecto}
                onClose={() => setOpenProyecto(false)}
                onCreated={cargarData}
            />

        </div>
    );
};



export default Colaboracion;