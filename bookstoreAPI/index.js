const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

let books = ["livre1", "livre2"];

app.get("/", (req, res) => {
    res.json({ message : "Hello from backend 👋"});
});

app.get("/livres", (req, res) => {
    res.json(books);
});

app.post("/livres", (req, res) =>{
    const livre = req.body;

    if (!livre){
        return res.status(404).json({ error : "Le livre n'est pas connu."});
    }

    books.push(livre);
    res.status(201).json();
});

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
}); 