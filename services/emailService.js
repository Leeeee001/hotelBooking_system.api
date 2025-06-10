const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars").default;
const path = require("path");

const transporter = nodemailer.createTransport({    // transporter is a function that sends email
    host: 'smtp.gmail.com',
    service: "gmail",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

const viewPath = path.resolve(__dirname, "../views/emailTemplates")

transporter.use("compile", hbs({
    viewEngine: {
        extName: ".hbs",
        partialsDir: viewPath,
        defaultLayout: false,
    },
    viewPath: viewPath,
    extName: ".hbs"
}));

const sendEmail = async ({ option }) => {
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: option.to,
        subject: option.subject,
        template: option.template,
        context: option.context
    });
};

module.exports = sendEmail;
