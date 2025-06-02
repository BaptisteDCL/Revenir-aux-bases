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

app.listen(PORT, () => {
    console.log(`🚀 Serveur running at http://localhost:${PORT}`);
});