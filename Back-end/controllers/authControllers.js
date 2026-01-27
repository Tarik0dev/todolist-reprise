const bcrypt = require('bcrypt');
const authModel = require('../models/authModels');
const jwt = require('jsonwebtoken')

const authController = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await authModel.findByEmail(email);

      if (!user) { //on vérifie déjà si l'utilisateur existe en base de données
        return res.status(401).json({
          error: 'Email ou mot de passe incorrect' //si la requête ne trouve pas d'user existant dans la db alors ne pas
                                                  // donner d'indice à l'utilisateur et lui dire "Email ou mot de passe incorrect"
        });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({
          error: 'Email ou mot de passe incorrect'
        });
      }
      const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );
      // 3️⃣ Succès
      res.status(200).json({
        message: 'Utilisateur connecté',
        user: {
          id: user.id,
          email: user.email,
         token: token
        }
      });


    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }


};

module.exports = authController;
