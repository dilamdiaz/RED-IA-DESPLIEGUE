// templates/mentoriaTemplate.js

const baseTemplate = require('./baseTemplate');

const formatearFecha = (fecha) => {

    return new Date(fecha).toLocaleDateString(
        'es-CO',
        {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }
    );
};

const formatearHora = (hora) => {

    const [hours, minutes] = hora.split(':');

    const date = new Date();

    date.setHours(hours);
    date.setMinutes(minutes);

    return date.toLocaleTimeString(
        'es-CO',
        {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        }
    );
};

const mentoriaTemplate = ({
    nombre,
    titulo,
    descripcion,
    fecha,
    hora,
    especialidad,
    enlace,
    mentor,
    universidad,
    pais
}) => {

    const contenido = `

        <p style="
            font-size:17px;
            color:#d1d5db;
            line-height:1.8;
        ">
            Hola <strong>${nombre}</strong> 👋
            <br><br>
            Tu inscripción a la mentoría fue realizada correctamente.
            Prepárate para compartir conocimientos, resolver dudas y fortalecer tus habilidades 🚀
        </p>

        <div style="
            background:#1f2937;
            border-radius:18px;
            padding:30px;
            margin-top:30px;
            border:1px solid #374151;
        ">

            <h2 style="
                margin-top:0;
                color:#34d399;
                font-size:28px;
            ">
                🎓 ${titulo}
            </h2>

            <p style="
                color:#d1d5db;
                line-height:1.7;
                margin-top:18px;
            ">
                ${descripcion}
            </p>

            <div style="
                margin-top:25px;
                display:grid;
                gap:14px;
            ">

                <div>
                    <strong>📅 Fecha:</strong>
                    <span style="color:#d1d5db;">
                        ${formatearFecha(fecha)}
                    </span>
                </div>

                <div>
                    <strong>⏰ Hora:</strong>
                    <span style="color:#d1d5db;">
                        ${formatearHora(hora)}
                    </span>
                </div>

                ${
                    especialidad
                        ? `
                            <div>
                                <strong>🧠 Especialidad:</strong>
                                <span style="color:#d1d5db;">
                                    ${especialidad}
                                </span>
                            </div>
                        `
                        : ''
                }

                ${
                    mentor
                        ? `
                            <div>
                                <strong>👨‍🏫 Mentor:</strong>
                                <span style="color:#d1d5db;">
                                    ${mentor}
                                </span>
                            </div>
                        `
                        : ''
                }

                ${
                    universidad
                        ? `
                            <div>
                                <strong>🏫 Universidad:</strong>
                                <span style="color:#d1d5db;">
                                    ${universidad}
                                </span>
                            </div>
                        `
                        : ''
                }

                ${
                    pais
                        ? `
                            <div>
                                <strong>🌎 País:</strong>
                                <span style="color:#d1d5db;">
                                    ${pais}
                                </span>
                            </div>
                        `
                        : ''
                }

            </div>

        </div>

        <div style="
            text-align:center;
            margin-top:40px;
        ">

            <a
                href="${enlace}"
                style="
                    display:inline-block;
                    background:linear-gradient(
                        135deg,
                        #10b981,
                        #06b6d4
                    );
                    color:white;
                    text-decoration:none;
                    padding:18px 34px;
                    border-radius:14px;
                    font-weight:bold;
                    font-size:16px;
                "
            >
                🎥 Ingresar a la Mentoría
            </a>

        </div>

        <div style="
            margin-top:40px;
            padding:22px;
            background:#0f172a;
            border-radius:16px;
            border:1px solid #1e293b;
        ">

            <p style="
                margin:0;
                color:#9ca3af;
                line-height:1.8;
                font-size:14px;
            ">
                📌 Te recomendamos conectarte unos minutos antes del inicio.
                <br>
                🚀 Gracias por hacer parte de Red IA Company.
            </p>

        </div>
    `;

    return baseTemplate({
        titulo: 'Inscripción Exitosa a Mentoría 🎓',
        contenido
    });
};

module.exports = mentoriaTemplate;