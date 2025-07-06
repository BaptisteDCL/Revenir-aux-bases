const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 3000;

// Chemin vers les deux différents json
const DATA_FILE = path.join(__dirname, 'points.json');
const STATE_FILE = path.join(__dirname, 'state.json');

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Route du port pour réccupérer les données JSON
app.get("/api/cards", async (req, res) => {
    try {
        const cardsData = await fs.readFile("points.json", "utf-8");
        const niveauData = await fs.readFile("niveau.json", "utf-8");

        const cards = JSON.parse(cardsData);
        const niveau = JSON.parse(niveauData);

        const filteredCards = cards.filter(c => c.niveau <= niveau); // on montre aussi les niveaux inférieurs
        res.json({ cards: filteredCards, niveau });

    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la lecture des fichiers", error: err.message });
    }
});

app.put("api/cards/:index/points", (req, res) => {
    // On prends les données contenues dans les JSON
    const cards = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    const state = JSON.parse(fs.readFileSync(STATE_FILE, 'utf-8'));

    // On récupère l'index envoyé par le coté client
    const index = parseInt(req.params.index);
    if (isNaN(index)) return res.status(400).json({message :  "L'index n'existe pas"});
    const cardsDuNiveau = cards.filter(card => card.niveau == state.niveau);
    const cardToUpdate = cardsDuNiveau[index];
    if (!cardToUpdate) return res.status(404).json({ error: "Carte non trouvée" });
    cardToUpdate.points += 1;
    // Si le nombre de point dépasse le seuil, alors on passe au niveau Bronze
    if (cardToUpdate.points >= 25) {
        cardToUpdate.rang = "Bronze";
    }

    // Met à jour la vraie carte dans la liste complète
    const cartesDuNiveauMAJ = cards.findIndex(c => c.title === cardToUpdate.title);
    // Booleen pour savoir si toutes les cartes sont bronze
    const toutesBronze = cartesDuNiveauMAJ.every(c => c.points >= 25);
    // Si le booleen est vrai alors
    if (toutesBronze) {
        // On augmente le status du client
        state.niveauClient++;
        // On écrit les modifications dans le JSOn
        fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
    }

});

app.listen(PORT, () =>{
    console.log(`Serveur lancé sur http://localhost:${PORT}`);
});