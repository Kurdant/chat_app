// Body: { username: 'amiUsername' }
app.post('/friend-request', authenticateToken, async (req, res) => {
    const { username } = req.body;
    const senderId = req.user.id;

    const [receiver] = await db.query('SELECT id FROM users WHERE username = ?', [username]);
    if (!receiver) return res.status(404).json({ message: 'Utilisateur introuvable' });

    // Vérifier si demande déjà envoyée
    const [existing] = await db.query(
        'SELECT * FROM friend_requests WHERE sender_id = ? AND receiver_id = ? AND status = "pending"',
        [senderId, receiver.id]
    );
    if (existing) return res.status(400).json({ message: 'Demande déjà envoyée' });

    await db.query(
        'INSERT INTO friend_requests (sender_id, receiver_id) VALUES (?, ?)',
        [senderId, receiver.id]
    );

    res.json({ message: 'Demande envoyée avec succès' });
});

app.get('/friend-requests', authenticateToken, async (req, res) => {
    const userId = req.user.id;

    const requests = await db.query(`
        SELECT fr.id, u.username AS fromUsername
        FROM friend_requests fr
        JOIN users u ON u.id = fr.sender_id
        WHERE fr.receiver_id = ? AND fr.status = 'pending'
    `, [userId]);

    res.json(requests);
});

// Body: { requestId: 123, action: 'accept' }
app.post('/friend-request/respond', authenticateToken, async (req, res) => {
    const { requestId, action } = req.body;
    const userId = req.user.id;

    const [request] = await db.query('SELECT * FROM friend_requests WHERE id = ? AND receiver_id = ?', [requestId, userId]);
    if (!request) return res.status(404).json({ message: 'Demande introuvable' });

    if (action === 'accept') {
        await db.query('UPDATE friend_requests SET status = "accepted" WHERE id = ?', [requestId]);
        await db.query('INSERT INTO friends (user1_id, user2_id) VALUES (?, ?)', [request.sender_id, userId]);
        return res.json({ message: 'Demande acceptée' });
    } else if (action === 'decline') {
        await db.query('UPDATE friend_requests SET status = "declined" WHERE id = ?', [requestId]);
        return res.json({ message: 'Demande refusée' });
    }

    res.status(400).json({ message: 'Action invalide' });
});

app.get('/friends', authenticateToken, async (req, res) => {
    const userId = req.user.id;

    const friends = await db.query(`
        SELECT u.id, u.username
        FROM friends f
        JOIN users u ON (u.id = f.user1_id OR u.id = f.user2_id)
        WHERE (f.user1_id = ? OR f.user2_id = ?) AND u.id != ?
    `, [userId, userId, userId]);

    res.json(friends);
});
