const express = require('express');
const router = express.Router();
const db = require('../db');

// POST un nouvel utilisateur
router.post('/', (req, res) => {
  const { username, email, password } = req.body;

  // Vérification des données
  if (!username || !email || !password) {
      return res.status(400).json({ error: 'Le nom, l\'email et le mot de passe sont requis' });
  }

  // Requête SQL pour ajouter un utilisateur avec mot de passe
  db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, password], (err, result) => {
      if (err) {
          console.error(err);
          return res.status(500).send('Erreur lors de l\'ajout de l\'utilisateur');
      }
      res.status(201).json({ id: result.insertId, username, email });
  });
});



  module.exports = router;
