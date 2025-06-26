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

// Fonction permettant de calculer le niveau actuel du joueur par rapport aux cartes
function calculNiveau(cards) {
  let niveau = 1;
  while (true) {
    // On ne prend que les cartes qui sont du niveau actuel
    const cartesDuNiveau = cards.filter(c => c.niveau === niveau);
    // Si il n'y a aucune carte au niveau actuel, alors on arrête la boucle
    if (cartesDuNiveau.length === 0) break;
    // On vérifie que toutes les cartes du niveau actuel sont au minimum bronze
    const toutesBronze = cartesDuNiveau.every(c => c.points >= 25);
    // Si ce n'est pas le cas alors on arrête
    if (!toutesBronze) break;
    // Sinon on incrémente le niveau
    niveau++;
  }
  return niveau;
}

// GET - Cartes du niveau actuel
app.get('/api/cards', (req, res) => {
  // On lit le JSON
  fs.readFile('points.json', 'utf-8', (err, data) => {
    if (err) return res.status(500).json({ error: "Erreur lecture fichier" });

    let cards = JSON.parse(data);

    // Calcul du niveau du joueur via la fonction juste au dessus
    const niveau = calculNiveau(cards);
    // on met dans le résultat les cartes ainsi que le niveau accompli
    res.json({ cards, niveau });
  });
})

// PUT - Ajouter un point à une carte
app.put('/api/cards/:index/points', (req, res) => {
  // On récupère les JSON des cartes et du niveau du client
  const cards = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  const state = JSON.parse(fs.readFileSync(STATE_FILE, 'utf-8'));

  // On récupère l'index envoyé par le coté client
  const index = parseInt(req.params.index);
  if (isNaN(index)) return res.status(400).json({ error: "Index invalide" });
  // On réccupère toutes les cartes qui correspondent au niveau de l'utilisateur
  const cardsDuNiveau = cards.filter(card => card.niveau === state.niveauClient);
  // La carte a modifier est la carte correspondant à l'index de la demande PUT
  const cardToUpdate = cardsDuNiveau[index];
  if (!cardToUpdate) return res.status(404).json({ error: "Carte non trouvée" });
  // On rajoute un point aux cartes modifiées
  cardToUpdate.points += 1;
  // Si le nombre de point dépasse le seuil, alors on passe au niveau Bronze
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
