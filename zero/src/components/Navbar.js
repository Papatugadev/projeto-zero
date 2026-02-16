import React from 'react';
import './Navbar.css';
import { LayoutGrid, Sword, ShoppingBag, User } from 'lucide-react';

function Navbar({ abaAtiva, setAbaAtiva }) {
  const abas = [
    { id: 'feed', icon: <LayoutGrid size={24} />, label: 'Feed' },
    { id: 'arena', icon: <Sword size={24} />, label: 'Arena' },
    { id: 'loja', icon: <ShoppingBag size={24} />, label: 'Loja' },
    { id: 'perfil', icon: <User size={24} />, label: 'Perfil' }
  ];

  return (
    <div className="nav-wrapper">
      <nav className="bottom-nav">
        <div 
          className="nav-indicator" 
          style={{ left: `${abas.findIndex(a => a.id === abaAtiva) * 25}%` }}
        ></div>

        {abas.map((aba) => (
          <button 
            key={aba.id}
            className={`nav-item ${abaAtiva === aba.id ? 'active' : ''}`} 
            onClick={() => setAbaAtiva(aba.id)}
          >
            <span className="icon">{aba.icon}</span>
            {abaAtiva === aba.id && <span className="label">{aba.label}</span>}
          </button>
        ))}
      </nav>
    </div>
  );
}

export default Navbar;