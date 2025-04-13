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

  // Carregar serviços ao montar o componente
  useEffect(() => {
    loadServicos();
  }, []);

  // Função para carregar os serviços do Supabase
  const loadServicos = async () => {
    setLoading(true);
    try {
      const data = await salaoService.getAll();
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

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Salão Beleza - Gerenciamento de Serviços</h1>
        <div className="user-info">
          <span>Olá, {user?.email}</span>
          <button onClick={signOut} className="logout-btn">Sair</button>
        </div>
      </header>

      <main className="dashboard-content">
        {error && <div className="error-message">{error}</div>}

        <div className="actions-bar">
          <h2>Serviços Disponíveis</h2>
          <button onClick={handleAddNew} className="add-btn">Adicionar Novo Serviço</button>
        </div>

        {loading ? (
          <div className="loading">Carregando serviços...</div>
        ) : servicos.length === 0 ? (
          <div className="empty-state">
            <p>Nenhum serviço cadastrado.</p>
            <button onClick={handleAddNew} className="add-btn">Adicionar Serviço</button>
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
                {servicos.map(servico => (
                  <tr key={servico.id}>
                    <td>{servico.id_servico}</td>
                    <td>{servico.nome_descricao}</td>
                    <td>{servico.categoria}</td>
                    <td>{servico.duracao}</td>
                    <td>{formatPrice(servico.preco)}</td>
                    <td>{servico.profissionais}</td>
                    <td className="actions">
                      <button 
                        onClick={() => handleEdit(servico)} 
                        className="edit-btn"
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button 
                        onClick={() => handleDelete(servico.id)} 
                        className="delete-btn"
                        title="Excluir"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

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
