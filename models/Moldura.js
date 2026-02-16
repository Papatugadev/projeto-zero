const mongoose = require('mongoose');

const MolduraSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  preco: { type: Number, required: true },
  estoque: { type: Number, required: true },
  arquivoPng: { type: String, required: true }, // Ex: "moldura_gold.png"
});

module.exports = mongoose.model('Moldura', MolduraSchema);