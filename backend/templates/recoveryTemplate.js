const baseTemplate = require('./baseTemplate');

const recoveryTemplate = ({
    nombre,
    recoveryLink
}) => {

    const contenido = `

        <p style="
            margin-top:0;
            margin-bottom:24px;
        ">
            Hola <strong>${nombre}</strong> 👋
        </p>

        <p style="
            margin-bottom:24px;
        ">
            Recibimos una solicitud para restablecer tu contraseña en 
            <strong>Red IA Company</strong>.
        </p>

        <p style="
            margin-bottom:35px;
        ">
            Haz clic en el siguiente botón para crear una nueva contraseña:
        </p>

        <!-- BOTÓN -->
        <div style="
            text-align:center;
            margin:45px 0;
        ">

            <a
                href="${recoveryLink}"
                style="
                    display:inline-block;
                    background:linear-gradient(
                        135deg,
                        #10b981,
                        #06b6d4
                    );
                    color:white;
                    text-decoration:none;
                    padding:16px 34px;
                    border-radius:14px;
                    font-weight:700;
                    font-size:16px;
                    box-shadow:0 10px 25px rgba(16,185,129,.35);
                "
            >
                🔐 Restablecer contraseña
            </a>

        </div>

        <p style="
            margin-bottom:18px;
        ">
            O copia y pega este enlace en tu navegador:
        </p>

        <div style="
            background:#0f172a;
            border:1px solid #1f2937;
            padding:18px;
            border-radius:14px;
            word-break:break-all;
            color:#93c5fd;
            font-size:14px;
        ">
            ${recoveryLink}
        </div>

        <p style="
            margin-top:35px;
            color:#fca5a5;
            font-size:14px;
            line-height:1.7;
        ">
            ⚠ Este enlace expirará en 1 hora por seguridad.
        </p>

        <p style="
            margin-top:25px;
            font-size:14px;
            color:#9ca3af;
        ">
            Si no solicitaste este cambio, puedes ignorar este correo.
        </p>
    `;

    return baseTemplate({

        titulo: 'Recuperación de contraseña 🔑',

        contenido
    });
};

module.exports = recoveryTemplate;