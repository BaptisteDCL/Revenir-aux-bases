const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

let books = ["livre1", "livre2"];
let nextId = 2;

app.get("/", (req, res) => {
    res.json({ message : "Hello from backend 👋"});
});

app.get("/livres", (req, res) => {
    res.json(books);
});

app.post("/livres", (req, res) =>{
    const { title, content } = req.body;

    if (!title || !content){
        return res.status(404).json({ error : "Le livre n'est pas connu."});
    }

    const newBook = {
        id : nextId++,
        title,
        content,
        createdAt: new Date().toISOString()
    };

    books.push(newBook);
    res.status(201).json();
});

app.delete("/livres/:id", (req, res) =>{
    const id = parseInt(req.body.id);

    const livreIndex = books.findIndex(book => book.id === id);

    if (livreIndex === -1) {
        return res.status(404).json({ error : "Book not found."});
    }

    const deletebook = books.splice(id, 1)[0];
    res.json({ message : "Book deleted successfully", book : deletebook});
})

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
}); 