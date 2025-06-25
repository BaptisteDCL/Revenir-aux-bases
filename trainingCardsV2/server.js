const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

const DATA_FILE = path.join(__dirname, 'points.json');
const STATE_FILE = path.join(__dirname, 'state.json');

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

function calculNiveau(cards) {
  let niveau = 1;
  while (true) {
    const cartesDuNiveau = cards.filter(c => c.niveau === niveau);
    if (cartesDuNiveau.length === 0) break;
    const toutesBronze = cartesDuNiveau.every(c => c.points >= 25);
    if (!toutesBronze) break;
    niveau++;
  }
  return niveau;
}

// GET - Cartes du niveau actuel
app.get('/api/cards', (req, res) => {
  fs.readFile('points.json', 'utf-8', (err, data) => {
    if (err) return res.status(500).json({ error: "Erreur lecture fichier" });

    let cards = JSON.parse(data);

    // Calcul du niveau du joueur
    const niveau = calculNiveau(cards); // Tu peux garder cette fonction simple

    res.json({ cards, niveau });
  });
})

// PUT - Ajouter un point à une carte
app.put('/api/cards/:index/points', (req, res) => {
  const cards = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  const state = JSON.parse(fs.readFileSync(STATE_FILE, 'utf-8'));

  const index = parseInt(req.params.index);
  if (isNaN(index)) return res.status(400).json({ error: "Index invalide" });

  const cardsDuNiveau = cards.filter(card => card.niveau === state.niveauClient);

  const cardToUpdate = cardsDuNiveau[index];
  if (!cardToUpdate) return res.status(404).json({ error: "Carte non trouvée" });

  cardToUpdate.points += 1;
  if (cardToUpdate.points >= 25) {
    cardToUpdate.rang = "Bronze";
  }

  // Met à jour la vraie carte dans la liste complète
  const vraieIndex = cards.findIndex(c => c.title === cardToUpdate.title);
  cards[vraieIndex] = cardToUpdate;

  fs.writeFileSync(DATA_FILE, JSON.stringify(cards, null, 2));

  // Vérifier si on peut passer au niveau suivant
  const cartesDuNiveauMAJ = cards.filter(c => c.niveau === state.niveauClient);
  const toutesBronze = cartesDuNiveauMAJ.every(c => c.points >= 25);

  if (toutesBronze) {
    state.niveauClient++;
    fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
  }

  res.json({ success: true, card: cardToUpdate });
});

app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
