import React, { useState } from 'react';
import Login from './pages/Login';
import Perfil from './pages/Perfil';

function App() {
  const [usuario, setUsuario] = useState(null);

  // Função para quando o login der certo
  const aoLogar = (dadosDoUsuario) => {
    setUsuario(dadosDoUsuario);
  };

  // Função para sair
  const aoSair = () => {
    setUsuario(null);
  };

  return (
    <div className="App">
      {!usuario ? (
        <Login aoLogar={aoLogar} />
      ) : (
        <Perfil user={usuario} onLogout={aoSair} />
      )}
    </div>
  );
}

export default App;