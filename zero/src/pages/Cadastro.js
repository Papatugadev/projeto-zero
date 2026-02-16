import React, { useState } from 'react';
import api from '../api';
import './Cadastro.css';
function Cadastro({ irParaLogin }) {
  const [dados, setDados] = useState({ nome: '', email: '', senha: '', confirmarSenha: '' });

  const lidarComCadastro = async (e) => {
    e.preventDefault();
    if (dados.senha !== dados.confirmarSenha) return alert("Senhas não coincidem!");

    try {
      await api.post('/auth/registrar', dados);
      alert("Conta Zero criada com sucesso!");
      irParaLogin();
    } catch (error) {
      alert(error.response?.data?.message || "Erro no cadastro");
    }
  };

  return (
    <div className="card-zero">
      <h1 className="logo-zero"><span>ZERO</span> JOIN</h1>
      <form className="form-zero" onSubmit={lidarComCadastro}>
        <input type="text" placeholder="Nome único" className="input-zero" 
               onChange={e => setDados({...dados, nome: e.target.value})} required />
        <input type="email" placeholder="E-mail único" className="input-zero" 
               onChange={e => setDados({...dados, email: e.target.value})} required />
        <input type="password" placeholder="Senha" className="input-zero" 
               onChange={e => setDados({...dados, senha: e.target.value})} required />
        <input type="password" placeholder="Confirme a Senha" className="input-zero" 
               onChange={e => setDados({...dados, confirmarSenha: e.target.value})} required />
        <button type="submit" className="btn-zero">CRIAR CONTA</button>
      </form>
      <button className="link-troca" onClick={irParaLogin}>Já tem conta? <span>Entrar</span></button>
    </div>
  );
}

export default Cadastro;