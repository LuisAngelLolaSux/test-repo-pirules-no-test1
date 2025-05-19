import CompraCreadaClienteFinalEmail from '@/mails/emails/CompraCreadaClienteFinal';
import CompraCreadaUsuarioLolaEmail from '@/mails/emails/CompraCreadaUsuarioLola';
import OrdenCreadaClienteFinalEmail from '@/mails/emails/OrdenCreadaClienteFinal';
import OrdenCreadaUsuarioLolaEmail from '@/mails/emails/OrdenCreadaUsuarioLola';
import CompraCreadaUsuarioLolaEmailManual from '@/mails/emails/CompraCreadaUsuarioLolaManual';
import CompraCreadaClienteFinalEmailManual from '@/mails/emails/CompraCreadaClienteFinalManual';
import { ManualOrderData, OrderData } from '@/mails/types';
import { Resend } from 'resend';
import { v4 as uuidv4 } from 'uuid';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendRecoleccionesAgendadasMail = async (email: string, message: string) => {
    await resend.emails.send({
        from: 'Lola Sux <Soporte@lolasux.com>',
        to: email,
        subject: 'Recolecciones Agendadas',
        headers: {
            'X-Entity-Ref-ID': uuidv4(),
        },
        html: `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Status de Recolecciones</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
            color: #333;
            padding: 20px;
        }
        .container {
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            max-width: 600px;
            margin: auto;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #33A64B;
            padding-bottom: 10px;
        }
        .header h1 {
            color: #33A64B;
        }
        .content {
            padding: 20px;
        }
        .token {
            font-size: 24px;
            color: #33A64B;
            text-align: center;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            font-size: 12px;
            color: #777;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Lola Sux</h1>
        </div>
        <div class="content">
            <p>Estado de la agenda de recolecciones:</p>
            <p>${message}</p>
        </div>
        <div class="footer">
            <p>Gracias por usar Lola Sux.</p>
        </div>
    </div>
</body>
</html>
`,
    });
};

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
    await resend.emails.send({
        from: 'Lola Sux <Soporte@lolasux.com>',
        to: email,
        subject: 'Código 2FA',
        headers: {
            'X-Entity-Ref-ID': uuidv4(),
        },
        // attachments: [
        //   {
        //     path: 'path/to/file/invoice.pdf',
        //     filename: 'invoice.pdf',
        //   },
        // ],
        html: `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Código 2FA</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
            color: #333;
            padding: 20px;
        }
        .container {
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            max-width: 600px;
            margin: auto;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #33A64B;
            padding-bottom: 10px;
        }
        .header h1 {
            color: #33A64B;
        }
        .content {
            padding: 20px;
        }
        .token {
            font-size: 24px;
            color: #33A64B;
            text-align: center;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            font-size: 12px;
            color: #777;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Lola Sux</h1>
        </div>
        <div class="content">
            <p>Hola,</p>
            <p>Tu código 2FA es:</p>
            <div class="token">${token}</div>
            <p>Por favor, introduce este código para continuar con tu inicio de sesión.</p>
        </div>
        <div class="footer">
            <p>Gracias por usar Lola Sux.</p>
        </div>
    </div>
</body>
</html>
`,
    });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
    const resetLink = `http://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}/auth/new-password?token=${token}`;

    await resend.emails.send({
        from: 'Lola Sux <Soporte@lolasux.com>',
        to: email,
        subject: 'Restablecer tu contraseña',
        headers: {
            'X-Entity-Ref-ID': uuidv4(),
        },
        html: `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Restablecer tu contraseña</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
            color: #333;
            padding: 20px;
        }
        .container {
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            max-width: 600px;
            margin: auto;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #33A64B;
            padding-bottom: 10px;
        }
        .header h1 {
            color: #33A64B;
        }
        .content {
            padding: 20px;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            font-size: 16px;
            color: #fff;
            background-color: #33A64B;
            border-radius: 5px;
            text-decoration: none;
            margin: 20px 0;
            text-align: center;
        }
        .footer {
            text-align: center;
            font-size: 12px;
            color: #777;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Lola Sux</h1>
        </div>
        <div class="content">
            <p>Hola,</p>
            <p>Hemos recibido una solicitud para restablecer tu contraseña. Haz clic en el botón de abajo para restablecerla:</p>
            <a href="${resetLink}" class="button" style="color: #fff; text-decoration: none;">Restablecer contraseña</a>
            <p>Si no solicitaste restablecer tu contraseña, puedes ignorar este correo electrónico.</p>
        </div>
        <div class="footer">
            <p>Gracias por usar Lola Sux.</p>
        </div>
    </div>
</body>
</html>
`,
    });
};

export const sendVerificationEmail = async (email: string, token: string) => {
    const confirmLink = `http://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}/auth/new-verification?token=${token}`;

    await resend.emails.send({
        from: 'Lola Sux <Soporte@lolasux.com>',
        to: email,
        subject: 'Confirma tu correo electrónico',
        headers: {
            'X-Entity-Ref-ID': uuidv4(),
        },
        html: `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirma tu correo electrónico</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
            color: #333;
            padding: 20px;
        }
        .container {
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            max-width: 600px;
            margin: auto;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #33A64B;
            padding-bottom: 10px;
        }
        .header h1 {
            color: #33A64B;
        }
        .content {
            padding: 20px;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            font-size: 16px;
            color: #fff;
            background-color: #33A64B;
            border-radius: 5px;
            text-decoration: none;
            margin: 20px 0;
            text-align: center;
        }
        .footer {
            text-align: center;
            font-size: 12px;
            color: #777;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Lola Sux</h1>
        </div>
        <div class="content">
            <p>Hola,</p>
            <p>Gracias por registrarte con nosotros. Por favor, confirma tu correo electrónico haciendo clic en el botón de abajo:</p>
            <a href="${confirmLink}" class="button" style="color: #fff; text-decoration: none;">Confirmar correo</a>
            <p>Si no creaste una cuenta, puedes ignorar este correo.</p>
        </div>
        <div class="footer">
            <p>Gracias por usar Lola Sux.</p>
        </div>
    </div>
</body>
</html>
`,
    });
};

export const sendLowCreditsEmail = async (email: string, creditos: number) => {
    const link = 'https://www.lolasux.com/dashboard/configuracion/negocio/billing';
    await resend.emails.send({
        from: 'Lola Sux <Soporte@lolasux.com>',
        to: email,
        subject: 'Te quedan pocos creditos!!',
        headers: {
            'X-Entity-Ref-ID': uuidv4(),
        },
        html: `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Te estas quedando sin creditos!!</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
            color: #333;
            padding: 20px;
        }
        .container {
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            max-width: 600px;
            margin: auto;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #33A64B;
            padding-bottom: 10px;
        }
        .header h1 {
            color: #33A64B;
        }
        .content {
            padding: 20px;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            font-size: 16px;
            color: #fff;
            background-color: #33A64B;
            border-radius: 5px;
            text-decoration: none;
            margin: 20px 0;
            text-align: center;
        }
        .footer {
            text-align: center;
            font-size: 12px;
            color: #777;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Lola Sux</h1>
        </div>
        <div class="content">
            <p>Hola,</p>
            <p>Notamos que tus créditos están a punto de agotarse. Para que no te quedes sin poder seguir disfrutando de nuestros servicios, te recomendamos recargar tus créditos ahora.</p>
            <p><strong>Tus créditos restantes son menos de ${creditos}</strong></p>
            <a href="${link}" class="button">Comprar más créditos</a>
        </div>
        <div class="footer">
            <p>Gracias por usar Lola Sux.</p>
        </div>
    </div>
</body>
</html>
`,
    });
};

export const sendOrderConfirmationEmpresaEmail = async (email: string, orden: OrderData) => {
    await resend.emails.send({
        from: 'Lola Sux <Ventas@lolasux.com>',
        to: email,
        subject: 'Realizaron un pedido',
        headers: {
            'X-Entity-Ref-ID': uuidv4(),
        },
        react: CompraCreadaUsuarioLolaEmail({ orden }),
    });
};

export const sendOrderConfirmationEmpresaEmailManual = async (
    email: string,
    orden: ManualOrderData,
) => {
    await resend.emails.send({
        from: 'Lola Sux <Ventas@lolasux.com>',
        to: email,
        subject: 'Realizaron un pedido',
        headers: {
            'X-Entity-Ref-ID': uuidv4(),
        },
        react: CompraCreadaUsuarioLolaEmailManual({ orden }),
    });
};

export const sendOrderConfirmationClienteEmailManual = async (
    email: string,
    orden: ManualOrderData,
) => {
    await resend.emails.send({
        from: 'Lola Sux <Ventas@lolasux.com>',
        to: email,
        subject: '¡Tu pedido ha sido realizado con éxito!',
        headers: {
            'X-Entity-Ref-ID': uuidv4(),
        },
        react: CompraCreadaClienteFinalEmailManual({ orden }),
    });
};

export const sendOrderConfirmationClienteEmail = async (email: string, orden: OrderData) => {
    await resend.emails.send({
        from: 'Lola Sux <Ventas@lolasux.com>',
        to: email,
        subject: '¡Tu pedido ha sido realizado con éxito!',
        headers: {
            'X-Entity-Ref-ID': uuidv4(),
        },
        react: CompraCreadaClienteFinalEmail({ orden }),
    });
};

export const sendOrderCreationEmpresaEmail = async (
    email: string,
    orden: OrderData,
    // Recuerda para asignar un correo tiene que ser un dominio vinculado con resend
    correo?: string,
) => {
    await resend.emails.send({
        from: correo || 'Lola Sux <Ventas@lolasux.com>',
        to: email,
        subject: 'Realizaron una orden',
        headers: {
            'X-Entity-Ref-ID': uuidv4(),
        },
        react: OrdenCreadaUsuarioLolaEmail({ orden }),
    });
};

export const sendOrderCreationClienteEmail = async (
    email: string,
    orden: OrderData,
    // Recuerda para asignar un correo tiene que ser un dominio vinculado con resend
    correo?: string,
) => {
    await resend.emails.send({
        from: correo || 'Lola Sux <Ventas@lolasux.com>',
        to: email,
        subject: '¡Tu orden ha sido realizada!',
        headers: {
            'X-Entity-Ref-ID': uuidv4(),
        },
        react: OrdenCreadaClienteFinalEmail({ orden }),
    });
};

export const sendContactNotificationEmail = async (contactData: any) => {
    const { descripcion, email, empresa, mejora, presupuesto, nombre } = contactData;
    const htmlContent = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <title>Nuevo Contacto</title>
            <style>
                body { font-family: Arial, sans-serif; }
                .content { padding: 20px; }
                .field { margin-bottom: 10px; }
            </style>
        </head>
        <body>
            <div class="content">
                <h2>Nuevo interesado recibido</h2>
                <div class="field"><strong>Nombre:</strong> ${nombre || 'No especificado'}</div>
                <div class="field"><strong>Email:</strong> ${email}</div>
                <div class="field"><strong>Empresa:</strong> ${empresa}</div>
                <div class="field"><strong>Descripción:</strong> ${descripcion}</div>
                <div class="field"><strong>Área a mejorar:</strong> ${mejora}</div>
                <div class="field"><strong>Presupuesto:</strong> ${presupuesto}</div>
            </div>
        </body>
        </html>
    `;

    await resend.emails.send({
        from: 'Lola Sux <Soporte@lolasux.com>',
        to: 'digitaldev@lolasux.com',
        subject: 'Nuevo interesado - Información de contacto',
        headers: { 'X-Entity-Ref-ID': uuidv4() },
        html: htmlContent,
    });
};
