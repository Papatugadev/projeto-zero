const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    nome: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    senha: { type: String, required: true },
    
    // Customização e Perfil
    fotoPerfil: { type: String, default: 'default-avatar.png' },
    molduraAtual: { type: String, default: 'none' },
    
    // Economia do App
    moedas: { type: Number, default: 0 },
    
    // Colecionáveis (Arrays para guardar vários itens)
    moldurasPossuidas: { type: [String], default: [] },
    badges: { type: [String], default: [] },
    
    // Data de criação (bom para saber quem é usuário antigo/VIP)
    criadoEm: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);