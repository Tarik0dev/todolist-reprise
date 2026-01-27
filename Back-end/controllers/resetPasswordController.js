const jwt = require('jsonwebtoken')
const authModel = require('../models/authModels');
const bcrypt = require('bcrypt');

const resetPasswordController = {
    resetPassword: async (req, res) => {
        const { password, token } = req.body;

        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            const email = payload.email;

            console.log(email);

            // 1. Chercher l'utilisateur
            const user = await authModel.findByEmail(email);

            // 2. Logique conditionnelle
            if (!user) {
                console.log("2. Utilisateur inconnu. On ne fait rien.");
                // Sécurité : On répond TOUJOURS le même message pour ne pas aider les pirates
                return res.status(200).json({ message: "Erreur lors de la modification." });
            }

            await authModel.resetPassword(email, await bcrypt.hash(password, 10));

            res.status(200).json({message: "Mot de passe modifié avec succès."})
            
        } catch (err) {
            console.log('Token invalide:', err.message);
            res.status(401).json({message: "Erreur, veuillez retentez.."})
        }

    }
} 

module.exports = resetPasswordController