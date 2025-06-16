const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors()); // L'application utilise cors
app.use(express.json()); // L'application traitera des données JSON
app.use(express.static('public')); // 

app.listen(PORT, () =>{
    console.log(`Server running on http://localhost:${PORT}`);
});