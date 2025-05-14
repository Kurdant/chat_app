const express = require('express');
const router = express.Router();
const db = require('../db');

// GET tous les utilisateurs
router.get('/', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// GET un utilisateur par ID
router.get('/:id', (req, res) => {
  const { id } = req.params;  // Récupère l'ID de l'URL

  db.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length === 0) {
      return res.status(404).send('Utilisateur non trouvé');
    }
    res.json(results[0]);  // Retourne le premier utilisateur trouvé
  });
});

// GET un utilisateur par username
router.get('/username/:username', (req, res) => {
  const { username } = req.params;  // Récupère le username de l'URL

  db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length === 0) {
      return res.status(404).send('Utilisateur non trouvé');
    }
    res.json(results[0]);  // Retourne l'utilisateur trouvé
  });
});


// DELETE un utilisateur
router.delete('/:id', (req, res) => {
    const { id } = req.params; // Récupère l'ID de l'URL
  
    db.query('DELETE FROM users WHERE id = ?', [id], (err, result) => {
      if (err) return res.status(500).send(err);
      if (result.affectedRows === 0) {
        return res.status(404).send('Utilisateur non trouvé');
      }
      res.send(`Utilisateur avec l'ID ${id} a été supprimé.`);
    });
  });
  
  

module.exports = router;
