import React, { useState, useEffect } from 'react';
import { User, Frame, BadgeCheck, Settings, X, LayoutGrid, LogOut, Edit2, MessageSquare, Sword, Home, ShoppingBag } from 'lucide-react';
import './Perfil.css';

function Perfil({ user, onLogout }) {
  const dadosUsuario = user || { nome: "Usuário Zero", username: "@zero_user" };

  // ESTADOS DO APP
  const [previewMoldura, setPreviewMoldura] = useState(null);
  const [abaAtiva, setAbaAtiva] = useState('perfil');
  const [menuConfigAberto, setMenuConfigAberto] = useState(false);
  const [editDrawerAberto, setEditDrawerAberto] = useState(false);
  const [inventarioAberto, setInventarioAberto] = useState(null);
  const [fotoPerfil, setFotoPerfil] = useState(null); // ou o valor inicial que você definiu
  // ESTADO DA LOJA (Vem do Banco de Dados)
  const [moldurasBanco, setMoldurasBanco] = useState([]);

  // ESTADOS DE EDIÇÃO
  const [nomeEdit, setNomeEdit] = useState(dadosUsuario.nome);
  const [previewFoto, setPreviewFoto] = useState(null);
  const [trocasNome, setTrocasNome] = useState(0); 
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmaSenha, setConfirmaSenha] = useState('');

  // ESTADOS DE EQUIPAMENTOS
  const [molduraEquipada, setMolduraEquipada] = useState(() => localStorage.getItem('@Zero:moldura') || null);
  const [badgeEquipada, setBadgeEquipada] = useState(() => {
    const salva = localStorage.getItem('@Zero:badge');
    return salva ? JSON.parse(salva) : null;
  });

  // --- FUNÇÕES DE COMUNICAÇÃO COM O SEU SERVER.JS ---

  // 1. Carregar Molduras do MongoDB
 const carregarLoja = async () => {
    console.log("Zero Log: Tentando buscar molduras...");
    try {
      const response = await fetch('http://192.168.15.2:5000/loja/molduras');
      const dados = await response.json();
      console.log("Zero Log: Dados recebidos:", dados);
      setMoldurasBanco(dados);
    } catch (error) {
      console.error("Zero Log: Erro ao conectar no servidor:", error);
    }
  };
// FUNÇÃO DE COMPRA (Faltava esta definição no seu arquivo)
  const handleComprar = async (id) => {
    try {
      const response = await fetch(`http://192.168.15.2:5000/loja/comprar/${id}`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const resultado = await response.json();
      
      if (resultado.success) {
        alert("Item adquirido com sucesso no Zero!");
        carregarLoja(); // Atualiza a lista para mostrar o novo estoque
      } else {
        alert(resultado.message || "Erro na compra.");
      }
    } catch (error) {
      console.error("Erro ao conectar com o servidor:", error);
      alert("Servidor offline.");
    }
  };

  // Garante que a loja carregue os dados
 useEffect(() => {
    carregarLoja(); // Carrega ao abrir o Perfil
  }, []); // Executa uma vez ao montar o componente

  useEffect(() => {
    if (abaAtiva === 'loja') {
      carregarLoja(); // Carrega sempre que clicar na aba Loja
    }
  }, [abaAtiva]);


  // --- SUB-TELAS ---
  const RenderConteudo = () => {
    switch (abaAtiva) {
      case 'perfil':
        return (
          <div className="tab-content-fade">
            <header className="perfil-header-vertical">
              <div className="avatar-main-wrapper">
                <div className="moldura-equipada" style={{ borderColor: molduraEquipada || 'transparent' }}></div> 
                <div className="avatar-circle-big">
                  <User size={50} color={molduraEquipada || "#444"} />
                </div>
                {badgeEquipada && <div className="badge-verificado-foto">{badgeEquipada.icon}</div>}
              </div>
              <div className="user-info-vertical">
                <h3 style={{ color: '#d4af37' }}>{dadosUsuario.nome}</h3>
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
        {/* Se moldurasBanco tiver algo, ele mostra. Se não, mostra o aviso. */}
        {moldurasBanco && moldurasBanco.length > 0 ? (
          moldurasBanco.map((item) => (
            <div 
  key={item._id} 
  className={`loja-card ${item.estoque === 0 ? 'esgotado' : ''}`}
  onClick={() => setPreviewMoldura(`http://192.168.15.2:5000/molduras/${item.arquivoPng}`)} 
  style={{ cursor: 'pointer', border: previewMoldura?.includes(item.arquivoPng) ? '2px solid #d4af37' : 'none' }}
>
              <div className="loja-item-preview">
                {/* Caminho da imagem na pasta public/molduras */}
               <img 
  src={`http://192.168.15.2:5000/molduras/${item.arquivoPng}`} 
  alt={item.nome} 
  className="png-moldura-loja" 
  onError={(e) => {
    // Se falhar com o IP, tenta o caminho local (reserva)
    e.target.onerror = null; 
    e.target.src = `/molduras/${item.arquivoPng}`;
  }}
/>
                <User size={30} color="#222" />
              </div>
              
              <div className="loja-item-info">
                <h4>{item.nome}</h4>
                <span className="loja-estoque">{item.estoque} UNIDADES</span>
                
                <button 
                  className="btn-comprar" 
                  disabled={item.estoque === 0}
                  onClick={() => handleComprar(item._id)}
                >
                  {item.estoque > 0 ? `C$ ${item.preco}` : 'ESGOTADO'}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '20px', color: '#666', gridColumn: '1/-1' }}>
             <p>Carregando vitrine do Zero...</p>
          </div>
        )}
      </div>
    </div>
  );

        

      case 'chat':
        return <div className="placeholder-view"><h2>Mensagens</h2><p>Nenhuma conversa ativa no Zero.</p></div>;
      case 'arena':
        return <div className="placeholder-view"><h2>Arena</h2><p>Prepare-se para o combate.</p></div>;
      case 'feed':
        return <div className="placeholder-view"><h2>Feed</h2><p>Novidades da comunidade.</p></div>;
      default:
        return null;
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
        <div className={`nav-indicator ${abaAtiva}`}></div>
        <button className={`nav-item ${abaAtiva === 'perfil' ? 'active' : ''}`} onClick={() => setAbaAtiva('perfil')}><User size={22} /></button>
        <button className={`nav-item ${abaAtiva === 'chat' ? 'active' : ''}`} onClick={() => setAbaAtiva('chat')}><MessageSquare size={22} /></button>
        <button className={`nav-item ${abaAtiva === 'loja' ? 'active' : ''}`} onClick={() => setAbaAtiva('loja')}><ShoppingBag size={22} /></button>
        <button className={`nav-item ${abaAtiva === 'arena' ? 'active' : ''}`} onClick={() => setAbaAtiva('arena')}><Sword size={22} /></button>
        <button className={`nav-item ${abaAtiva === 'feed' ? 'active' : ''}`} onClick={() => setAbaAtiva('feed')}><Home size={22} /></button>
      </nav>

      {/* MODAL CONFIG */}
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

      {/* MODAL EDITAR PERFIL */}
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
                  <input type="file" accept="image/*" hidden onChange={(e) => setPreviewFoto(URL.createObjectURL(e.target.files[0]))} />
                </label>
              </div>
              <div className="edit-section">
                <label>NOME DE EXIBIÇÃO ({2 - trocasNome} RESTANTES)</label>
                <input type="text" className="input-zero-edit" value={nomeEdit} onChange={(e) => setNomeEdit(e.target.value)} disabled={trocasNome >= 2} />
              </div>
              <div className="edit-section">
                <label>ALTERAR SENHA</label>
                <input type="password" placeholder="Nova senha" className="input-zero-edit" value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} />
                <input type="password" placeholder="Confirmar nova senha" className="input-zero-edit" style={{marginTop: '10px'}} value={confirmaSenha} onChange={(e) => setConfirmaSenha(e.target.value)} />
              </div><button 
  className="btn-zero-save" 
  onClick={() => {
    // 1. Validar Senha (se preenchida)
    if(novaSenha && novaSenha !== confirmaSenha) {
      return alert("As senhas não coincidem!");
    }
    
    // 2. Aplicar a Foto de Perfil na tela
    if (previewFoto) {
      setFotoPerfil(previewFoto);
      localStorage.setItem('@Zero:fotoPerfil', previewFoto); // Salva para não sumir no F5
    }
    
    // 3. Aplicar o Nome na tela
    // IMPORTANTE: Use o setNomeEdit ou crie um estado [nomeExibicao, setNomeExibicao]
    // Para este código, vamos garantir que o Perfil use o 'nomeEdit' como fonte
    localStorage.setItem('@Zero:nomeUsuario', nomeEdit);

    alert("Perfil do Zero atualizado com sucesso!");
    
    // 4. Fechar o Modal
    setEditDrawerAberto(false);
  }}
> 
  SALVAR ALTERAÇÕES 
</button>
2. Ajuste onde o Nome e a Foto aparecem
Para que a alteração seja visível, o cabeçalho do seu perfil deve ler os estados que estamos editando. Verifique se o seu case 'perfil' está assim:

JavaScript
<div className="user-info-vertical">
  {/* Agora ele usa o nomeEdit que você digitou no input */}
  <h3 style={{ color: '#d4af37' }}>{nomeEdit}</h3> 
  <span>{dadosUsuario.username}</span>
</div>
E no círculo da foto:

JavaScript
<div className="avatar-circle-big">
  {fotoPerfil ? (
    <img src={fotoPerfil} alt="Perfil" style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover'}} />
  ) : (
    <User size={50} color="#444" />
  )}
</div>
              <button className="btn-zero-save" onClick={() => {
                if(novaSenha !== confirmaSenha) return alert("As senhas não coincidem!");
                alert("Perfil do Zero atualizado!");
                setEditDrawerAberto(false);
              }}> SALVAR ALTERAÇÕES </button>
              <button className="btn-delete-account" onClick={() => {
                if(window.confirm("SEGURANÇA: Tem certeza que deseja excluir sua conta?")) { onLogout(); }
              }}> EXCLUIR CONTA </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL INVENTÁRIO */}
      {inventarioAberto && (
        <div className="drawer-container-fix">
          <div className="overlay" onClick={() => setInventarioAberto(null)} />
          <div className="inventory-drawer">
            <div className="drawer-header">
              <h3 style={{ color: '#d4af37' }}>{inventarioAberto.toUpperCase()}</h3>
              <button className="close-btn" onClick={() => setInventarioAberto(null)}><X /></button>
            </div>
            <p style={{color: '#666', textAlign: 'center'}}>Seu inventário de {inventarioAberto} está vazio.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Perfil;