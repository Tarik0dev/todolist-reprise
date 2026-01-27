const nodemailer = require('nodemailer');
require('dotenv').config(); // <--- C'est cette ligne qui cause le crash si dotenv n'est pas installé

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    },
    tls: {
        // On dit à Node.js de ne pas rejeter la connexion si le certificat est bizarre
        rejectUnauthorized: false
    }
});

module.exports = transporter;