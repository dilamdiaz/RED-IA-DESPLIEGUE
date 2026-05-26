const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },

    connectionTimeout: 10000
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