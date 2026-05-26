const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const enviarCorreo = async ({ to, subject, html }) => {

    try {

        const result = await resend.emails.send({
            from: process.env.EMAIL_FROM,
            to,
            subject,
            html
        });

        console.log('✅ Correo enviado correctamente');

        // 👇 LOG SEGURO (estructura real de Resend)
        console.log('RESULT COMPLETO:', JSON.stringify(result, null, 2));

        const emailId = result?.data?.id;

        console.log('ID:', emailId || 'NO ID RETURNED');

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