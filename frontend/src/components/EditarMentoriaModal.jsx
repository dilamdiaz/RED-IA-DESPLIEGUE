import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import toast from 'react-hot-toast';

import { useAuth } from '../context/AuthContext';

const EditarMentoriaModal = ({
  open,
  onClose,
  mentoria,
  onUpdated,
}) => {

  const { token } = useAuth();

  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [especialidad, setEspecialidad] = useState('');
  const [enlace, setEnlace] = useState('');
  const [cupos, setCupos] = useState('');

  const [loading, setLoading] = useState(false);

  useEffect(() => {

    if (mentoria) {

      setTitulo(mentoria.titulo || '');
      setDescripcion(mentoria.descripcion || '');

      setFecha(
        mentoria.fecha
          ? mentoria.fecha.split('T')[0]
          : ''
      );

      setHora(mentoria.hora || '');

      setEspecialidad(mentoria.especialidad || '');
      setEnlace(mentoria.enlace || '');
      setCupos(mentoria.cupos || '');
    }

  }, [mentoria]);

  if (!open) return null;

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!titulo || !descripcion || !fecha || !hora) {
      toast.error('Completa los campos obligatorios');
      return;
    }

    try {

      setLoading(true);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/colaboracion/mentorias/${mentoria.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            titulo,
            descripcion,
            fecha,
            hora,
            especialidad,
            enlace,
            cupos,
          }),
        }
      );

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      onUpdated({
        ...mentoria,
        titulo,
        descripcion,
        fecha,
        hora,
        especialidad,
        enlace,
        cupos,
      });

      toast.success('🧠 Mentoría actualizada');

      onClose();

    } catch (err) {

      toast.error(err.message);

    } finally {

      setLoading(false);

    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md">

      <div
        onClick={(e) => e.stopPropagation()}
        className="
          fixed
          top-1/2 left-1/2
          -translate-x-1/2 -translate-y-1/2

          w-full max-w-xl
          max-h-[90vh]
          overflow-y-auto

          rounded-3xl
          border border-white/10
          bg-[#0f172a]
          p-6
          shadow-2xl
        "
      >

        {/* HEADER */}
        <div className="flex items-center justify-between">

          <div>
            <span className="rounded-full bg-violet-500/20 px-3 py-1 text-xs text-violet-300">
              🧠 Editar Mentoría
            </span>

            <h2 className="mt-3 text-2xl font-bold text-white">
              Actualizar mentoría
            </h2>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl bg-white/5 px-3 py-2 text-white/70 hover:bg-white/10"
          >
            ✕
          </button>

        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">

          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Título"
            className="w-full rounded-2xl bg-white/5 p-3 text-white"
          />

          <textarea
            rows="4"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Descripción"
            className="w-full rounded-2xl bg-white/5 p-3 text-white"
          />

          <input
            type="text"
            value={especialidad}
            onChange={(e) => setEspecialidad(e.target.value)}
            placeholder="Especialidad"
            className="w-full rounded-2xl bg-white/5 p-3 text-white"
          />

          <div className="grid grid-cols-2 gap-3">

            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="rounded-2xl bg-white/5 p-3 text-white"
            />

            <input
              type="time"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
              className="rounded-2xl bg-white/5 p-3 text-white"
            />

          </div>

          <input
            type="url"
            value={enlace}
            onChange={(e) => setEnlace(e.target.value)}
            placeholder="Link de la mentoría"
            className="w-full rounded-2xl bg-white/5 p-3 text-white"
          />

          <input
            type="number"
            value={cupos}
            onChange={(e) => setCupos(e.target.value)}
            placeholder="Cupos"
            className="w-full rounded-2xl bg-white/5 p-3 text-white"
          />

          <div className="flex justify-end gap-3">

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-white/70"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-violet-500/20 px-4 py-2 text-violet-300"
            >
              {loading ? 'Guardando...' : 'Guardar cambios'}
            </button>

          </div>

        </form>

      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default EditarMentoriaModal;