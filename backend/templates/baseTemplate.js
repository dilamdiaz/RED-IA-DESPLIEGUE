// templates/baseTemplate.js

const baseTemplate = ({
    titulo,
    contenido
}) => {

    return `
        <div style="
            margin:0;
            padding:40px 20px;
            background:#0f172a;
            font-family:Arial, Helvetica, sans-serif;
            color:white;
        ">

            <div style="
                max-width:720px;
                margin:auto;
                background:#111827;
                border-radius:24px;
                overflow:hidden;
                border:1px solid #1f2937;
                box-shadow:0 10px 40px rgba(0,0,0,.35);
            ">

                <!-- HEADER -->
                <div style="
                    background:linear-gradient(
                        135deg,
                        #10b981,
                        #06b6d4
                    );
                    padding:45px 30px;
                    text-align:center;
                ">

                    <h1 style="
                        margin:0;
                        font-size:38px;
                        font-weight:800;
                        color:white;
                    ">
                        🚀 Red IA Company
                    </h1>

                    <p style="
                        margin-top:14px;
                        font-size:16px;
                        color:rgba(255,255,255,.9);
                        line-height:1.6;
                    ">
                        Innovación, tecnología y colaboración internacional 🌎
                    </p>

                </div>

                <!-- BODY -->
                <div style="
                    padding:45px 40px;
                ">

                    <h2 style="
                        margin-top:0;
                        margin-bottom:30px;
                        font-size:30px;
                        color:white;
                    ">
                        ${titulo}
                    </h2>

                    <div style="
                        color:#d1d5db;
                        line-height:1.8;
                        font-size:16px;
                    ">
                        ${contenido}
                    </div>

                </div>

                <!-- FOOTER -->
                <div style="
                    padding:30px;
                    border-top:1px solid #1f2937;
                    text-align:center;
                    background:#0b1220;
                ">

                    <p style="
                        margin:0;
                        color:#9ca3af;
                        font-size:14px;
                        line-height:1.7;
                    ">
                        © ${new Date().getFullYear()} 
                        <strong style="color:#34d399;">
                            Red IA Company
                        </strong>
                        <br>
                        Plataforma de colaboración tecnológica e inteligencia artificial
                    </p>

                </div>

            </div>
        </div>
    `;
};

module.exports = baseTemplate;