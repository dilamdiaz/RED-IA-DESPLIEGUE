import { useState } from 'react';
import { createPortal } from 'react-dom';
import toast from 'react-hot-toast';

import { crearProyecto } from '../services/colaboracionService';
import { useAuth } from '../context/AuthContext';

const CrearProyectoModal = ({
  open,
  onClose,
  onCreated
}) => {

  const { token } = useAuth();

  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [tecnologias, setTecnologias] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [cupos, setCupos] = useState('');

  // 🔥 LINK
  const [tipoLink, setTipoLink] = useState('');
  const [linkProyecto, setLinkProyecto] = useState('');

  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e) => {

    e.preventDefault();

    // 🔥 VALIDACIÓN ESTILO MENTORÍA (TOAST)
    if (
      !titulo ||
      !descripcion ||
      !fechaInicio ||
      !tipoLink ||
      !linkProyecto
    ) {
      toast.error('Completa los campos obligatorios');
      return;
    }

    try {

      setLoading(true);

      const data = await crearProyecto(
        {
          titulo,
          descripcion,
          objetivo,
          tecnologias,
          fecha_inicio: fechaInicio,
          fecha_fin: fechaFin,
          cupos: cupos ? Number(cupos) : 50,
          tipo_link: tipoLink,
          link_proyecto: linkProyecto
        },
        token
      );

      if (!data.success) {
        throw new Error(data.message);
      }

      toast.success('🚀 Proyecto creado correctamente');

      // RESET
      setTitulo('');
      setDescripcion('');
      setObjetivo('');
      setTecnologias('');
      setFechaInicio('');
      setFechaFin('');
      setCupos('');
      setTipoLink('');
      setLinkProyecto('');

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

      {/* CENTRADO ESTILO MENTORÍA */}
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

            <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs text-emerald-300">
              🚀 Nuevo Proyecto
            </span>

            <h2 className="mt-3 text-2xl font-bold text-white">
              Crear proyecto colaborativo
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
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">

          {/* TITULO */}
          <input
            className="w-full rounded-xl bg-white/5 p-3 text-white"
            placeholder="Título"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />

          {/* DESCRIPCIÓN */}
          <textarea
            className="w-full rounded-xl bg-white/5 p-3 text-white"
            placeholder="Descripción"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />

          {/* OBJETIVO */}
          <textarea
            className="w-full rounded-xl bg-white/5 p-3 text-white"
            placeholder="Objetivo (opcional)"
            value={objetivo}
            onChange={(e) => setObjetivo(e.target.value)}
          />

          {/* TECNOLOGÍAS */}
          <input
            className="w-full rounded-xl bg-white/5 p-3 text-white"
            placeholder="Tecnologías"
            value={tecnologias}
            onChange={(e) => setTecnologias(e.target.value)}
          />

          {/* FECHAS */}
          <div className="grid grid-cols-2 gap-3">

            <input
              type="date"
              className="rounded-xl bg-white/5 p-3 text-white"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
            />

            <input
              type="date"
              className="rounded-xl bg-white/5 p-3 text-white"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
            />

          </div>

          {/* CUPOS */}
          <input
            type="number"
            className="w-full rounded-xl bg-white/5 p-3 text-white"
            placeholder="Cupos"
            value={cupos}
            onChange={(e) => setCupos(e.target.value)}
          />

          {/* 🔥 TIPO LINK */}
          <select
            className="w-full rounded-xl bg-white/5 p-3 text-white"
            value={tipoLink}
            onChange={(e) => setTipoLink(e.target.value)}
          >
            <option class="text-black" value="">Tipo de enlace</option>
            <option class="text-black"value="whatsapp">WhatsApp</option>
            <option class="text-black" value="discord">Discord</option>
            <option class="text-black" value="telegram">Telegram</option>
            <option class="text-black" value="github">GitHub</option>
            <option class="text-black" value="meet">Meet</option>
            <option class="text-black" value="otro">Otro</option>
          </select>

          {/* 🔥 LINK */}
          <input
            className="w-full rounded-xl bg-white/5 p-3 text-white"
            placeholder="Link del proyecto"
            value={linkProyecto}
            onChange={(e) => setLinkProyecto(e.target.value)}
          />

          {/* BOTONES */}
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
              className="rounded-xl bg-emerald-500/20 px-4 py-2 text-emerald-300"
            >
              {loading ? 'Creando...' : 'Crear'}
            </button>

          </div>

        </form>

      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default CrearProyectoModal;