const baseTemplate = require('./baseTemplate');

const proyectoBienvenidaTemplate = ({
    nombre,
    titulo,
    fecha_inicio,
    fecha_fin,
    estado
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

        titulo: '🚀 Inscripción Confirmada',

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
                ¡Tu inscripción al proyecto internacional fue realizada correctamente!
                Nos emociona que ahora formes parte de esta experiencia colaborativa 🌎
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
                    margin-bottom:20px;
                ">
                    ${titulo}
                </h2>

                <p style="color:#e5e7eb;">
                    📌 <strong>Estado actual:</strong> ${estado}
                </p>

                <p style="color:#e5e7eb;">
                    📅 <strong>Fecha de inicio:</strong>
                    ${fechaInicioFormateada}
                </p>

                <p style="color:#e5e7eb;">
                    🏁 <strong>Fecha estimada de finalización:</strong>
                    ${fechaFinFormateada}
                </p>

            </div>

            <div style="
                margin-top:30px;
                background:#0f172a;
                border-left:4px solid #3b82f6;
                padding:20px;
                border-radius:12px;
            ">

                <h3 style="
                    margin-top:0;
                    color:#93c5fd;
                ">
                    📢 Próximos pasos
                </h3>

                <p style="
                    color:#d1d5db;
                    line-height:26px;
                ">
                    Por ahora tu proyecto se encuentra en etapa de
                    <strong>planeación</strong>.
                </p>

                <p style="
                    color:#d1d5db;
                    line-height:26px;
                ">
                    Cuando el proyecto avance a la fase
                    <strong>"En desarrollo"</strong>,
                    recibirás un nuevo correo con:
                </p>

                <ul style="
                    color:#d1d5db;
                    line-height:28px;
                    padding-left:20px;
                ">
                    <li>💬 Enlace del grupo colaborativo</li>
                    <li>📂 Recursos necesarios</li>
                    <li>🛠 Herramientas de trabajo</li>
                    <li>📋 Indicaciones del coordinador</li>
                </ul>

            </div>

            <div style="
                margin-top:35px;
                text-align:center;
            ">

                <p style="
                    color:#9ca3af;
                    font-size:15px;
                    line-height:28px;
                ">
                    Gracias por confiar en
                    <strong>Red IA Company</strong>.
                    <br>
                    Estamos construyendo conexiones globales a través de la tecnología 🚀
                </p>

            </div>

        `
    });
};

module.exports = proyectoBienvenidaTemplate;