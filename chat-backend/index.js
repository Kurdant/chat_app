const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv'); // Ajouter l'import de dotenv


dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

// ROUTES

// ROUTE IMAGE
const imageRoutes = require('./routes/image');
app.use('/images', imageRoutes);

// ROUTE USERS
const usersRoute = require('./routes/users');
app.use('/users', usersRoute);

// ROUTE LOGIN
const loginRoute = require('./routes/login');
app.use('/login', loginRoute);

// ROUTE MESSAGES
const messagesRoutes = require('./routes/messages');
app.use('/messages', messagesRoutes);

// ROUTE CONVERSATION
app.get('/messages/conversation/:id1/:id2', (req, res) => {
    const { id1, id2 } = req.params;
  
    if (!id1 || !id2) {
      return res.status(400).json({ error: 'Les identifiants des utilisateurs sont requis' });
    }
  
    // Requête SQL pour récupérer les messages entre les deux utilisateurs
    const query = `
      SELECT * FROM messages
      WHERE (sender_id = ? AND receiver_id = ?)
         OR (sender_id = ? AND receiver_id = ?)
      ORDER BY timestamp ASC
    `;
  
    db.execute(query, [id1, id2, id2, id1], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des messages.' });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: 'Aucun message trouvé pour cette conversation.' });
      }
      return res.json(results);
    });
  });

// Lancement du serveur
app.listen(3000, () => {
  console.log('Serveur Node.js lancé sur http://localhost:3000');
});
