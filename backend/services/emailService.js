const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // 👈 importante (SSL real)
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    connectionTimeout: 20000,
    greetingTimeout: 20000,
    socketTimeout: 20000
});

// verificar conexión al iniciar servidor
transporter.verify((error) => {
    if (error) {
        console.log('❌ SMTP ERROR');
        console.log(error);
    } else {
        console.log('✅ SMTP LISTO');
    }
});

const enviarCorreo = async ({ to, subject, html }) => {
    try {
        const result = await transporter.sendMail({
            from: `"Red IA Company" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html
        });

        console.log('✅ Correo enviado correctamente');
        console.log('Message ID:', result.messageId);

        return true;

    } catch (error) {
        console.log('❌ Error enviando correo');
        console.log(error);
        return false;
    }
};

module.exports = {
    enviarCorreo
};