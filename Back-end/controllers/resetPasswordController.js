const jwt = require('jsonwebtoken')

const resetPasswordController = {
    resetPassword: async (req, res) => {
        const { password, token } = req.body;

        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            console.log('Token valide:', payload);
            
        } catch (err) {
            console.log('Token invalide:', err.message);
            res.status(401).json({message: "Erreur, veuillez retentez.."})
        }

    }
} 

module.exports = resetPasswordController