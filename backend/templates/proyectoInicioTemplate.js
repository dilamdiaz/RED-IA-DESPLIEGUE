const baseTemplate = require('./baseTemplate');

const proyectoInicioTemplate = ({
    nombre,
    titulo,
    descripcion,
    objetivo,
    tipo_link,
    link_proyecto,
    fecha_inicio,
    fecha_fin
}) => {

    const fechaInicioFormateada = new Date(fecha_inicio)
        .toLocaleDateString('es-CO', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });

    const fechaFinFormateada = fecha_fin
        ? new Date(fecha_fin)
            .toLocaleDateString('es-CO', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            })
        : 'Por definir';

    return baseTemplate({

        titulo: '🚀 El proyecto ha iniciado',

        contenido: `

            <p style="
                color:#d1d5db;
                font-size:16px;
                line-height:28px;
            ">
                Hola <strong>${nombre}</strong> 👋
            </p>

            <p style="
                color:#d1d5db;
                font-size:16px;
                line-height:28px;
            ">
                El proyecto internacional ya pasó oficialmente
                a la etapa de <strong>desarrollo</strong>.
            </p>

            <div style="
                background:#1f2937;
                border:1px solid #374151;
                border-radius:18px;
                padding:30px;
                margin-top:30px;
            ">

                <h2 style="
                    margin-top:0;
                    color:#60a5fa;
                ">
                    ${titulo}
                </h2>

                <p style="color:#e5e7eb;">
                    🧠 <strong>Objetivo:</strong>
                    ${objetivo || 'No especificado'}
                </p>

                <p style="
                    color:#d1d5db;
                    line-height:28px;
                ">
                    ${descripcion}
                </p>

                <p style="color:#e5e7eb;">
                    📅 <strong>Inicio:</strong>
                    ${fechaInicioFormateada}
                </p>

                <p style="color:#e5e7eb;">
                    🏁 <strong>Finalización estimada:</strong>
                    ${fechaFinFormateada}
                </p>

            </div>

            <div style="
                margin-top:30px;
                background:#0f172a;
                border-left:4px solid #10b981;
                padding:25px;
                border-radius:12px;
            ">

                <h3 style="
                    margin-top:0;
                    color:#6ee7b7;
                ">
                    🔗 Canal oficial del proyecto
                </h3>

                <p style="
                    color:#d1d5db;
                    line-height:26px;
                ">
                    Tipo de enlace:
                    <strong>${tipo_link}</strong>
                </p>

                <div style="
                    margin-top:25px;
                    text-align:center;
                ">

                    <a
                        href="${link_proyecto}"
                        style="
                            background:#10b981;
                            color:white;
                            padding:15px 30px;
                            border-radius:12px;
                            text-decoration:none;
                            font-weight:bold;
                            display:inline-block;
                        "
                    >
                        🚀 Acceder al enlace
                    </a>

                </div>

            </div>

            <div style="
                margin-top:35px;
                background:#111827;
                padding:25px;
                border-radius:14px;
                border:1px solid #374151;
            ">

                <h3 style="
                    margin-top:0;
                    color:#93c5fd;
                ">
                    📢 Recomendaciones
                </h3>

                <ul style="
                    color:#d1d5db;
                    line-height:30px;
                    padding-left:20px;
                ">
                    <li>Mantén comunicación activa con tu equipo</li>
                    <li>Revisa constantemente el canal del proyecto</li>
                    <li>Cumple con las fechas establecidas</li>
                    <li>Participa activamente en las actividades</li>
                </ul>

            </div>

            <div style="
                margin-top:35px;
                text-align:center;
            ">

                <p style="
                    color:#9ca3af;
                    line-height:28px;
                ">
                    Gracias por construir conexiones globales junto a
                    <strong>Red IA Company</strong> 🌎
                </p>

            </div>

        `
    });
};

module.exports = proyectoInicioTemplate;