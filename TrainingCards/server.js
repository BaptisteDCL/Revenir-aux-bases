const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors()); // Utilisation de l'objet pour utilser le lien entre front et backend
app.use(bodyParser.json()); // Utilisation de l'objet pour utiliser les données en JSON
app.use(express.static('public'));

const filepath = './cards.json'; // Liene vers la base de données

// Charger les cartes existantes
function loadCards() {
  if (!fs.existsSync(filepath)) fs.writeFileSync(filepath, '[]'); // Si le fichier json n'est pas trouvé alors nous le remplissons d'une liste vide

  const content = fs.readFileSync(filepath, 'utf8'); // Passage du contenu en utf8

  // Si le fichier est vide ou invalide, on renvoie un tableau vide
  try {
    return content.trim() === '' ? [] : JSON.parse(content); // Si le contenu est vide alors on retourne une liste vide qu'on parse en JSON
  } catch (e) {
    console.error("❌ Erreur de parsing JSON :", e);
    return [];
  }
}

// Sauvegarder les cartes
function saveCards(cards) {
    fs.writeFileSync(filepath, JSON.stringify(cards, null, 2)); // ?
}

// 🔽 GET : récupérer les cartes
app.get('/api/cards', (req, res) => {
  const cards = loadCards(); // Appel de la fonction de chargement des cartes
  res.json(cards); // Retourne la liste des cartes en json
});

app.post('/api/cards', (req, res) => {
  const cards = loadCards(); // Chargement des cartes actuelles dans le json
  const newCard = {
    title: req.body.title,
    description: req.body.description,
    actuel: req.body.actuel || '',
    pousser: req.body.pousser || '',
    category: req.body.category || 'routine',
    type: req.body.type || '',
    progress: req.body.progress || 0
  }; // Création d'une nouvelle carte avec les paramètres indiqués
  cards.push(newCard); // Ajout de la nouvelle carte dans la liste
  saveCards(cards); // Ajout de cette nouvelle liste dans le JSON
  res.status(201).json(newCard); // Retour json de la nouvelle carte avec le statut
});

app.put('/api/cards/:index', (req, res) => {
  const cards = loadCards(); // Chargement des cartes
  const index = parseInt(req.params.index, 10); // Passage de l'argument index en INT

  if (index >= 0 && index < cards.length) { // Si l'index est plus grand ou égal à 0 et qu'il est plus petit que la taille de la liste
    cards[index] = req.body; // La carte avec le bon index est remplacé par celui de PUT
    saveCards(cards); // Sauvegarde de l'opération
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

// ❌ DELETE : supprimer une carte (par index)
app.delete('/api/cards/:index', (req, res) => {
  const cards = loadCards(); // Chargement de la liste des cartes
  const index = parseInt(req.params.index, 10); // Récupération de l'index de la carte concernée
  if (index >= 0 && index < cards.length) { // Si l'index est plus grand ou egal à 0 et qu'il est plus petit que la taille de la liste
    cards.splice(index, 1); // On supprime l'élément de la liste
    saveCards(cards); // On sauvegarde la nouvelle liste
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});