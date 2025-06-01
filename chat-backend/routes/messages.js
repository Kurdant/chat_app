const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth.js'); // à adapter selon ton projet



module.exports = (db) => {
  // ✅ Envoyer un message (sécurisé par token)
  router.post('/', authenticateToken, (req, res) => {
    const senderId = req.user.id;
    const { receiver_id, content } = req.body;
  
    if (!receiver_id || !content) {
      return res.status(400).json({ error: 'Champs requis manquants' });
    }
  
    const sql = 'INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?)';
    db.query(sql, [senderId, receiver_id, content], (err, result) => {
      if (err) {
        console.error('Erreur envoi message :', err);
        return res.status(500).json({ error: 'Erreur serveur' });
      }
  
      console.log('✅ Message inséré ID :', result.insertId);
      return res.status(201).json({ message: 'Message envoyé', id: result.insertId });
    });
  });
  

  // ✅ Récupérer les messages reçus par l'utilisateur connecté
  router.get('/received', authenticateToken, (req, res) => {
    const userId = req.user.id;

    const sql = `
      SELECT messages.*, 
             u1.username AS sender_username,
             u2.username AS receiver_username
      FROM messages
      JOIN users u1 ON messages.sender_id = u1.id
      JOIN users u2 ON messages.receiver_id = u2.id
      WHERE receiver_id = ?
      ORDER BY timestamp DESC
    `;

    db.query(sql, [userId], (err, results) => {
      if (err) {
        console.error('Erreur récupération messages :', err);
        return res.status(500).json({ error: 'Erreur serveur' });
      }
      res.json(results);
    });
  });

  // ✅ Récupérer une conversation entre l'utilisateur connecté et un autre
  router.get('/conversation/:otherUserId', authenticateToken, (req, res) => {
    const userId = req.user.id;
    const otherUserId = req.params.otherUserId;

    const query = `
      SELECT * FROM messages
      WHERE (sender_id = ? AND receiver_id = ?)
         OR (sender_id = ? AND receiver_id = ?)
      ORDER BY timestamp ASC
    `;

    db.query(query, [userId, otherUserId, otherUserId, userId], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Une erreur est survenue.' });
      }
      res.json(results);
    });
  });

  

  
  return router;
};
