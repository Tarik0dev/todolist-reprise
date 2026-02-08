
const jwt = require('jsonwebtoken');
require('dotenv').config();
const authMiddleware = (req, res, next) => {
    try {
        // ÉTAPE 1 : Récupérer le token du Header
        // Le client envoie le token dans le header "Authorization".
        // Format standard : "Bearer eyJhbGci..."
        const header = req.headers.authorization;
        // Sécurité : Si pas de header, on arrête tout.
        if (!header) {
            return res.status(401).json({ message: "Token manquant" });}
        // ÉTAPE 2 : Extraire le token pur
        // On enlève le mot clé "Bearer " (et l'espace) pour garder juste la chaîne cryptée.
        // .split(' ') découpe la phrase en tableau : ["Bearer", "eyJ..."]
        const token = header.split(' ')[1];
        // ÉTAPE 3 : Vérifier la signature cryptographique
        // jwt.verify prend le token et la CLÉ SECRÈTE.
        // Il refait le calcul mathématique. 
        // Si le token a été modifié ou s'il est expiré, cette ligne lance une ERREUR (catch).
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        // ÉTAPE 4 : Transmettre l'info au Contrôleur
        // Le token est valide. Il contient l'ID (userId).
        // On stocke cet ID dans l'objet "req" pour que le contrôleur y ait accès.
        // On crée une propriété "auth" (ou "user") dans req.
        req.auth = {userId: decodedToken.userId,role: decodedToken.role, firstName: decodedToken.firstname, lastName: decodedToken.lastname  };
        // ÉTAPE 5 : Passer au suivant
        // Tout est OK, on laisse la requête continuer son chemin.
        next();
    } catch (error) {
        // Si jwt.verify échoue (token faux ou expiré), on arrive ici.
        res.status(401).json({ message: "Token invalide ou expiré" });
    }
};
module.exports = authMiddleware;