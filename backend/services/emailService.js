// services/emailService.js

const nodemailer = require('nodemailer');

// ======================================
// 📧 CONFIGURACIÓN SMTP
// ======================================

const transporter = nodemailer.createTransport({

    host: 'smtp.gmail.com',

    port: 587,

    secure: false,

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },

    tls: {
        rejectUnauthorized: false
    },

    // Forzar IPv4 para evitar errores ENETUNREACH en Render
    family: 4,

    // Tiempo máximo de espera
    connectionTimeout: 10000
});

// ======================================
// ✅ VERIFICAR CONEXIÓN SMTP
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