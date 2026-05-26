// src/components/MasterclassCard.jsx

const MasterclassCard = ({ masterclass, onClick }) => {

    const cupos = masterclass.cupos;

    // ======================================
    // FORMATEAR HORA
    // ======================================
    const horaFormateada = masterclass.hora
        ? new Date(`1970-01-01T${masterclass.hora}`)
            .toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
            })
        : 'No definida';

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
                hover:border-cyan-400/40
                hover:bg-white/10
                hover:shadow-2xl
            "
        >

            {/* HEADER */}
            <div className="flex items-start justify-between gap-3">

                <div className="flex-1">

                    <div className="flex flex-wrap items-center gap-2">

                        <span
                            className="
                                inline-flex
                                rounded-full
                                bg-cyan-500/20
                                px-3 py-1
                                text-xs font-medium
                                text-cyan-300
                            "
                        >
                            🎓 Masterclass
                        </span>

                        {/* DISPONIBILIDAD */}
                        {(cupos === null || cupos > 5) && (
                            <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs text-emerald-300">
                                ✅ Disponible
                            </span>
                        )}

                        {cupos > 0 && cupos <= 5 && (
                            <span className="rounded-full bg-yellow-500/20 px-3 py-1 text-xs text-yellow-300">
                                ⚠️ Últimos cupos
                            </span>
                        )}

                        {cupos === 0 && (
                            <span className="rounded-full bg-red-500/20 px-3 py-1 text-xs text-red-300">
                                ❌ Sin cupos
                            </span>
                        )}

                    </div>

                    <h2 className="mt-4 text-xl font-bold text-white transition group-hover:text-cyan-200">
                        {masterclass.titulo}
                    </h2>

                </div>

                {/* ICON */}
                <div
                    className="
                        flex h-14 w-14
                        items-center justify-center
                        rounded-2xl
                        border border-cyan-500/20
                        bg-cyan-500/10
                        text-2xl
                    "
                >
                    📚
                </div>

            </div>

            {/* DESCRIPCIÓN */}
            <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-white/70">
                {masterclass.descripcion}
            </p>

            {/* INFO BADGES */}
            <div className="mt-5 flex flex-wrap gap-2">

                {masterclass.universidad && (
                    <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs text-blue-300">
                        🏫 {masterclass.universidad}
                    </span>
                )}

                {masterclass.pais && (
                    <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs text-green-300">
                        🌎 {masterclass.pais}
                    </span>
                )}

                <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70">
                    👥 {cupos ?? '∞'} cupos
                </span>

            </div>

            {/* MINI INFO */}
            <div className="mt-5 grid grid-cols-2 gap-3">

                {/* MODALIDAD */}
                <div className="rounded-2xl border border-white/10 bg-black/20 p-3">

                    <p className="text-xs text-white/50">
                        Modalidad
                    </p>

                    <h4 className="mt-1 text-sm font-semibold text-white">
                        🌐 Virtual
                    </h4>

                </div>

                {/* HORA */}
                <div className="rounded-2xl border border-white/10 bg-black/20 p-3">

                    <p className="text-xs text-white/50">
                        Hora
                    </p>

                    <h4 className="mt-1 text-sm font-semibold text-white">
                        🕒 {horaFormateada}
                    </h4>

                </div>

            </div>

            {/* FOOTER */}
            <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">

                <div>

                    <p className="text-sm font-medium text-white">
                        {masterclass.creador}
                    </p>

                    <p className="text-xs text-white/50">
                        Coordinador académico
                    </p>

                </div>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onClick?.();
                    }}
                    className="
                        rounded-xl
                        bg-cyan-500/20
                        px-4 py-2
                        text-sm font-medium
                        text-cyan-300
                        transition
                        hover:bg-cyan-500/30
                        hover:scale-105
                    "
                >
                    Ver más
                </button>

            </div>

        </div>
    );
};

export default MasterclassCard;