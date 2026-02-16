import React, { useState, useEffect } from 'react';
import { User, Frame, BadgeCheck, Settings, X, LogOut, Edit2, MessageSquare, Sword, Home, ShoppingBag } from 'lucide-react';
import './Perfil.css';

function Perfil({ user, onLogout }) {
  const apiBaseUrl = "https://projeto-zero.onrender.com";
  const dadosUsuario = user || { nome: "Usuário Zero", username: "@zero_user" };

  // ESTADOS DO APP
  const [abaAtiva, setAbaAtiva] = useState('perfil');
  const [menuConfigAberto, setMenuConfigAberto] = useState(false);
  const [editDrawerAberto, setEditDrawerAberto] = useState(false);
  const [inventarioAberto, setInventarioAberto] = useState(null);
  const [fotoPerfil, setFotoPerfil] = useState(() => localStorage.getItem('@Zero:fotoPerfil') || null);
  const [moldurasBanco, setMoldurasBanco] = useState([]);

  // ESTADOS DE EDIÇÃO
  const [nomeEdit, setNomeEdit] = useState(() => localStorage.getItem('@Zero:nomeUsuario') || dadosUsuario.nome);
  const [previewFoto, setPreviewFoto] = useState(null);
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmaSenha, setConfirmaSenha] = useState('');

  // ESTADOS DE EQUIPAMENTOS
  const [molduraEquipada, setMolduraEquipada] = useState(() => localStorage.getItem('@Zero:moldura') || null);
  const [badgeEquipada, setBadgeEquipada] = useState(() => {
    const salva = localStorage.getItem('@Zero:badge');
    return salva ? JSON.parse(salva) : null;
  });

  // 1. Carregar Molduras do Banco de Dados (Render)
  const carregarLoja = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/loja/molduras`);
      const dados = await response.json();
      setMoldurasBanco(dados);
    } catch (error) {
      console.error("Zero Log: Erro ao conectar na API do Render:", error);
    }
  };

  // 2. Função de Compra
  const handleComprar = async (id) => {
    try {
      const response = await fetch(`${apiBaseUrl}/loja/comprar/${id}`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const resultado = await response.json();
      if (resultado.success) {
        alert("Item adquirido com sucesso no Zero!");
        carregarLoja();
      } else {
        alert(resultado.message || "Erro na compra.");
      }
    } catch (error) {
      console.error("Erro ao conectar com o servidor:", error);
      alert("Servidor Render demorou a responder. Tente novamente.");
    }
  };

  useEffect(() => {
    carregarLoja();
  }, []);

  useEffect(() => {
    if (abaAtiva === 'loja') carregarLoja();
  }, [abaAtiva]);

  const RenderConteudo = () => {
    switch (abaAtiva) {
      case 'perfil':
        return (
          <div className="tab-content-fade">
            <header className="perfil-header-vertical">
              <div className="avatar-main-wrapper">
                <div className="moldura-equipada" style={{ borderColor: molduraEquipada || 'transparent' }}></div> 
                <div className="avatar-circle-big">
                  {fotoPerfil ? (
                    <img src={fotoPerfil} alt="Perfil" style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover'}} />
                  ) : (
                    <User size={50} color={molduraEquipada || "#444"} />
                  )}
                </div>
                {badgeEquipada && <div className="badge-verificado-foto">{badgeEquipada.icon}</div>}
              </div>
              <div className="user-info-vertical">
                <h3 style={{ color: '#d4af37' }}>{nomeEdit}</h3>
                <span>{dadosUsuario.username}</span>
              </div>
            </header>

            <div className="perfil-tabs-topo">
              <button onClick={() => setInventarioAberto('molduras')} className="tab-btn">
                <Frame size={18} /> <span>MOLDURAS</span>
              </button>
              <button onClick={() => setInventarioAberto('badges')} className="tab-btn">
                <BadgeCheck size={18} /> <span>BADGES</span>
              </button>
            </div>
          </div>
        );

      case 'loja':
        return (
          <div className="tab-content-fade loja-container">
            <div className="loja-header">
              <h2 style={{ color: '#d4af37' }}>LOJA ZERO</h2>
              <p>MOLDURAS DISPONÍVEIS</p>
            </div>
            <div className="loja-grid">
              {moldurasBanco && moldurasBanco.length > 0 ? (
                moldurasBanco.map((item) => (
                  <div key={item._id} className={`loja-card ${item.estoque === 0 ? 'esgotado' : ''}`}>
                    <div className="loja-item-preview">
                      <img src={`${apiBaseUrl}/molduras/${item.arquivoPng}`} alt={item.nome} className="png-moldura-loja" />
                      <User size={30} color="#222" />
                    </div>
                    <div className="loja-item-info">
                      <h4>{item.nome}</h4>
                      <span className="loja-estoque">{item.estoque} UNIDADES</span>
                      <button className="btn-comprar" disabled={item.estoque === 0} onClick={() => handleComprar(item._id)}>
                        {item.estoque > 0 ? `C$ ${item.preco}` : 'ESGOTADO'}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p style={{gridColumn: '1/-1', textAlign: 'center', padding: '20px'}}>Carregando vitrine do Zero...</p>
              )}
            </div>
          </div>
        );
      case 'chat': return <div className="placeholder-view"><h2>Mensagens</h2><p>Em breve no Zero.</p></div>;
      case 'arena': return <div className="placeholder-view"><h2>Arena</h2><p>Prepare seu deck.</p></div>;
      default: return null;
    }
  };

  return (
    <div className="perfil-container">
      {abaAtiva === 'perfil' && (
        <button className="btn-config-topo" onClick={() => setMenuConfigAberto(true)}>
          <Settings size={24} color="#d4af37" />
        </button>
      )}

      <main className="main-content-area">
        <RenderConteudo />
      </main>

      <nav className="navbar-zero">
        <button className={`nav-item ${abaAtiva === 'perfil' ? 'active' : ''}`} onClick={() => setAbaAtiva('perfil')}><User size={22} /></button>
        <button className={`nav-item ${abaAtiva === 'chat' ? 'active' : ''}`} onClick={() => setAbaAtiva('chat')}><MessageSquare size={22} /></button>
        <button className={`nav-item ${abaAtiva === 'loja' ? 'active' : ''}`} onClick={() => setAbaAtiva('loja')}><ShoppingBag size={22} /></button>
        <button className={`nav-item ${abaAtiva === 'arena' ? 'active' : ''}`} onClick={() => setAbaAtiva('arena')}><Sword size={22} /></button>
        <button className={`nav-item ${abaAtiva === 'home' ? 'active' : ''}`} onClick={() => setAbaAtiva('perfil')}><Home size={22} /></button>
      </nav>

      {/* DRAWER CONFIGURAÇÕES */}
      {menuConfigAberto && (
        <div className="drawer-container-fix">
          <div className="overlay" onClick={() => setMenuConfigAberto(false)} />
          <div className="config-drawer">
            <div className="drawer-header">
              <h3 style={{ color: '#d4af37' }}>CONFIGURAÇÕES</h3>
              <button className="close-btn" onClick={() => setMenuConfigAberto(false)}><X /></button>
            </div>
            <div className="config-options">
              <button className="config-item" onClick={() => { setEditDrawerAberto(true); setMenuConfigAberto(false); }}>
                <Edit2 size={20} /> Editar Perfil
              </button>
              <button className="config-item logout" onClick={onLogout}><LogOut size={20} /> Sair</button>
            </div>
          </div>
        </div>
      )}

      {/* DRAWER EDITAR PERFIL */}
      {editDrawerAberto && (
        <div className="drawer-container-fix">
          <div className="overlay" onClick={() => setEditDrawerAberto(false)} />
          <div className="edit-drawer">
            <div className="drawer-header">
              <h3 style={{ color: '#d4af37' }}>EDITAR PERFIL</h3>
              <button className="close-btn" onClick={() => setEditDrawerAberto(false)}><X /></button>
            </div>
            <div className="edit-content">
              <div className="edit-section">
                <label className="upload-label">
                  <div className="preview-edit-avatar">
                    {previewFoto ? <img src={previewFoto} alt="Preview" /> : <User size={40} color="#d4af37" />}
                    <div className="edit-icon-overlay"><Edit2 size={14} /></div>
                  </div>
                  <input type="file" accept="image/*" hidden onChange={(e) => {
                    const file = e.target.files[0];
                    if(file) setPreviewFoto(URL.createObjectURL(file));
                  }} />
                </label>
              </div>
              <div className="edit-section">
                <label>NOME DE EXIBIÇÃO</label>
                <input type="text" className="input-zero-edit" value={nomeEdit} onChange={(e) => setNomeEdit(e.target.value)} />
              </div>
              <button className="btn-zero-save" onClick={() => {
                if (previewFoto) {
                  setFotoPerfil(previewFoto);
                  localStorage.setItem('@Zero:fotoPerfil', previewFoto);
                }
                localStorage.setItem('@Zero:nomeUsuario', nomeEdit);
                alert("Perfil do Zero atualizado!");
                setEditDrawerAberto(false);
              }}> SALVAR ALTERAÇÕES </button>
            </div>
          </div>
        </div>
      )}

      {/* INVENTÁRIO */}
      {inventarioAberto && (
        <div className="drawer-container-fix">
          <div className="overlay" onClick={() => setInventarioAberto(null)} />
          <div className="inventory-drawer">
            <div className="drawer-header">
              <h3 style={{ color: '#d4af37' }}>{inventarioAberto.toUpperCase()}</h3>
              <button className="close-btn" onClick={() => setInventarioAberto(null)}><X /></button>
            </div>
            <p style={{color: '#666', textAlign: 'center', padding: '20px'}}>Seu inventário de {inventarioAberto} está vazio.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Perfil;