// src/components/ProfileModal.jsx

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  RefreshCw,
  Shield,
  GraduationCap,
  Mail,
  LogOut,
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';

const rolNombres = {
  1: 'Administrador',
  2: 'Coordinador',
  3: 'Docente',
  4: 'Estudiante',
};

const universidadNombres = {
  1: 'Universidad Nacional',
  2: 'University of Oxford',
  3: 'MIT',
};

const ProfileModal = ({ open, onClose }) => {
  const { user, token, setUser, logout } = useAuth();

  const [profile, setProfile] = useState(user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadProfile = async () => {
    if (!token) return;

    try {
      setLoading(true);
      setError('');

      const data = await authService.getProfile(token);
      setProfile(data);
      setUser(data);
    } catch (err) {
      setError(err.message || 'Error al cargar perfil');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && token) loadProfile();
  }, [open, token]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : 'auto';
    return () => (document.body.style.overflow = 'auto');
  }, [open]);

  if (!open) return null;

  const roleId = profile?.id_rol ?? profile?.rol;

  const roleName =
    rolNombres[Number(roleId)] || profile?.rol || 'No disponible';

  const universityName =
    profile?.universidad ||
    universidadNombres[Number(profile?.id_universidad)] ||
    'No disponible';

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* MODAL */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          w-full max-w-2xl
          max-h-[90vh]
          overflow-y-auto

          rounded-[32px]
          border border-white/10
          bg-[#0b1120]
          shadow-[0_20px_80px_rgba(0,0,0,0.6)]
        "
      >
        {/* HEADER */}
        <div className="relative overflow-hidden border-b border-white/10 bg-gradient-to-r from-blue-500/20 via-cyan-500/10 to-violet-500/20 p-8">
          <button
            onClick={onClose}
            className="absolute right-5 top-5 rounded-xl bg-white/10 p-2 text-white/70 hover:bg-white/20 hover:text-white"
          >
            <X size={18} />
          </button>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-white/10 text-4xl">
              👤
            </div>

            <div>
              <p className="text-sm text-cyan-300">Perfil Académico</p>

              <h2 className="mt-2 text-3xl font-bold text-white">
                {profile?.nombre || 'Usuario'}
              </h2>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-4 py-2 text-xs text-blue-300">
                  <Shield size={14} />
                  {roleName}
                </span>

                <span className="inline-flex items-center gap-2 rounded-full bg-violet-500/20 px-4 py-2 text-xs text-violet-300">
                  <GraduationCap size={14} />
                  {universityName}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* BODY */}
        <div className="space-y-5 p-8">
          {error && (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-red-300">
              {error}
            </div>
          )}

          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center gap-2 text-white/50">
                <Mail size={16} />
                <p className="text-sm">Correo electrónico</p>
              </div>
              <h3 className="mt-3 text-lg font-semibold text-white break-all">
                {profile?.email || 'No disponible'}
              </h3>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-white/50">Rol dentro de la plataforma</p>
              <h3 className="mt-3 text-lg font-semibold text-white">
                {roleName}
              </h3>
            </div>

            <div className="md:col-span-2 rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-white/50">Institución académica</p>
              <h3 className="mt-3 text-lg font-semibold text-white">
                {universityName}
              </h3>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex flex-wrap justify-end gap-3 border-t border-white/10 pt-6">
            <button
              onClick={loadProfile}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-2xl bg-cyan-500/20 px-5 py-3 text-sm text-cyan-300 hover:bg-cyan-500/30"
            >
              <RefreshCw size={16} />
              {loading ? 'Actualizando...' : 'Actualizar perfil'}
            </button>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-2xl bg-red-500/20 px-5 py-3 text-sm text-red-300 hover:bg-red-500/30"
            >
              <LogOut size={16} />
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default ProfileModal;