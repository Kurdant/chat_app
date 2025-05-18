const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/', (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: 'Champs manquants' });
    }

    db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, password], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Erreur lors de la création du compte');
        }

        res.status(201).json({ id: result.insertId, username, email });
    });
});

module.exports = router;
