const express = require('express');
const router = express.Router();

module.exports = (db) => {
  // Envoyer un message
  router.post('/', (req, res) => {
    const { sender_id, receiver_id, content } = req.body;

    if (!sender_id || !receiver_id || !content) {
      return res.status(400).json({ error: 'Champs requis manquants' });
    }

    const sql = 'INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?)';
    db.query(sql, [sender_id, receiver_id, content], (err, result) => {
      if (err) {
        console.error('Erreur envoi message :', err);
        return res.status(500).json({ error: 'Erreur serveur' });
      }
      res.status(201).json({ message: 'Message envoyé', id: result.insertId });
    });
  });

  // Récupérer les messages reçus par un utilisateur
  router.get('/:userId', (req, res) => {
    const userId = req.params.userId;

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

    // Route pour récupérer la conversation entre deux utilisateurs
    router.get('/conversation/:id1/:id2', (req, res) => {
      const { id1, id2 } = req.params;
  
      const query = `
        SELECT * FROM messages
        WHERE (sender_id = ? AND receiver_id = ?)
           OR (sender_id = ? AND receiver_id = ?)
        ORDER BY timestamp ASC
      `;
      
      db.execute(query, [id1, id2, id2, id1], (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Une erreur est survenue.' });
        }
        return res.json(results);
      });
    });

  

  return router;
};
