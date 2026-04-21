const pool = require('../config/database');
const fs = require('fs');
const path = require('path');

async function initDb() {
    try {

        
        const sqlPath = path.join(__dirname, '../../database/init.sql');

        console.log(`Lecture du fichier SQL à : ${sqlPath}`);
        const sqlContent = fs.readFileSync(sqlPath, 'utf8');

        console.log(' Exécution du SQL...');
        await pool.query(sqlContent);

        console.log(' Tables Users et Tasks créées avec succès !');
    } catch (error) {
        console.error(' Erreur :', error.message);
    } finally {
        await pool.end();
    }
}

initDb();