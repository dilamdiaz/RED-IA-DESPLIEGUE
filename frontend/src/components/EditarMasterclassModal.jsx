import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import toast from 'react-hot-toast';

import { useAuth } from '../context/AuthContext';

const EditarMasterclassModal = ({
  open,
  onClose,
  masterclass,
  onUpdated,
}) => {

  const { token } = useAuth();

  // ======================================
  // STATES
  // ======================================
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [enlace, setEnlace] = useState('');
  const [cupos, setCupos] = useState('');

  const [loading, setLoading] = useState(false);

  // ======================================
  // CARGAR DATOS
  // ======================================
  useEffect(() => {

    if (masterclass) {

      setTitulo(masterclass.titulo || '');

      setDescripcion(masterclass.descripcion || '');

      setFecha(
        masterclass.fecha
          ? masterclass.fecha.split('T')[0]
          : ''
      );

      setHora(masterclass.hora || '');

      setEnlace(masterclass.enlace || '');

      setCupos(masterclass.cupos || '');
    }

  }, [masterclass]);

  // ======================================
  // ESC
  // ======================================
  useEffect(() => {

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () =>
      window.removeEventListener(
        'keydown',
        handleEscape
      );

  }, [onClose]);

  // ======================================
  // BLOQUEAR SCROLL
  // ======================================
  useEffect(() => {

    document.body.style.overflow =
      open ? 'hidden' : 'auto';

    return () => {
      document.body.style.overflow = 'auto';
    };

  }, [open]);

  if (!open) return null;

  // ======================================
  // GUARDAR
  // ======================================
  const handleSubmit = async (e) => {

    e.preventDefault();

    if (
      !titulo ||
      !descripcion ||
      !fecha ||
      !hora ||
      !enlace
    ) {
      toast.error(
        'Completa todos los campos obligatorios'
      );

      return;
    }

    try {

      setLoading(true);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/colaboracion/masterclass/${masterclass.id}`,
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
        ...masterclass,
        titulo,
        descripcion,
        fecha,
        hora,
        enlace,
        cupos,
      });

      toast.success(
        '✏️ Masterclass actualizada correctamente'
      );

      onClose();

    } catch (err) {

      toast.error(err.message);

    } finally {

      setLoading(false);
    }
  };

  const modalContent = (
    <div
      className="
        fixed inset-0 z-[9999]
        flex items-center justify-center
        bg-black/70
        backdrop-blur-sm
        p-4
      "
      onClick={onClose}
    >

      {/* MODAL */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          w-full max-w-xl
          max-h-[90vh]
          overflow-y-auto

          rounded-[32px]
          border border-white/10
          bg-[#0b1120]
          p-6

          shadow-[0_20px_80px_rgba(0,0,0,0.6)]
        "
      >

        {/* HEADER */}
        <div className="flex items-center justify-between">

          <div>

            <span
              className="
                rounded-full
                bg-cyan-500/20
                px-3 py-1
                text-xs
                text-cyan-300
              "
            >
              ✏️ Editar Masterclass
            </span>

            <h2
              className="
                mt-3
                text-2xl
                font-bold
                text-white
              "
            >
              Actualizar información
            </h2>

          </div>

          <button
            onClick={onClose}
            className="
              rounded-xl
              bg-white/10
              p-2
              text-white/70
              transition
              hover:bg-white/20
              hover:text-white
            "
          >
            ✕
          </button>

        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-5"
        >

          {/* TITULO */}
          <div>

            <label className="mb-2 block text-sm text-white/70">
              Título
            </label>

            <input
              type="text"
              value={titulo}
              onChange={(e) =>
                setTitulo(e.target.value)
              }
              className="
                w-full
                rounded-2xl
                border border-white/10
                bg-white/5
                px-4 py-3
                text-white
                outline-none
                transition
                focus:border-cyan-400
              "
            />

          </div>

          {/* DESCRIPCIÓN */}
          <div>

            <label className="mb-2 block text-sm text-white/70">
              Descripción
            </label>

            <textarea
              rows="4"
              value={descripcion}
              onChange={(e) =>
                setDescripcion(e.target.value)
              }
              className="
                w-full
                rounded-2xl
                border border-white/10
                bg-white/5
                px-4 py-3
                text-white
                outline-none
                transition
                focus:border-cyan-400
              "
            />

          </div>

          {/* FECHA + HORA */}
          <div className="grid gap-5 md:grid-cols-2">

            <div>

              <label className="mb-2 block text-sm text-white/70">
                Fecha
              </label>

              <input
                type="date"
                value={fecha}
                onChange={(e) =>
                  setFecha(e.target.value)
                }
                className="
                  w-full
                  rounded-2xl
                  border border-white/10
                  bg-white/5
                  px-4 py-3
                  text-white
                  outline-none
                  transition
                  focus:border-cyan-400
                "
              />

            </div>

            <div>

              <label className="mb-2 block text-sm text-white/70">
                Hora
              </label>

              <input
                type="time"
                value={hora}
                onChange={(e) =>
                  setHora(e.target.value)
                }
                className="
                  w-full
                  rounded-2xl
                  border border-white/10
                  bg-white/5
                  px-4 py-3
                  text-white
                  outline-none
                  transition
                  focus:border-cyan-400
                "
              />

            </div>

          </div>

          {/* ENLACE */}
          <div>

            <label className="mb-2 block text-sm text-white/70">
              Link de la masterclass
            </label>

            <input
              type="url"
              value={enlace}
              onChange={(e) =>
                setEnlace(e.target.value)
              }
              placeholder="https://meet.google.com/..."
              className="
                w-full
                rounded-2xl
                border border-white/10
                bg-white/5
                px-4 py-3
                text-white
                outline-none
                transition
                focus:border-cyan-400
              "
            />

          </div>

          {/* CUPOS */}
          <div>

            <label className="mb-2 block text-sm text-white/70">
              Cupos
            </label>

            <input
              type="number"
              min="1"
              value={cupos}
              onChange={(e) =>
                setCupos(e.target.value)
              }
              placeholder="Ej: 50"
              className="
                w-full
                rounded-2xl
                border border-white/10
                bg-white/5
                px-4 py-3
                text-white
                outline-none
                transition
                focus:border-cyan-400
              "
            />

          </div>

          {/* BOTONES */}
          <div
            className="
              flex justify-end gap-3
              border-t border-white/10
              pt-6
            "
          >

            <button
              type="button"
              onClick={onClose}
              className="
                rounded-2xl
                border border-white/10
                px-5 py-3
                text-white/70
                transition
                hover:bg-white/5
              "
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="
                rounded-2xl
                bg-cyan-500/20
                px-5 py-3
                text-cyan-300
                transition
                hover:bg-cyan-500/30
                disabled:opacity-50
              "
            >
              {loading
                ? 'Guardando...'
                : 'Guardar cambios'}
            </button>

          </div>

        </form>

      </div>

    </div>
  );

  return createPortal(
    modalContent,
    document.body
  );
};

export default EditarMasterclassModal;