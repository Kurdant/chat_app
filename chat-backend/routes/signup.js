const express = require('express');
const router = express.Router();
const db = require('../db');

const queryAsync = (sql, values) => {
  return new Promise((resolve, reject) => {
    db.query(sql, values, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

router.post('/', async (req, res) => {
  const { username, email, password } = req.body;

  console.log("🔵 Données reçues :", req.body);

  if (!username || !email || !password) {
    console.log("🟥 Champs manquants");
    return res.status(400).json({ error: 'Champs manquants' });
  }

  try {
    const result = await queryAsync(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, password]
    );

    console.log("✅ Utilisateur créé :", result.insertId);
    return res.json({
      id: result.insertId,
      username,
      email
    });
  } catch (err) {
    console.error("❌ Erreur DB :", err);
    return res.status(500).json({ error: 'Erreur lors de la création du compte' });
  }
});

module.exports = router;
