import { useState, useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';
import { salaoService } from '../lib/salaoService';
import SalaoForm from '../components/SalaoForm';
import './Dashboard.css';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const [servicos, setServicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentServico, setCurrentServico] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Carregar serviços ao montar o componente
  useEffect(() => {
    loadServicos();
  }, []);

  // Função para carregar os serviços do Supabase
  const loadServicos = async () => {
    setLoading(true);
    try {
      const data = await salaoService.getAll();
      console.log("Serviços carregados:", data);
      setServicos(data);
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar serviços:', err);
      setError('Não foi possível carregar os serviços. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Abrir formulário para adicionar novo serviço
  const handleAddNew = () => {
    setCurrentServico(null);
    setShowForm(true);
  };

  // Abrir formulário para editar serviço existente
  const handleEdit = (servico) => {
    setCurrentServico(servico);
    setShowForm(true);
  };

  // Excluir um serviço
  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este serviço?')) {
      try {
        await salaoService.delete(id);
        setServicos(servicos.filter(servico => servico.id !== id));
      } catch (err) {
        console.error('Erro ao excluir serviço:', err);
        setError('Não foi possível excluir o serviço. Por favor, tente novamente.');
      }
    }
  };

  // Salvar um serviço (novo ou atualizado)
  const handleSaveServico = async (formData) => {
    try {
      if (currentServico) {
        // Atualizar serviço existente
        const updatedServico = await salaoService.update(currentServico.id, formData);
        setServicos(servicos.map(servico => 
          servico.id === currentServico.id ? updatedServico : servico
        ));
      } else {
        // Criar novo serviço
        const newServico = await salaoService.create(formData);
        setServicos([...servicos, newServico]);
      }
      setShowForm(false);
    } catch (err) {
      throw err; // Propagar erro para o formulário
    }
  };

  // Fechar o formulário
  const handleCancelForm = () => {
    setShowForm(false);
  };

  // Formatar preço para exibição
  const formatPrice = (price) => {
    if (!price) return '';
    return `R$ ${parseFloat(price).toFixed(2).replace('.', ',')}`;
  };

  // Formatar profissionais para exibição
  const formatProfissionais = (profissionaisString) => {
    if (!profissionaisString) return '';
    
    try {
      // Verifica se a string contém objetos JSON
      if (profissionaisString.includes('"id":') || profissionaisString.includes("'id':")) {
        // Tenta extrair usando regex
        const profArray = [];
        const regex = /\{.*?'id':\s*'(.*?)'.*?'nome':\s*'(.*?)'.*?\}/g;
        let match;
        
        while ((match = regex.exec(profissionaisString)) !== null) {
          profArray.push({ id: match[1], nome: match[2] });
        }
        
        if (profArray.length > 0) {
          return (
            <div className="profissionais-list">
              {profArray.map((prof, index) => (
                <div key={index} className="profissional-tag">
                  <span className="prof-id">{prof.id}</span>
                  <span className="prof-nome">{prof.nome}</span>
                </div>
              ))}
            </div>
          );
        }
      }
      
      // Se não conseguir extrair como JSON, divide por vírgula
      const nomes = profissionaisString.split(',').map(nome => nome.trim());
      return (
        <div className="profissionais-list">
          {nomes.map((nome, index) => (
            <div key={index} className="profissional-tag simple">
              {nome}
            </div>
          ))}
        </div>
      );
    } catch (e) {
      console.error("Erro ao formatar profissionais:", e);
      return profissionaisString;
    }
  };

  // Filtrar serviços com base no termo de pesquisa
  const filteredServicos = servicos.filter(servico => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (servico.id_servico && servico.id_servico.toLowerCase().includes(searchLower)) ||
      (servico.nome_descricao && servico.nome_descricao.toLowerCase().includes(searchLower)) ||
      (servico.categoria && servico.categoria.toLowerCase().includes(searchLower)) ||
      (servico.profissionais && servico.profissionais.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Serviços do Salão de Beleza</h1>
          <div className="user-info">
            <span>Olá, {user?.email}</span>
            <button onClick={signOut} className="logout-btn">Sair</button>
          </div>
        </div>
      </header>

      <main className="dashboard-content" style={{ display: 'block' }}>
        {error && <div className="error-message">{error}</div>}

        <div className="dashboard-controls">
          <div className="action-buttons">
            <button onClick={handleAddNew} className="add-btn">
              <span className="icon">+</span> Novo Serviço
            </button>
            <button onClick={loadServicos} className="refresh-btn">
              <span className="icon">↻</span> Atualizar
            </button>
          </div>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Pesquisar serviços..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="dashboard-main-content">
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Carregando serviços...</p>
            </div>
          ) : filteredServicos.length === 0 ? (
            <div className="empty-state">
              {searchTerm ? (
                <>
                  <p className="empty-title">Nenhum resultado encontrado</p>
                  <p>Não encontramos serviços correspondentes à sua pesquisa.</p>
                  <button onClick={() => setSearchTerm('')} className="clear-search-btn">
                    Limpar pesquisa
                  </button>
                </>
              ) : (
                <>
                  <p className="empty-title">Nenhum serviço cadastrado</p>
                  <p>Clique no botão "Novo Serviço" para adicionar um serviço ao catálogo.</p>
                  <button onClick={handleAddNew} className="add-btn">
                    <span className="icon">+</span> Novo Serviço
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="servicos-table-container">
              <table className="servicos-table">
                <thead>
                  <tr>
                    <th>ID Serviço</th>
                    <th>Nome/Descrição</th>
                    <th>Categoria</th>
                    <th>Duração</th>
                    <th>Preço</th>
                    <th>Profissionais</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredServicos.map(servico => (
                    <tr key={servico.id}>
                      <td>{servico.id_servico}</td>
                      <td>{servico.nome_descricao}</td>
                      <td>{servico.categoria}</td>
                      <td>{servico.duracao}</td>
                      <td>{formatPrice(servico.preco)}</td>
                      <td className="profissionais-cell">
                        {formatProfissionais(servico.profissionais)}
                      </td>
                      <td className="actions">
                        <button 
                          onClick={() => handleEdit(servico)} 
                          className="edit-btn"
                          title="Editar"
                        >
                          <span className="icon">✏️</span>
                        </button>
                        <button 
                          onClick={() => handleDelete(servico.id)} 
                          className="delete-btn"
                          title="Excluir"
                        >
                          <span className="icon">🗑️</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {showForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <SalaoForm 
                record={currentServico} 
                onSubmit={handleSaveServico} 
                onCancel={handleCancelForm} 
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
