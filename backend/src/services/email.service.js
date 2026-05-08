const nodemailer = require("nodemailer");

const sendEmail = async (
    to,
    subject,
    html
) => {

    try {

        const transporter =
            nodemailer.createTransport({

                host: "smtp.gmail.com",

                port: 587,

                secure: false,

                requireTLS: true,

                auth: {
                    user: String(process.env.EMAIL_USER),
                    pass: String(process.env.EMAIL_PASS),
                },
            });

        console.log("EMAIL USER:");
        console.log(process.env.EMAIL_USER);

        console.log("EMAIL PASS:");
        console.log(process.env.EMAIL_PASS);

        // VERIFY CONNECTION
        await transporter.verify();

        console.log(
            "SMTP VERIFIED"
        );

        const info =
            await transporter.sendMail({

                from: process.env.EMAIL_USER,

                to,

                subject,

                html,
            });

        console.log(
            "EMAIL SENT"
        );

        console.log(info.response);

    } catch (error) {

        console.log(
            "EMAIL ERROR"
        );

        console.log(error);

        throw error;
    }
};

module.exports = {
    sendEmail,
};