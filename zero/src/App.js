import React, { useState } from 'react';
import Login from './pages/Login';
import Perfil from './pages/Perfil';
import Welcome from './pages/Welcome';

function App() {
  const [usuario, setUsuario] = useState(null);
  const [mostrarLogin, setMostrarLogin] = useState(false);

  // Função para quando o login der certo
  const aoLogar = (dadosDoUsuario) => {
    setUsuario(dadosDoUsuario);
  };

  // Função para sair
  const aoSair = () => {
    setUsuario(null);
    setMostrarLogin(false);
  };

  // Função para mudar da Welcome para o Login
  const irParaLogin = () => {
    setMostrarLogin(true);
  };

  return (
    <div className="App">
      {/* 1. Se o usuário estiver logado, mostra o Perfil */}
      {usuario ? (
        <Perfil user={usuario} onLogout={aoSair} />
      ) : (
        /* 2. Se não estiver logado, verifica se mostra Login ou Welcome */
        <>
          {mostrarLogin ? (
            <Login aoLogar={aoLogar} />
          ) : (
            /* Passamos irParaLogin para o prop aoFinalizar do Welcome */
            <Welcome aoFinalizar={irParaLogin} />
          )}
        </>
      )}
    </div>
  );
}

export default App;