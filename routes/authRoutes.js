const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
 router.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    try {
        const usuario = await User.findOne({ email });
        if (!usuario) return res.status(400).json({ message: "E-mail não encontrado" });

        // A ordem correta: (senha_digitada, senha_do_banco)
        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        
        if (!senhaValida) {
            return res.status(400).json({ message: "Senha incorreta" });
        }

        res.json({ message: "Login realizado!", nome: usuario.nome });
    } catch (err) {
        res.status(500).json({ message: "Erro no servidor" });
    }
});
router.post('/registrar', async (req, res) => {
    const { nome, email, senha, confirmarSenha } = req.body;

    // 1. Verificação de confirmação de senha
    if (senha !== confirmarSenha) {
        return res.status(400).json({ message: "As senhas não coincidem." });
    }

    try {
        // 2. Verificar se o nome já existe
        const nomeExiste = await User.findOne({ nome });
        if (nomeExiste) return res.status(400).json({ message: "Este nome de usuário já está em uso." });

        // 3. Verificar se o e-mail já existe
        const emailExiste = await User.findOne({ email });
        if (emailExiste) return res.status(400).json({ message: "Este e-mail já está cadastrado." });

        // 4. Criptografar senha
        const salt = await bcrypt.genSalt(10);
        const senhaCriptografada = await bcrypt.hash(senha, salt);

        const novoUsuario = new User({
            nome,
            email,
            senha: senhaCriptografada
        });

        await novoUsuario.save();
        res.status(201).json({ message: "Usuário criado com sucesso!" });

    } catch (err) {
        res.status(500).json({ message: "Erro ao registrar usuário." });
    }
});
module.exports = router;