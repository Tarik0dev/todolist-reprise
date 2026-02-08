const crypto = require("crypto");
const transporter = require("../config/nodemailer");
const authModel = require("../models/authModels"); // Vérifie bien ce chemin !
const jwt = require("jsonwebtoken");


const forgotPasswordController = {
  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;
      console.log("1. Demande reçue pour :", email);

      // 1. Chercher l'utilisateur
      const user = await authModel.findByEmail(email);

      // 2. Logique conditionnelle
      if (!user) {
        console.log("2. Utilisateur inconnu. On ne fait rien.");
        // Sécurité : On répond TOUJOURS le même message pour ne pas aider les pirates
        return res
          .status(200)
          .json({ message: "Si l'email existe, un lien a été envoyé." });
      }

      console.log("2. Utilisateur trouvé :", user.id);

      const secret = process.env.RESET_PASSWORD_SECRET;
      const token = jwt.sign({ email }, secret, { expiresIn: "1h" });

      // 5. Envoi de l'email
      const link = `http://localhost:4200/reset-password/${token}`;

      console.log("4. Tentative d'envoi mail...");

      // AWAIT est crucial ici !
      await transporter.sendMail({
        from: process.env.MAIL_USER,
        to: email,
        subject: "Réinitialisation de mot de passe",
        html: `
                    <h3>Demande de réinitialisation</h3>
                    <p>Cliquez ici : <a href="${link}">Changer mon mot de passe</a></p>
                `,
      });

      console.log("5. Email envoyé avec succès !");

      // 6. Réponse finale au client
      res
        .status(200)
        .json({ message: "Si l'email existe, un lien a été envoyé." });
    } catch (error) {
      // C'est ICI qu'on verra pourquoi l'email ne part pas
      console.error("ERREUR CRITIQUE :", error);
      res.status(500).json({ error: "Erreur serveur lors de l'envoi." });
    }
  },
};

module.exports = forgotPasswordController;
