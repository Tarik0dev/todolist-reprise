const bcrypt = require('bcrypt');
const registerModel = require('../models/registerModels')

const registerController =  {
    create: async (req,res) => {
        try {
            const { firstName, lastName, email, password } = req.body
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await registerModel.create({ firstName, lastName, email, password: hashedPassword });

            res.status(201).json({message: "L'inscription à été réalisé avec succés bravo !!!"})
        }
        catch (error) {
            if (error.code === '23505') {
        return res.status(409).json({
          error: 'Cet email est déjà utilisé'
        });
      }
            console.error('erreur : ', error);
            res.status(500).json({ error: error.message });
            
            
    }

    }
};

module.exports = registerController