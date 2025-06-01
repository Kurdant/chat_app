const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../middleware/auth');

// 📩 Envoyer une demande d’ami
router.post('/', authenticateToken, async (req, res) => {
  const { username } = req.body;
  console.log("REQ.BODY:", req.body);

  const senderId = req.user.id;

  try {
    const [receiverRows] = await db.query('SELECT id FROM users WHERE username = ?', [username]);
    if (receiverRows.length === 0) {
      return res.status(404).json({ message: 'Utilisateur introuvable' });
    }

    const receiverId = receiverRows[0].id;

    const [existingRows] = await db.query(
      'SELECT * FROM friend_requests WHERE sender_id = ? AND receiver_id = ? AND status = "pending"',
      [senderId, receiverId]
    );

    if (existingRows.length > 0) {
      return res.status(400).json({ message: 'Demande déjà envoyée' });
    }

    await db.query(
      'INSERT INTO friend_requests (sender_id, receiver_id) VALUES (?, ?)',
      [senderId, receiverId]
    );

    res.json({ message: 'Demande envoyée avec succès' });
  } catch (error) {
    console.error("Erreur dans POST /friendrequest:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// 📬 Voir les demandes reçues
router.get('/', authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const [requests] = await db.query(`
      SELECT fr.id, u.username AS fromUsername
      FROM friend_requests fr
      JOIN users u ON u.id = fr.sender_id
      WHERE fr.receiver_id = ? AND fr.status = 'pending'
    `, [userId]);

    res.json(requests);
  } catch (error) {
    console.error("Erreur dans GET /friendrequest:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// 📬 Voir les demandes envoyées
router.get('/sent', authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const [requests] = await db.query(`
      SELECT fr.id, u.username AS toUsername
      FROM friend_requests fr
      JOIN users u ON u.id = fr.receiver_id
      WHERE fr.sender_id = ? AND fr.status = 'pending'
    `, [userId]);

    res.json(requests);
  } catch (error) {
    console.error("Erreur dans GET /friendrequest/sent:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});


// ✅ Accepter/refuser une demande
router.post('/respond', authenticateToken, async (req, res) => {
  const { requestId, action } = req.body;
  const userId = req.user.id;

  try {
    const [requestRows] = await db.query(
      'SELECT * FROM friend_requests WHERE id = ? AND receiver_id = ?',
      [requestId, userId]
    );

    if (requestRows.length === 0) {
      return res.status(404).json({ message: 'Demande introuvable' });
    }

    const request = requestRows[0];

    if (action === 'accept') {
      await db.query('UPDATE friend_requests SET status = "accepted" WHERE id = ?', [requestId]);
      await db.query('INSERT INTO friends (user1_id, user2_id) VALUES (?, ?)', [request.sender_id, userId]);
      return res.json({ message: 'Demande acceptée' });
    } else if (action === 'decline') {
      await db.query('UPDATE friend_requests SET status = "declined" WHERE id = ?', [requestId]);
      return res.json({ message: 'Demande refusée' });
    }

    res.status(400).json({ message: 'Action invalide' });
  } catch (error) {
    console.error("Erreur dans POST /respond:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// 👥 Liste des amis
router.get('/friends', authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const [friends] = await db.query(`
      SELECT u.id, u.username
      FROM friends f
      JOIN users u ON (u.id = f.user1_id OR u.id = f.user2_id)
      WHERE (f.user1_id = ? OR f.user2_id = ?) AND u.id != ?
    `, [userId, userId, userId]);

    res.json(friends);
  } catch (error) {
    console.error("Erreur dans GET /friends:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});



module.exports = router;
