const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../db'); // Assure-toi que ce fichier utilise mysql2/promise

router.post('/', async (req, res) => {
  const { email, password } = req.body;

  console.log("Requête reçue:", email);

  if (!email || !password) {
    return res.status(400).json({ error: "Champs manquants" });
  }

  try {
    const [results] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    if (results.length === 0) {
      return res.status(401).json({ error: 'Utilisateur non trouvé' });
    }

    const user = results[0];
    if (user.password !== password) {
      return res.status(403).json({ error: 'Mot de passe incorrect' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    console.log("Connexion réussie, token généré");

    return res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      }
    });

  } catch (err) {
    console.error("Erreur lors du login :", err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
