import React, { useState } from 'react';
import api from '../api';
import './Login.css';

function Login({ irParaCadastro, aoLogar }) {
  const [dados, setDados] = useState({ email: '', senha: '' });

  const lidarComLogin = async (e) => {
    e.preventDefault();
    try {
      const resposta = await api.post('/auth/login', dados);
      const usuarioLogado = resposta.data.user || resposta.data;
      aoLogar(usuarioLogado);
    } catch (error) {
      alert(error.response?.data?.message || "Erro ao entrar");
    }
  };

  return (
    <div className="auth-page">
      <div className="card-zero">
        <h1 className="logo-zero"><span>ZERO</span> LOGIN</h1>
        
        <form className="form-zero" onSubmit={lidarComLogin}>
          <input 
            type="email" 
            placeholder="Seu e-mail" 
            className="input-zero" 
            onChange={e => setDados({...dados, email: e.target.value})} 
            required 
          />
          <input 
            type="password" 
            placeholder="Sua senha" 
            className="input-zero" 
            onChange={e => setDados({...dados, senha: e.target.value})} 
            required 
          />
          <button type="submit" className="btn-zero">ENTRAR NO APP</button>
        </form>

        <button className="link-troca" onClick={irParaCadastro}>
          Ainda não tem conta? <span>Cadastrar</span>
        </button>
      </div>
    </div>
  );
}

export default Login;