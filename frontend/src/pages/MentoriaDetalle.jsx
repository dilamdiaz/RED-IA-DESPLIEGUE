// src/pages/MentoriaDetalle.jsx

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
import { inscribirse } from '../services/colaboracionService';

import { formatDateLong } from '../utils/date';

import EditarMentoriaModal from '../components/EditarMentoriaModal';
import InscripcionModal from '../components/InscripcionModal';

const MentoriaDetalle = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const { token, user } = useAuth();

  const [mentoria, setMentoria] = useState(null);

  const [loading, setLoading] = useState(true);
  const [loadingInscripcion, setLoadingInscripcion] = useState(false);

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [openEditar, setOpenEditar] = useState(false);
  const [openInscritos, setOpenInscritos] = useState(false);

  // =========================
  // 📦 CARGAR DETALLE
  // =========================
  const cargarDetalle = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/colaboracion/mentorias/${id}`,
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

      setMentoria(data.data);

    } catch (err) {

      setError(err.message);

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {

    if (id && token) {
      cargarDetalle();
    }

  }, [id, token]);

  // =========================
  // 🔐 PERMISOS
  // =========================
  const idUsuario = user?.id;

  const idCreador = mentoria?.id_coordinador;

  const esCreador =
    idUsuario &&
    idCreador &&
    Number(idUsuario) === Number(idCreador);

  const yaInscrito =
    Number(mentoria?.ya_inscrito) > 0;

  const puedeInscribirse =
    !esCreador &&
    !yaInscrito &&
    (
      mentoria?.cupos === null ||
      mentoria?.cupos > 0
    );

  // =========================
  // 📝 INSCRIPCIÓN
  // =========================
  const handleInscribirse = async () => {

    try {

      setLoadingInscripcion(true);

      setError('');
      setSuccess('');

      const data = await inscribirse(
        'mentoria',
        id,
        token
      );

      if (!data.success) {
        throw new Error(data.message);
      }

      setSuccess(
        'Te inscribiste correctamente a la mentoría ✅'
      );

      // ✅ ACTUALIZAR CUPOS
      setMentoria((prev) => ({
        ...prev,

        cupos:
          prev.cupos !== null
            ? prev.cupos - 1
            : null,

        ya_inscrito: 1
      }));

    } catch (err) {

      setError(err.message);

    } finally {

      setLoadingInscripcion(false);

    }
  };

  // =========================
  // ✏️ EDITAR
  // =========================
  const handleEditar = () => {
    setOpenEditar(true);
  };

  // =========================
  // 🗑 ELIMINAR
  // =========================
  const handleEliminar = async () => {

    try {

      const confirmar = window.confirm(
        '¿Seguro que deseas eliminar esta mentoría?'
      );

      if (!confirmar) return;

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/colaboracion/mentorias/${id}`,
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
  // ⏳ LOADING
  // =========================
  if (loading) {
    return (
      <p className="mt-10 text-center text-white">
        Cargando mentoría...
      </p>
    );
  }

  if (error && !mentoria) {
    return (
      <p className="mt-10 text-center text-red-400">
        {error}
      </p>
    );
  }

  if (!mentoria) return null;

  return (
    <>
      {/* ✏️ MODAL EDITAR */}
      <EditarMentoriaModal
        open={openEditar}
        onClose={() => setOpenEditar(false)}
        mentoria={mentoria}
        onUpdated={(dataActualizada) =>
          setMentoria(dataActualizada)
        }
      />

      {/* 👥 MODAL INSCRITOS */}
      <InscripcionModal
        open={openInscritos}
        data={mentoria}
        tipo="mentoria"
        onClose={() => setOpenInscritos(false)}
        onRefresh={cargarDetalle}
      />

      <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-white/5 p-8 text-white backdrop-blur-xl">

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

          <span className="rounded-full bg-violet-500/20 px-4 py-2 text-sm text-violet-300">
            🧠 Mentoría Internacional
          </span>

          {mentoria.universidad && (
            <span className="rounded-full bg-blue-500/20 px-4 py-2 text-sm text-blue-300">
              🏫 {mentoria.universidad}
            </span>
          )}

          {mentoria.pais && (
            <span className="rounded-full bg-green-500/20 px-4 py-2 text-sm text-green-300">
              🌎 {mentoria.pais}
            </span>
          )}

        </div>

        {/* TITULO */}
        <h1 className="mt-6 text-4xl font-bold">
          {mentoria.titulo}
        </h1>

        {/* INFO CREADOR */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">

          <h3 className="mb-3 text-sm text-white/50">
            Información de la mentoría
          </h3>

          <div className="flex flex-col gap-3">

            <div className="flex items-center gap-2">
              <span className="text-white/50">
                👤 Mentor:
              </span>

              <span className="font-medium text-white">
                {mentoria.creador}
              </span>
            </div>

            {mentoria.universidad && (
              <div className="flex items-center gap-2">
                <span className="text-white/50">
                  🏫 Universidad:
                </span>

                <span>
                  {mentoria.universidad}
                </span>
              </div>
            )}

            {mentoria.pais && (
              <div className="flex items-center gap-2">
                <span className="text-white/50">
                  🌎 País:
                </span>

                <span>
                  {mentoria.pais}
                </span>
              </div>
            )}

            {mentoria.especialidad && (
              <div className="flex items-center gap-2">
                <span className="text-white/50">
                  🎯 Especialidad:
                </span>

                <span>
                  {mentoria.especialidad}
                </span>
              </div>
            )}

          </div>
        </div>

        {/* DESCRIPCIÓN */}
        <div className="mt-8 rounded-3xl border border-white/10 bg-black/20 p-6">

          <h2 className="mb-4 text-xl font-semibold">
            Descripción
          </h2>

          <p className="leading-relaxed text-white/70">
            {mentoria.descripcion}
          </p>

        </div>

        {/* INFO EXTRA */}
        <div className="mt-8 grid gap-5 md:grid-cols-4">

          {/* FECHA */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">

            <p className="text-sm text-white/50">
              Fecha
            </p>

            <h3 className="mt-2 text-lg font-semibold">
              📅 {formatDateLong(mentoria.fecha)}
            </h3>

          </div>

          {/* HORA */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">

            <p className="text-sm text-white/50">
              Hora
            </p>

            <h3 className="mt-2 text-lg font-semibold">
              🕒 {mentoria.hora || 'Por definir'}
            </h3>

          </div>

          {/* MODALIDAD */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">

            <p className="text-sm text-white/50">
              Modalidad
            </p>

            <h3 className="mt-2 text-lg font-semibold">
              🌐 Virtual
            </h3>

          </div>

          {/* CUPOS */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">

            <p className="text-sm text-white/50">
              Cupos disponibles
            </p>

            <h3 className="mt-2 text-lg font-semibold">
              👥 {mentoria.cupos ?? 'Sin límite'}
            </h3>

          </div>

        </div>

        {mentoria.enlace && (

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
              Link oficial de la mentoria
            </p>

            <a
              href={mentoria.enlace}
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
              🔗 Unirse a la mentoria
            </a>

          </div>
        )}

        {/* ALERTAS */}
        {loadingInscripcion && (

          <div
            className="
      mt-6
      rounded-2xl
      border border-violet-400/20
      bg-violet-500/10
      p-4
      text-violet-200
      flex items-center gap-3
    "
          >
            <div
              className="
        h-5 w-5
        animate-spin
        rounded-full
        border-2
        border-violet-300
        border-t-transparent
      "
            />

            Procesando inscripción y enviando correo...
          </div>
        )}
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

          {esCreador && (
            <>
              <button
                onClick={handleEditar}
                className="rounded-2xl bg-white/10 px-5 py-3 hover:bg-white/20"
              >
                Editar
              </button>

              <button
                onClick={() => setOpenInscritos(true)}
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
                  ? 'bg-violet-500/10 text-violet-200 cursor-not-allowed'
                  : 'bg-violet-500/20 text-violet-300 hover:bg-violet-500/30'
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
          border-violet-300
          border-t-transparent
        "
                  />

                  Enviando correo...
                </>
              ) : (
                <>
                  🚀 Solicitar Mentoría
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

      </div>
    </>
  );
};

export default MentoriaDetalle;