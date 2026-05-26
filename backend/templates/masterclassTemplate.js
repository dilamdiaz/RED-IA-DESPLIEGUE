const masterclassTemplate = ({
    nombre,
    titulo,
    fecha,
    hora,
    enlace
}) => {

    // 📅 FORMATEAR FECHA EN ESPAÑOL
    const fechaFormateada = new Date(fecha).toLocaleDateString(
        'es-CO',
        {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }
    );

    // ⏰ FORMATEAR HORA AM/PM
    const horaFormateada = new Date(
        `1970-01-01T${hora}`
    ).toLocaleTimeString(
        'es-CO',
        {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        }
    );

    return `
        <div style="
            margin:0;
            padding:40px 20px;
            background:#0f172a;
            font-family:Arial, Helvetica, sans-serif;
            color:white;
        ">

            <div style="
                max-width:700px;
                margin:auto;
                background:#111827;
                border-radius:24px;
                overflow:hidden;
                border:1px solid #1f2937;
                box-shadow:0 10px 40px rgba(0,0,0,.35);
            ">

                <!-- HEADER -->
                <div style="
                    background:linear-gradient(135deg,#10b981,#06b6d4);
                    padding:45px 30px;
                    text-align:center;
                ">

                    <h1 style="
                        margin:0;
                        font-size:34px;
                        font-weight:800;
                        color:white;
                    ">
                        🚀 Inscripción Exitosa
                    </h1>

                    <p style="
                        margin-top:12px;
                        color:rgba(255,255,255,.9);
                        font-size:16px;
                    ">
                        Tu cupo en la masterclass ha sido confirmado
                    </p>

                </div>

                <!-- BODY -->
                <div style="padding:40px;">

                    <h2 style="
                        margin-top:0;
                        font-size:28px;
                        color:white;
                    ">
                        Hola ${nombre} 👋
                    </h2>

                    <p style="
                        color:#d1d5db;
                        font-size:16px;
                        line-height:1.7;
                    ">
                        Te has inscrito correctamente a la siguiente masterclass organizada por 
                        <strong style="color:#34d399;">
                            Red IA Company
                        </strong>.
                    </p>

                    <!-- CARD -->
                    <div style="
                        margin-top:30px;
                        background:#1f2937;
                        border:1px solid #374151;
                        border-radius:20px;
                        padding:30px;
                    ">

                        <h2 style="
                            margin-top:0;
                            margin-bottom:25px;
                            color:#34d399;
                            font-size:28px;
                        ">
                            ${titulo}
                        </h2>

                        <div style="margin-bottom:18px;">

                            <span style="
                                font-size:15px;
                                color:#9ca3af;
                            ">
                                📅 Fecha
                            </span>

                            <p style="
                                margin:8px 0 0;
                                font-size:18px;
                                color:white;
                                font-weight:600;
                                text-transform:capitalize;
                            ">
                                ${fechaFormateada}
                            </p>

                        </div>

                        <div>

                            <span style="
                                font-size:15px;
                                color:#9ca3af;
                            ">
                                ⏰ Hora
                            </span>

                            <p style="
                                margin:8px 0 0;
                                font-size:18px;
                                color:white;
                                font-weight:600;
                            ">
                                ${horaFormateada}
                            </p>

                        </div>

                    </div>

                    <!-- BOTON -->
                    <div style="
                        margin-top:35px;
                        text-align:center;
                    ">

                        <a
                            href="${enlace}"
                            target="_blank"
                            style="
                                display:inline-block;
                                background:linear-gradient(135deg,#10b981,#06b6d4);
                                color:white;
                                padding:18px 34px;
                                border-radius:16px;
                                text-decoration:none;
                                font-size:16px;
                                font-weight:700;
                                box-shadow:0 8px 20px rgba(16,185,129,.35);
                            "
                        >
                            🎥 Unirse a la Masterclass
                        </a>

                    </div>

                    <!-- FOOTER -->
                    <div style="
                        margin-top:45px;
                        padding-top:25px;
                        border-top:1px solid #374151;
                    ">

                        <p style="
                            color:#9ca3af;
                            line-height:1.7;
                            font-size:14px;
                            margin:0;
                        ">
                            Gracias por hacer parte de 
                            <strong style="color:#34d399;">
                                Red IA Company
                            </strong>.
                            <br><br>
                            Esperamos verte en esta experiencia de aprendizaje 🌎✨
                        </p>

                    </div>

                </div>
            </div>
        </div>
    `;
};

module.exports = masterclassTemplate;