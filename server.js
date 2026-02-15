const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
console.log("TESTE DA URL:", process.env.MONGO_URI);

const app = express();
app.use(express.json());
app.use(cors());

// Conexão com o Banco
mongoose.connect(process.env.MONGO_URI) // Sem aspas, apenas a variável
    .then(() => console.log("MDB conectado com sucesso!"))
    .catch(err => console.error("Erro MDB:", err));

// Rota de teste
app.get('/', (req, res) => res.send("API Plataforma Zero Rodando..."));
app.use('/auth', require('./routes/authRoutes'));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor na porta ${PORT}`));