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

// Route du port pour réccupérer les données JSON
app.get("api/cards", (req, res) =>{
    let cards;
    let niveau;
    // Lecture du json des cartes
    fs.readFile("points.json", "utf-8", (err, data) => {
        if (err) return res.status(500).json({ message: "Erreur lors de la lecture du fichier des cartes"});
        cards = JSON.parse(data);
    });

    // Lecture du json du niveau client
    fs.readFile("niveau.json", "utf-8", (err, data) =>{
        if (err) return res.status(500).json({message : "Erreur lors de la lecture du niveau du client"});
        niveau = JSON.parse(data);
    });

    // On renvoie le json contenant toutes les informations cartes + niveau
    res.json({cards, niveau});
})

app.listen(PORT, () =>{
    console.log(`Serveur lancé sur http://localhost:${PORT}`);
});