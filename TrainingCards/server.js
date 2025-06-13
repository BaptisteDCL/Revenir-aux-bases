const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

const filepath = './cards.json';

// Charger les cartes existantes
function loadCards() {
    if (!fs.existsSync(filepath)) fs.writeFileSync(filepath, []);
    return JSON.parse(fs.readFileSync(filepath));
}

// Sauvegarder les cartes
function saveCards(cards) {
    fs.writeFileSync(filepath, JSON.stringify(cards, null, 2)); // ?
}

// 🔽 GET : récupérer les cartes
app.get('/api/cards', (req, res) => {
  const cards = loadCards();
  res.json(cards);
});

// ➕ POST : ajouter une carte
app.post('/api/cards', (req, res) => {
  const cards = loadCards();
  const newCard = req.body;
  cards.push(newCard);
  saveCards(cards);
  res.status(201).json(newCard);
});

// ❌ DELETE : supprimer une carte (par index)
app.delete('/api/cards/:index', (req, res) => {
  const cards = loadCards();
  const index = parseInt(req.params.index, 10);
  if (index >= 0 && index < cards.length) {
    cards.splice(index, 1);
    saveCards(cards);
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});