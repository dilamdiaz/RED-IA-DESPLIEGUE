const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const enviarCorreo = async ({ to, subject, html }) => {

    try {

        const result = await resend.emails.send({
            from: "Red IA <noreply@mail.redia.com>",
            to,
            subject,
            html
        });

        console.log("✅ Correo enviado");
        console.log("ID:", result?.data?.id);

        return true;

    } catch (error) {

        console.log("❌ Error enviando correo");
        console.log(error);

        return false;
    }
};

module.exports = { enviarCorreo };