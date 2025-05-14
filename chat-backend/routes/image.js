const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

console.log('✅ Route image.js bien chargée');

// Configuration du stockage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images/'); // Dossier pour stocker les images
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueName + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Route POST : uploader une image
router.post('/upload', upload.single('image'), (req, res) => {
  console.log('🔥 Route /upload appelée');
  if (!req.file) {
    return res.status(400).json({ message: 'Aucune image envoyée.' });
  }

  res.json({
    message: 'Image uploadée avec succès.',
    filename: req.file.filename,
    url: `/images/${req.file.filename}`
  });
});

// Route GET : liste des images
router.get('/', (req, res) => {
  fs.readdir('images', (err, files) => {
    if (err) {
      return res.status(500).json({ message: 'Erreur lors de la lecture des fichiers.' });
    }

    const fileList = files.map(file => ({
      filename: file,
      url: `/images/${file}`
    }));

    res.json(fileList);
  });
});


module.exports = router;
