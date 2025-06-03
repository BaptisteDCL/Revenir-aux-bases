const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

let listeDeVoitures = [];
let nextVoitureId = -1;

app.get("/", (req, res) => {
    res.json("Bienvenue sur ma page");
});

app.post("/", (req, res) => {
    const { name, engine } = req.body;

    if (!name, !engine){
        res.status(404).json({ error : "Il manque des arguments à la requête"});
    }

    const newCar = {
        id : nextVoitureId++,
        carName : name,
        carEngine : engine,
        createdAt: new Date().toISOString()
    };

    listeDeVoitures.push(newCar);
    res.status(201).json(newCar);
});

app.listen(PORT, () => {
    console.log(`🚀 Serveur running at http://localhost:${PORT}`);
});