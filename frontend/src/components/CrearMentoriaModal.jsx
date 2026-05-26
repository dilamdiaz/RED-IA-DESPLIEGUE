import { useState } from 'react';
import { createPortal } from 'react-dom';

import toast from 'react-hot-toast';

import { crearMentoria } from '../services/colaboracionService';
import { useAuth } from '../context/AuthContext';

const CrearMentoriaModal = ({
  open,
  onClose,
  onCreated
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

  if (!open) return null;

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

      const data = await crearMentoria(
        {
          titulo,
          descripcion,
          fecha,
          hora,
          especialidad,
          enlace,
          cupos:
            cupos
              ? Number(cupos)
              : undefined
        },
        token
      );

      if (!data.success) {
        throw new Error(data.message);
      }

      toast.success(
        '🧠 Mentoría creada correctamente'
      );

      // RESET
      setTitulo('');
      setDescripcion('');
      setFecha('');
      setHora('');
      setEspecialidad('');
      setEnlace('');
      setCupos('');

      onCreated?.();

      onClose();

    } catch (err) {

      toast.error(err.message);

    } finally {

      setLoading(false);
    }
  };

  const modalContent = (

    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md">

      {/* CENTRADO REAL */}
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
        <div className="flex justify-between items-center">

          <div>

            <span className="rounded-full bg-violet-500/20 px-3 py-1 text-xs text-violet-300">
              🧠 Nueva Mentoría
            </span>

            <h2 className="mt-3 text-2xl font-bold text-white">
              Crear mentoría académica
            </h2>

          </div>

          <button
            onClick={onClose}
            className="text-white/70"
          >
            ✕
          </button>

        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-4"
        >

          {/* TITULO */}
          <input
            className="
              w-full
              rounded-xl
              bg-white/5
              p-3
              text-white
            "
            placeholder="Título"
            value={titulo}
            onChange={(e) =>
              setTitulo(e.target.value)
            }
          />

          {/* DESCRIPCION */}
          <textarea
            className="
              w-full
              rounded-xl
              bg-white/5
              p-3
              text-white
            "
            placeholder="Descripción"
            value={descripcion}
            onChange={(e) =>
              setDescripcion(e.target.value)
            }
          />

          {/* FECHA + HORA */}
          <div className="grid grid-cols-2 gap-3">

            <input
              type="date"
              className="
                rounded-xl
                bg-white/5
                p-3
                text-white
              "
              value={fecha}
              onChange={(e) =>
                setFecha(e.target.value)
              }
            />

            <input
              type="time"
              className="
                rounded-xl
                bg-white/5
                p-3
                text-white
              "
              value={hora}
              onChange={(e) =>
                setHora(e.target.value)
              }
            />

          </div>

          {/* ESPECIALIDAD */}
          <input
            className="
              w-full
              rounded-xl
              bg-white/5
              p-3
              text-white
            "
            placeholder="Especialidad"
            value={especialidad}
            onChange={(e) =>
              setEspecialidad(e.target.value)
            }
          />

          {/* ENLACE */}
          <input
            className="
              w-full
              rounded-xl
              bg-white/5
              p-3
              text-white
            "
            placeholder="Link de la mentoría"
            value={enlace}
            onChange={(e) =>
              setEnlace(e.target.value)
            }
          />

          {/* CUPOS */}
          <input
            type="number"
            className="
              w-full
              rounded-xl
              bg-white/5
              p-3
              text-white
            "
            placeholder="Cupos"
            value={cupos}
            onChange={(e) =>
              setCupos(e.target.value)
            }
          />

          {/* BOTONES */}
          <div className="flex justify-end gap-3">

            <button
              type="button"
              onClick={onClose}
              className="
                px-4 py-2
                text-white/70
              "
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="
                rounded-xl
                bg-violet-500/20
                px-4 py-2
                text-violet-300
              "
            >
              {loading
                ? 'Creando...'
                : 'Crear'}
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

export default CrearMentoriaModal;