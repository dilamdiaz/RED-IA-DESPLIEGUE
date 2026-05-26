const baseTemplate = require('./baseTemplate');

const proyectoFinalizadoTemplate = ({
    nombre,
    titulo
}) => {

    return baseTemplate({

        titulo: '🎉 Proyecto Finalizado',

        contenido: `

            <div style="
                text-align:center;
                margin-bottom:35px;
            ">

                <div style="
                    font-size:70px;
                    margin-bottom:15px;
                ">
                    🚀
                </div>

                <h2 style="
                    color:#60a5fa;
                    margin-bottom:10px;
                ">
                    ¡Felicitaciones ${nombre}!
                </h2>

                <p style="
                    color:#d1d5db;
                    font-size:16px;
                    line-height:28px;
                    max-width:600px;
                    margin:auto;
                ">
                    El proyecto internacional ha sido finalizado exitosamente
                    y queremos agradecerte por formar parte de esta experiencia.
                </p>

            </div>

            <div style="
                background:#1f2937;
                border:1px solid #374151;
                border-radius:18px;
                padding:30px;
                margin-top:30px;
            ">

                <h2 style="
                    margin-top:0;
                    color:#34d399;
                    text-align:center;
                ">
                    ${titulo}
                </h2>

                <p style="
                    color:#d1d5db;
                    line-height:30px;
                    text-align:center;
                    margin-top:20px;
                ">
                    Gracias por tu dedicación, compromiso y participación
                    durante el desarrollo del proyecto 🌎
                </p>

            </div>

            <div style="
                margin-top:35px;
                background:#0f172a;
                border-left:4px solid #8b5cf6;
                padding:25px;
                border-radius:12px;
            ">

                <h3 style="
                    margin-top:0;
                    color:#c4b5fd;
                ">
                    💡 Lo que lograste
                </h3>

                <ul style="
                    color:#d1d5db;
                    line-height:30px;
                    padding-left:20px;
                ">
                    <li>Colaborar en un entorno internacional</li>
                    <li>Fortalecer habilidades tecnológicas</li>
                    <li>Trabajar en equipo de manera remota</li>
                    <li>Construir conexiones profesionales globales</li>
                </ul>

            </div>

            <div style="
                margin-top:35px;
                text-align:center;
            ">

                <p style="
                    color:#d1d5db;
                    font-size:16px;
                    line-height:30px;
                ">
                    Esperamos verte nuevamente en futuros proyectos,
                    mentorías y experiencias internacionales 🚀
                </p>

                <p style="
                    margin-top:25px;
                    color:#9ca3af;
                    font-size:14px;
                ">
                    Gracias por confiar en
                    <strong>Red IA Company</strong>
                </p>

            </div>

        `
    });
};

module.exports = proyectoFinalizadoTemplate;