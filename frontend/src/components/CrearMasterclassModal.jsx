import { useState } from 'react';
import { createPortal } from 'react-dom';
import toast from 'react-hot-toast';

import { crearMasterclass } from '../services/colaboracionService';
import { useAuth } from '../context/AuthContext';

const CrearMasterclassModal = ({ open, onClose, onCreated }) => {
  const { token } = useAuth();

  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [enlace, setEnlace] = useState('');
  const [cupos, setCupos] = useState('');
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!titulo || !descripcion || !fecha || !hora || !enlace) {
      toast.error('Completa todos los campos obligatorios');
      return;
    }

    try {
      setLoading(true);

      const data = await crearMasterclass(
        { titulo, descripcion, fecha, hora, enlace, cupos: cupos ? Number(cupos) : undefined },
        token
      );

      if (!data.success) throw new Error(data.message);

      toast.success('🎓 Masterclass creada correctamente');

      setTitulo('');
      setDescripcion('');
      setFecha('');
      setHora('');
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
      
      {/* CENTRADO REAL COMO PROFILE MODAL */}
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

        <div className="flex justify-between items-center">
          <h2 className="text-white font-bold text-xl">
            Crear Masterclass
          </h2>

          <button onClick={onClose} className="text-white/70">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input className="w-full p-3 rounded-xl bg-white/5 text-white" placeholder="Título" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
          <textarea className="w-full p-3 rounded-xl bg-white/5 text-white" placeholder="Descripción" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />

          <div className="grid grid-cols-2 gap-3">
            <input type="date" className="p-3 rounded-xl bg-white/5 text-white" value={fecha} onChange={(e) => setFecha(e.target.value)} />
            <input type="time" className="p-3 rounded-xl bg-white/5 text-white" value={hora} onChange={(e) => setHora(e.target.value)} />
          </div>

          <input className="w-full p-3 rounded-xl bg-white/5 text-white" placeholder="Link" value={enlace} onChange={(e) => setEnlace(e.target.value)} />
          <input type="number" className="w-full p-3 rounded-xl bg-white/5 text-white" placeholder="Cupos" value={cupos} onChange={(e) => setCupos(e.target.value)} />

          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-white/70">
              Cancelar
            </button>

            <button type="submit" disabled={loading} className="px-4 py-2 bg-cyan-500/20 text-cyan-300 rounded-xl">
              {loading ? 'Creando...' : 'Crear'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default CrearMasterclassModal;