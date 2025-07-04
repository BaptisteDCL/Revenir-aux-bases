const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;
const fs = require('fs');
const path = require('path');
const DATA_FILE = path.join(__dirname, 'cards.json');

app.use(cors()); // L'application utilise cors
app.use(express.json()); // L'application traitera des données JSON
app.use(express.static('public')); // Pour afficher la page, prendra le index.html contenu dans le dossier public

// Charger les cartes existantes
function loadCards() {
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, '[]'); // Si le fichier json n'est pas trouvé alors nous le remplissons d'une liste vide

  const content = fs.readFileSync(DATA_FILE, 'utf8'); // Passage du contenu en utf8

  // Si le fichier est vide ou invalide, on renvoie un tableau vide
  try {
    return content.trim() === '' ? [] : JSON.parse(content); // Si le contenu est vide alors on retourne une liste vide qu'on parse en JSON
  } catch (e) {
    console.error("❌ Erreur de parsing JSON :", e);
    return [];
  }
}

app.get('/api/cards', (req, res) =>{
    fs.readFile(DATA_FILE, 'utf-8', (err, data) =>{ // Fonction de lecture du fichier JSON
        if (err) return res.status(500).json({ error : "Erreur lors de la lecture du fichier"}); // Catching de l'erreur générée

        let cards = []; // Création de la liste qui va contenir les données

        try{
            cards = JSON.parse(data); // Ajout des données du JSON dans cards
        } catch (e) {
            return;
        }

        res.json(cards); // Envoie des données
    });
});

// Creation de la route POST pour ajouter de nouvelles cartes à la BDD
app.post('/api/cards', (req, res) =>{
    const newCard = req.body; // Création d'un nouvel objet qui contiendra les données en JSON

    fs.readFile(DATA_FILE, 'utf-8', (err, data) =>{ // Appel de la fonction pour lire le fichier json
        if (err) return res.status(500).json({ error : 'Erreur lors de la lecture du fichier'}); // Catching de l'erreur générée

        let cards = []; // Nous instancions l'objet qui va contenir la BDD
        try{
            cards = JSON.parse(data); // Mise dans l'objet de la BDD
        } catch (e) {
            // Si le fichier est vide ou corrompu
            cards = JSON.parse('');
        }

        cards.push(newCard); // Ajout de la nouvelle carte dans l'objet

        fs.writeFile(DATA_FILE, JSON.stringify(cards, null, 2), (err) =>{ // Appel de la fonction pour écrire dans le JSON
            if (err) return res.status(500).json({ error : 'Erreur écriture de fichier'}); // Si erreur alors on renvoie un message pour l'expliquer

            res.status(201).json(newCard); // Affichage de la carte ajoutée
        });
    });
});

// Route DELETE pour supprimer une carte selon son index
app.delete('/api/cards/:index', (req, res) => {
    const index = parseInt(req.params.index, 10); // Récupération de l'index de la carte à supprimer

    fs.readFile(DATA_FILE, 'utf-8', (err, data) =>{ // Lecture des données stockées dans le JSON
        if (err) return res.status(500).json({ error : "Erreur lors de la lecture du fichier"});

        let cards = [] // On instancie l'objet qui va contenir les données

        // Try catch pour convertir les données JSON
        try {
            cards = JSON.parse(data);
        } catch (e) {
            return res.status(500).json({ error : "Erreur dans le JSON"});
        }

        // Si l'index est en dehors de la liste alors on retourne une erreur
        if (index < 0 || index >= cards.length) {
            return res.status(404).json({ error : "Index introuvable"});
        }

        // Suppression de la carte de la liste
        cards.splice(index, 1); 

        // Ecriture du nouveau JSON
        fs.writeFile(DATA_FILE, JSON.stringify(cards, null, 2), (err) =>{
            if (err) return res.status(500).json({ error : "Erreur lors de l'écriture du JSON"});

            res.status(200).json({ message : "Carte supprimée"});
        });
    });
});

// Création de la route put pour modifier une carte
app.put('/api/cards/:index', (req, res) => {
  const cards = loadCards(); // Chargement des cartes
  const index = parseInt(req.params.index, 10); // Passage de l'argument index en INT

  if (index >= 0 && index < cards.length) { // Si l'index est plus grand ou égal à 0 et qu'il est plus petit que la taille de la liste
    cards[index] = req.body; // La carte avec le bon index est remplacé par celui de PUT
    // Ecriture du nouveau JSON
    fs.writeFile(DATA_FILE, JSON.stringify(cards, null, 2), (err) => {
        if (err) return res.status(500).json({ error : "Erreur lors de l'écriture du JSON"});
    });
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

app.listen(PORT, () =>{
    console.log(`Server running on http://localhost:${PORT}`);
});