// generate-bcrypt.js
const bcrypt = require('bcrypt');

const password = process.argv[2]; // Prende la password da linea di comando
const saltRounds = 10; // Puoi aumentare per maggiore sicurezza

if (!password) {
  console.log('Usa: node generate-bcrypt.js <password>');
  process.exit(1);
}

bcrypt.hash(password, saltRounds, function(err, hash) {
  if (err) {
    console.error('Errore:', err);
    process.exit(1);
  }
  console.log('Hash bcrypt:', hash);
}); 