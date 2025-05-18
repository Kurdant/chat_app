const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../db');

router.post('/', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Champs manquants" });

  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) return res.status(500).json({ error: 'Erreur serveur' });
    if (results.length === 0) return res.status(401).json({ error: 'Utilisateur non trouvé' });

    const user = results[0];
    if (user.password !== password)
      return res.status(403).json({ error: 'Mot de passe incorrect' });

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
  });
});



module.exports = router;
