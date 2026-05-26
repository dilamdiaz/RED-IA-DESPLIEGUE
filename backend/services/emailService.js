const nodemailer = require('nodemailer');

// ======================================
// 📧 CONFIGURACIÓN SMTP GMAIL
// ======================================

const transporter = nodemailer.createTransport({

    // IP IPv4 de Gmail SMTP
    host: '74.125.133.108',

    port: 587,

    secure: false,

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },

    tls: {
        rejectUnauthorized: false,

        // importante para Gmail
        servername: 'smtp.gmail.com'
    },

    connectionTimeout: 10000,

    greetingTimeout: 10000,

    socketTimeout: 10000
});

// ======================================
// ✅ VERIFICAR SMTP
// ======================================

transporter.verify((error, success) => {

    if (error) {

        console.log('❌ SMTP ERROR');
        console.log(error);

    } else {

        console.log('✅ SMTP READY');
    }
});

// ======================================
// 📧 ENVIAR CORREO
// ======================================

const enviarCorreo = async ({
    to,
    subject,
    html
}) => {

    try {

        await transporter.sendMail({

            from: `"Red IA Company" <${process.env.EMAIL_USER}>`,

            to,

            subject,

            html
        });

        console.log(`✅ Correo enviado a ${to}`);

        return true;

    } catch (error) {

        console.log('❌ Error enviando correo');
        console.log(error);

        return false;
    }
};

module.exports = {
    enviarCorreo,
    transporter
};