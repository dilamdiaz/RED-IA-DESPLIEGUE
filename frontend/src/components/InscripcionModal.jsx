// src/components/InscripcionModal.jsx

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

import {
  obtenerInscritos,
} from '../services/colaboracionService';

const InscripcionModal = ({
  open,
  data,
  tipo,
  onClose,
}) => {

  const { token } = useAuth();

  const [inscritos, setInscritos] = useState([]);
  const [loading, setLoading] = useState(false);

  // ======================
  // CARGAR INSCRITOS
  // ======================
  const cargarInscritos = async () => {

    try {

      setLoading(true);

      const res = await obtenerInscritos(
        tipo,
        data.id,
        token
      );

      setInscritos(res.data || []);

    } catch (error) {

      console.error(error);
      setInscritos([]);

    } finally {

      setLoading(false);

    }
  };

  // ======================
  // EFFECT OPEN
  // ======================
  useEffect(() => {

    if (open && data) {
      cargarInscritos();
    }

  }, [open, data]);

  if (!open || !data) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">

      <div className="w-full max-w-3xl rounded-3xl border border-white/10 bg-[#0f172a] p-6 text-white shadow-2xl">

        {/* HEADER */}
        <div className="flex justify-between items-start">

          <div>

            <h2 className="text-2xl font-bold">
              👥 Inscritos
            </h2>

            <p className="mt-1 text-sm text-white/60">
              {data.titulo}
            </p>


          </div>

          <button
            onClick={onClose}
            className="rounded-xl bg-white/10 px-3 py-2 hover:bg-white/20"
          >
            ✖
          </button>

        </div>

        {/* LISTA */}
        <div className="mt-8 max-h-[500px] space-y-3 overflow-y-auto">

          {loading ? (

            <p className="py-10 text-center text-white/60">
              Cargando inscritos...
            </p>

          ) : inscritos.length === 0 ? (

            <p className="py-10 text-center text-white/60">
              No hay inscritos todavía
            </p>

          ) : (

            inscritos.map((u) => (

              <div
                key={u.id_usuario}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10"
              >

                <div className="flex items-start justify-between gap-4">

                  <div className="flex-1">

                    <h3 className="font-semibold text-white">
                      {u.nombre}
                    </h3>

                    <p className="mt-1 text-sm text-white/60">
                      {u.email}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">

                      {u.universidad && (
                        <span className="rounded-full bg-blue-500/20 px-2 py-1 text-xs text-blue-300">
                          🏫 {u.universidad}
                        </span>
                      )}

                      {u.pais && (
                        <span className="rounded-full bg-green-500/20 px-2 py-1 text-xs text-green-300">
                          🌎 {u.pais}
                        </span>
                      )}

                    </div>

                  </div>

                  <span className="rounded-full bg-cyan-500/20 px-2 py-1 text-xs text-cyan-300">
                    {new Date(u.fecha_inscripcion).toLocaleDateString()}
                  </span>

                </div>

              </div>

            ))

          )}

        </div>

      </div>

    </div>
  );
};

export default InscripcionModal;