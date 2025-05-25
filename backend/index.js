const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

let notes = [];
let nextId = 1;

app.get("/", (req, res) => {
    res.json({ message : "Hello from backend 👋"});
});

app.get("/notes", (req, res) => {
    res.json(notes);
});

app.post("/notes", (req, res) => {
    const { title, content } = req.body;

    if (!title || !content){
        return res.status(400).json({ error : "Title and content are required."});
    }

    const newNote = {
        id : nextId++,
        title,
        content,
        createdAt: new Date().toISOString()
    };

    notes.push(newNote);
    res.status(201).json(newNote);
});

app.delete("/notes/:id",(req, res) =>{
    const id = parseInt(req.params.id);

    const noteIndex = notes.findIndex(note => note.id === id);

    if (noteIndex === -1) {
        return res.status(404).json({ error : "Note not found."});
    }

    const deletedNote = notes.splice(noteIndex, 1)[0];
    res.json({ message : "Note deleted successfully", note : deletedNote});
});

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
}); 