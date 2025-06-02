const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

let films = [];
let nextId = 1;

app.get("/", (req, res) => {
    res.json({ message : "Hello from backend 👋"});
});

app.get("/films", (req, res)=>{
    res.json(films);
});

app.post("/films", (req, res) =>{
    const { title, content } = req.body;

    if (!title || !content){
        return res.status(404).json({ error : "Title and content are required."});
    }

    const newFilm = {
        id : nextId++,
        title,
        content,
        createdAt: new Date().toISOString()
    };

    films.push(newFilm);
    res.status(201).json(newFilm);
})

app.listen(PORT, ()=>{
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});