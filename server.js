const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// --- 1. CONFIGURAÇÃO DO MODELO (MOLDURA) ---
const MolduraSchema = new mongoose.Schema({
  nome: String,
  preco: Number,
  estoque: Number,
  arquivoPng: String
});
const Moldura = mongoose.models.Moldura || mongoose.model('Moldura', MolduraSchema);

// Servir arquivos estáticos (molduras)
app.use('/molduras', express.static(path.join(__dirname, 'public/molduras')));

// --- 2. CONEXÃO COM O BANCO ---
const DB_URL = "mongodb+srv://jorge:zero2026@cluster0.96jvub5.mongodb.net/zero?retryWrites=true&w=majority";

// Variável para monitorar a conexão
let isConnected = false;

// Desligamos o buffer para evitar que comandos fiquem presos se a rede oscilar
mongoose.set('bufferCommands', false);

mongoose.connect(DB_URL, {
  serverSelectionTimeoutMS: 15000
})
.then(() => {
  isConnected = true;
  console.log("✅ Zero: Banco de Dados Conectado com Sucesso!");
})
.catch(err => {
  console.error("❌ Erro de conexão MongoDB:", err.message);
});

// --- 3. ROTAS DA LOJA ---

app.get('/loja/setup', async (req, res) => {
  // Verificação de segurança: impede o erro de "buffering timed out"
  if (!isConnected) {
    return res.status(503).send("O servidor ainda está estabelecendo conexão com o banco. Aguarde 5 segundos e atualize a página.");
  }

  try {
    const moldurasIniciais = [
      { nome: "mush", preco: 500, estoque: 3, arquivoPng: "mush.png" },
      { nome: "orion", preco: 350, estoque: 5, arquivoPng: "orion.png" }
    ];

    await Moldura.deleteMany({}); 
    await Moldura.insertMany(moldurasIniciais);
    res.send("Loja do Zero configurada com sucesso!");
  } catch (err) {
    res.status(500).send("Erro no setup: " + err.message);
  }
});

app.get('/loja/molduras', async (req, res) => {
  try {
    if (!isConnected) throw new Error("Banco desconectado");
    const molduras = await Moldura.find();
    res.json(molduras);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/loja/comprar/:id', async (req, res) => {
  try {
    if (!isConnected) throw new Error("Banco desconectado");
    const moldura = await Moldura.findById(req.params.id);
    if (!moldura || moldura.estoque <= 0) {
      return res.status(400).json({ success: false, message: "Item esgotado ou não encontrado" });
    }
    moldura.estoque -= 1; 
    await moldura.save();
    res.json({ success: true, message: "Compra realizada!", estoqueAtual: moldura.estoque });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- 4. OUTRAS ROTAS ---
app.get('/', (req, res) => res.send("API Plataforma Zero Rodando..."));

// Rota de autenticação (certifique-se que o arquivo existe em ./routes/authRoutes.js)
try {
  app.use('/auth', require('./routes/authRoutes'));
} catch (e) {
  console.log("⚠️ Aviso: Rotas de auth não carregadas. Verifique se o arquivo existe.");
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor do Zero online na porta ${PORT}`);
});