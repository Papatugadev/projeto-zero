const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());
const path = require('path');


// --- 1. CONFIGURAÇÃO DO MODELO (MOLDURA) ---
// Verificamos se o modelo já existe para evitar o erro de "already declared"
const Moldura = mongoose.models.Moldura || mongoose.model('Moldura', new mongoose.Schema({
  nome: String,
  preco: Number,
  estoque: Number,
  arquivoPng: String
}));
app.use('/molduras', express.static(path.join(__dirname, 'public/molduras')));

// --- 2. CONEXÃO COM O BANCO ---
const DB_URL = "mongodb://jorge_user:mano2024@cluster0-shard-00-00.96jvub5.mongodb.net:27017,cluster0-shard-00-01.96jvub5.mongodb.net:27017,cluster0-shard-00-02.96jvub5.mongodb.net:27017/zero?ssl=true&replicaSet=atlas-xxxxxx-shard-0&authSource=admin&retryWrites=true&w=majority";

mongoose.connect(DB_URL)
  .then(() => console.log("Zero Log: O Banco de Dados agora está ONLINE na Nuvem!"))
  .catch((err) => console.log("Erro ao conectar:", err));

// --- 3. ROTAS DA LOJA ---

// Setup inicial (Acesse http://localhost:5000/loja/setup uma vez)
app.get('/loja/setup', async (req, res) => {
  try {
    const moldurasIniciais = [
      { nome: "mush", preco: 500, estoque: 3, arquivoPng: "mush.png" },
      { nome: "orion", preco: 350, estoque: 5, arquivoPng: "orion.png" },
      { nome: "orion", preco: 350, estoque: 5, arquivoPng: "orion.png" },
      { nome: "orion", preco: 350, estoque: 5, arquivoPng: "orion.png" },
     
    ];

    await Moldura.deleteMany({}); 
    await Moldura.insertMany(moldurasIniciais);
    res.send("Loja do Zero configurada com sucesso!");
  } catch (err) {
    res.status(500).send("Erro no setup: " + err.message);
  }
});

// Listar Molduras
app.get('/loja/molduras', async (req, res) => {
  try {
    const molduras = await Moldura.find();
    res.json(molduras);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Comprar Moldura (Descontar estoque)
app.post('/loja/comprar/:id', async (req, res) => {
  try {
    const moldura = await Moldura.findById(req.params.id);
    
    if (!moldura || moldura.estoque <= 0) {
      return res.status(400).json({ success: false, message: "Item esgotado ou não encontrado" });
    }

    moldura.estoque -= 1; 
    await moldura.save();

    res.json({ 
        success: true, 
        message: "Compra realizada!", 
        estoqueAtual: moldura.estoque 
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- 4. OUTRAS ROTAS ---
app.get('/', (req, res) => res.send("API Plataforma Zero Rodando..."));
app.use('/auth', require('./routes/authRoutes'));

const PORT = 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor do Zero rodando em todas as interfaces na porta ${PORT}`);
});