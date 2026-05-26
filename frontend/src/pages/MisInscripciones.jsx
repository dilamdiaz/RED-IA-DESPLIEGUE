// src/pages/MisInscripciones.jsx

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { obtenerMisInscripciones, abandonarInscripcion } from '../services/colaboracionService';

const MisInscripciones = () => {
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [inscripciones, setInscripciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [accionLoading, setAccionLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // ==========================
  // 📦 CARGAR INSCRIPCIONES
  // ==========================
  const cargarInscripciones = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await obtenerMisInscripciones(token);
      setInscripciones(res.data || []);
    } catch (err) {
      console.error(err);
      setError('Error al cargar inscripciones');
      setInscripciones([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) cargarInscripciones();
  }, [token]);

  // ==========================
  // ❌ ABANDONAR INSCRIPCIÓN
  // ==========================
  const handleAbandonar = async (tipo, idReferencia, estado) => {
    // Validación para proyectos
    if (tipo === 'proyecto' && estado !== 'Planeacion') {
      setError('⚠️ No puedes abandonar un proyecto que ya está en desarrollo');
      setTimeout(() => setError(''), 5000);
      return;
    }

    try {
      setAccionLoading(true);
      setError('');
      
      await abandonarInscripcion(tipo, idReferencia, token);
      
      setSuccess('✅ Inscripción cancelada correctamente');
      setTimeout(() => setSuccess(''), 3000);
      
      // Recargar inscripciones
      await cargarInscripciones();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error al abandonar inscripción');
    } finally {
      setAccionLoading(false);
    }
  };

  // ==========================
  // 🧠 IR AL DETALLE
  // ==========================
  const irAlDetalle = (tipo, id) => {
    if (tipo === 'masterclass') {
      navigate(`/masterclass/${id}`, { state: { tab: 'masterclass' } });
    } else if (tipo === 'mentoria') {
      navigate(`/mentoria/${id}`, { state: { tab: 'mentorias' } });
    } else if (tipo === 'proyecto') {
      navigate(`/proyecto/${id}`, { state: { tab: 'proyectos' } });
    }
  };

  // ==========================
  // 🎨 SEPARA POR TIPO
  // ==========================
  const masterclassInscripciones = inscripciones.filter(i => i.tipo === 'masterclass');
  const mentoriaInscripciones = inscripciones.filter(i => i.tipo === 'mentoria');
  const proyectoInscripciones = inscripciones.filter(i => i.tipo === 'proyecto');

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* HEADER */}
      <div>
        <h1 className="text-4xl font-bold text-white">
          📚 Mis Inscripciones
        </h1>
        <p className="mt-3 max-w-2xl text-white/60">
          Aquí puedes ver todas tus inscripciones y abandonar las que desees.
        </p>
      </div>

      {/* ALERTAS */}
      {error && (
        <div className="mt-6 p-4 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300">
          {error}
        </div>
      )}
      {success && (
        <div className="mt-6 p-4 rounded-xl bg-green-500/20 border border-green-500/30 text-green-300">
          {success}
        </div>
      )}

      {/* CONTENIDO */}
      <div className="mt-10">
        {loading ? (
          <p className="text-center text-white/60">Cargando inscripciones...</p>
        ) : inscripciones.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-white/60">No tienes inscripciones en este momento</p>
            <button
              onClick={() => navigate('/colaboracion')}
              className="mt-4 rounded-2xl bg-cyan-500/20 px-5 py-3 text-cyan-300 hover:bg-cyan-500/30"
            >
              ← Volver a Colaboración
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* MASTERCLASS */}
            {masterclassInscripciones.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-cyan-300 mb-4">🎓 Masterclass</h2>
                <div className="grid gap-4">
                  {masterclassInscripciones.map(inscripcion => (
                    <div
                      key={inscripcion.id}
                      className="bg-gradient-to-r from-cyan-500/10 to-cyan-500/5 border border-cyan-500/30 rounded-2xl p-6 hover:border-cyan-500/50 transition"
                    >
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div
                          className="flex-1 cursor-pointer"
                          onClick={() => irAlDetalle('masterclass', inscripcion.id_referencia)}
                        >
                          <h3 className="text-xl font-semibold text-white hover:text-cyan-300 transition">
                            {inscripcion.titulo}
                          </h3>
                          <p className="text-white/60 text-sm mt-2">
                            {inscripcion.descripcion?.substring(0, 100)}...
                          </p>

                          <div className="flex gap-2 flex-wrap mt-4">
                            <span className="text-xs bg-cyan-500/20 text-cyan-300 px-3 py-1 rounded-full">
                              📅 {new Date(inscripcion.fecha).toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </span>
                            {inscripcion.universidad && (
                              <span className="text-xs bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full">
                                🏫 {inscripcion.universidad}
                              </span>
                            )}
                            {inscripcion.pais && (
                              <span className="text-xs bg-green-500/20 text-green-300 px-3 py-1 rounded-full">
                                🌎 {inscripcion.pais}
                              </span>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => handleAbandonar('masterclass', inscripcion.id_referencia)}
                          disabled={accionLoading}
                          className="bg-red-500/20 hover:bg-red-500/30 text-red-300 px-5 py-2 rounded-xl text-sm font-medium transition disabled:opacity-50"
                        >
                          {accionLoading ? '⏳ Procesando...' : '❌ Abandonar'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* MENTORÍAS */}
            {mentoriaInscripciones.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-violet-300 mb-4">🎯 Mentorías</h2>
                <div className="grid gap-4">
                  {mentoriaInscripciones.map(inscripcion => (
                    <div
                      key={inscripcion.id}
                      className="bg-gradient-to-r from-violet-500/10 to-violet-500/5 border border-violet-500/30 rounded-2xl p-6 hover:border-violet-500/50 transition"
                    >
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div
                          className="flex-1 cursor-pointer"
                          onClick={() => irAlDetalle('mentoria', inscripcion.id_referencia)}
                        >
                          <h3 className="text-xl font-semibold text-white hover:text-violet-300 transition">
                            {inscripcion.titulo}
                          </h3>
                          <p className="text-white/60 text-sm mt-2">
                            {inscripcion.descripcion?.substring(0, 100)}...
                          </p>

                          <div className="flex gap-2 flex-wrap mt-4">
                            <span className="text-xs bg-violet-500/20 text-violet-300 px-3 py-1 rounded-full">
                              📅 {new Date(inscripcion.fecha).toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </span>
                            {inscripcion.universidad && (
                              <span className="text-xs bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full">
                                🏫 {inscripcion.universidad}
                              </span>
                            )}
                            {inscripcion.pais && (
                              <span className="text-xs bg-green-500/20 text-green-300 px-3 py-1 rounded-full">
                                🌎 {inscripcion.pais}
                              </span>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => handleAbandonar('mentoria', inscripcion.id_referencia)}
                          disabled={accionLoading}
                          className="bg-red-500/20 hover:bg-red-500/30 text-red-300 px-5 py-2 rounded-xl text-sm font-medium transition disabled:opacity-50"
                        >
                          {accionLoading ? '⏳ Procesando...' : '❌ Abandonar'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PROYECTOS */}
            {proyectoInscripciones.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-emerald-300 mb-4">🚀 Proyectos</h2>
                <div className="grid gap-4">
                  {proyectoInscripciones.map(inscripcion => (
                    <div
                      key={inscripcion.id}
                      className="bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 border border-emerald-500/30 rounded-2xl p-6 hover:border-emerald-500/50 transition"
                    >
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div
                          className="flex-1 cursor-pointer"
                          onClick={() => irAlDetalle('proyecto', inscripcion.id_referencia)}
                        >
                          <div className="flex items-start gap-3">
                            <h3 className="text-xl font-semibold text-white hover:text-emerald-300 transition">
                              {inscripcion.titulo}
                            </h3>
                            <span className={`text-xs px-3 py-1 rounded-full font-medium whitespace-nowrap ${
                              inscripcion.estado === 'Planeacion' ? 'bg-yellow-500/20 text-yellow-300' :
                              inscripcion.estado === 'Desarrollo' ? 'bg-blue-500/20 text-blue-300' :
                              'bg-gray-500/20 text-gray-300'
                            }`}>
                              {inscripcion.estado}
                            </span>
                          </div>
                          <p className="text-white/60 text-sm mt-2">
                            {inscripcion.descripcion?.substring(0, 100)}...
                          </p>

                          <div className="flex gap-2 flex-wrap mt-4">
                            <span className="text-xs bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full">
                              📅 {new Date(inscripcion.fecha).toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </span>
                            {inscripcion.universidad && (
                              <span className="text-xs bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full">
                                🏫 {inscripcion.universidad}
                              </span>
                            )}
                            {inscripcion.pais && (
                              <span className="text-xs bg-green-500/20 text-green-300 px-3 py-1 rounded-full">
                                🌎 {inscripcion.pais}
                              </span>
                            )}
                          </div>
                        </div>

                        {inscripcion.estado === 'Planeacion' ? (
                          <button
                            onClick={() => handleAbandonar('proyecto', inscripcion.id_referencia, inscripcion.estado)}
                            disabled={accionLoading}
                            className="bg-red-500/20 hover:bg-red-500/30 text-red-300 px-5 py-2 rounded-xl text-sm font-medium transition disabled:opacity-50"
                          >
                            {accionLoading ? '⏳ Procesando...' : '❌ Abandonar'}
                          </button>
                        ) : (
                          <div className="bg-gray-500/20 text-gray-300 px-5 py-2 rounded-xl text-sm font-medium">
                            ⚠️ No disponible
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MisInscripciones;
