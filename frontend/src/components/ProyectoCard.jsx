const ProyectoCard = ({ proyecto, onClick }) => {

  // 🎨 COLOR ESTADO
  const getEstadoStyles = () => {

    switch (proyecto.estado) {

      case 'Planeacion':
        return 'bg-yellow-500/20 text-yellow-300';

      case 'En desarrollo':
        return 'bg-cyan-500/20 text-cyan-300';

      case 'Finalizado':
        return 'bg-red-500/20 text-red-300';

      default:
        return 'bg-white/10 text-white/70';
    }
  };

  // 👥 DISPONIBILIDAD
  const getDisponibilidad = () => {

    if (proyecto.cupos === null) {
      return {
        texto: 'Sin límite',
        estilos: 'bg-emerald-500/20 text-emerald-300'
      };
    }

    if (proyecto.cupos <= 0) {
      return {
        texto: 'Sin cupos',
        estilos: 'bg-red-500/20 text-red-300'
      };
    }

    if (proyecto.cupos <= 3) {
      return {
        texto: `${proyecto.cupos} cupos`,
        estilos: 'bg-yellow-500/20 text-yellow-300'
      };
    }

    return {
      texto: `${proyecto.cupos} cupos`,
      estilos: 'bg-emerald-500/20 text-emerald-300'
    };
  };

  // 🔥 LINKS (NUEVO)
  const getLinkInfo = () => {

    switch (proyecto.tipo_link) {

      case 'whatsapp':
        return { icon: '💬', label: 'WhatsApp', color: 'bg-green-500/20 text-green-300' };

      case 'discord':
        return { icon: '🎮', label: 'Discord', color: 'bg-indigo-500/20 text-indigo-300' };

      case 'telegram':
        return { icon: '✈️', label: 'Telegram', color: 'bg-sky-500/20 text-sky-300' };

      case 'github':
        return { icon: '💻', label: 'GitHub', color: 'bg-white/10 text-white' };

      case 'meet':
        return { icon: '📹', label: 'Meet', color: 'bg-red-500/20 text-red-300' };

      case 'otro':
        return { icon: '🔗', label: 'Enlace', color: 'bg-white/10 text-white/70' };

      default:
        return null;
    }
  };

  const disponibilidad = getDisponibilidad();
  const linkInfo = getLinkInfo();

  const openLink = (e) => {

    e.stopPropagation();

    if (proyecto.link_proyecto) {
      window.open(proyecto.link_proyecto, '_blank');
    }
  };

  return (
    <div
      onClick={onClick}
      className="
        group
        cursor-pointer
        rounded-3xl
        border border-white/10
        bg-white/5
        backdrop-blur-xl
        p-5
        transition-all
        duration-300
        hover:scale-[1.02]
        hover:border-emerald-400/40
        hover:bg-white/10
        hover:shadow-2xl
      "
    >

      {/* HEADER */}
      <div className="flex items-start justify-between gap-3">

        <div className="flex-1">

          <div className="flex flex-wrap items-center gap-2">

            <span className="inline-flex rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-medium text-emerald-300">
              🚀 Proyecto
            </span>

            {proyecto.estado && (
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${getEstadoStyles()}`}>
                ⚡ {proyecto.estado}
              </span>
            )}

            {/* 🔥 BADGE LINK */}
            {linkInfo && (
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${linkInfo.color}`}>
                {linkInfo.icon} {linkInfo.label}
              </span>
            )}

          </div>

          <h2 className="mt-3 text-xl font-bold text-white">
            {proyecto.titulo}
          </h2>

        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-2xl group-hover:scale-110">
          💡
        </div>

      </div>

      {/* DESCRIPCIÓN */}
      <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-white/70">
        {proyecto.descripcion}
      </p>

      {/* BADGES */}
      <div className="mt-5 flex flex-wrap gap-2">

        {proyecto.universidad && (
          <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs text-blue-300">
            🏫 {proyecto.universidad}
          </span>
        )}

        {proyecto.pais && (
          <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs text-green-300">
            🌎 {proyecto.pais}
          </span>
        )}

        {/* DISPONIBILIDAD */}
        <span className={`rounded-full px-3 py-1 text-xs font-medium ${disponibilidad.estilos}`}>
          👥 {disponibilidad.texto}
        </span>

      </div>

      {/* 🔥 LINK SECTION (NUEVO) */}
      {proyecto.link_proyecto && linkInfo && (
        <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 p-3">

          <div className="flex items-center gap-2 text-sm text-white/80">
            <span>{linkInfo.icon}</span>
            <span>{linkInfo.label} disponible</span>
          </div>

          <button
            onClick={openLink}
            className="rounded-xl bg-emerald-500/20 px-3 py-1 text-xs text-emerald-300 hover:bg-emerald-500/30"
          >
            Conectar
          </button>

        </div>
      )}

      {/* INFO EXTRA */}
      <div className="mt-5 grid grid-cols-2 gap-3">

        <div className="rounded-2xl bg-black/20 p-3 border border-white/5">
          <p className="text-xs text-white/40">Tipo</p>
          <p className="mt-1 text-sm font-medium text-white">🌍 Internacional</p>
        </div>

        <div className="rounded-2xl bg-black/20 p-3 border border-white/5">
          <p className="text-xs text-white/40">Modalidad</p>
          <p className="mt-1 text-sm font-medium text-white">🤝 Colaborativa</p>
        </div>

      </div>

      {/* FOOTER */}
      <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">

        <div>
          <p className="text-sm font-medium text-white">
            {proyecto.creador}
          </p>
          <p className="text-xs text-white/50">
            Proyecto colaborativo
          </p>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onClick?.();
          }}
          className="rounded-xl bg-emerald-500/20 px-4 py-2 text-sm font-medium text-emerald-300 hover:bg-emerald-500/30"
        >
          Ver más
        </button>

      </div>

    </div>
  );
};

export default ProyectoCard;