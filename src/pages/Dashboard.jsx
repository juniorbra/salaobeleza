import { useState, useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';
import { Navigate } from 'react-router-dom';
import { salaoService } from '../lib/salaoService';
import SalaoForm from '../components/SalaoForm';
import './Dashboard.css';

export default function Dashboard() {
  const { user, signOut, loading: authLoading } = useAuth();
  const [saloes, setSaloes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentSalao, setCurrentSalao] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Buscar dados quando o componente for montado
  useEffect(() => {
    if (user) {
      fetchSaloes();
    }
  }, [user]);

  // Função para buscar todos os salões
  const fetchSaloes = async () => {
    setLoading(true);
    try {
      const data = await salaoService.getAll();
      setSaloes(data);
    } catch (err) {
      console.error('Erro ao buscar salões:', err);
      setError('Não foi possível carregar os dados. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Função para adicionar um novo salão
  const handleCreate = async (formData) => {
    try {
      const newSalao = await salaoService.create(formData);
      setSaloes([...saloes, newSalao]);
      setShowForm(false);
    } catch (err) {
      console.error('Erro ao criar salão:', err);
      throw err;
    }
  };

  // Função para atualizar um salão existente
  const handleUpdate = async (formData) => {
    try {
      const updatedSalao = await salaoService.update(formData.id, formData);
      setSaloes(saloes.map(salao => salao.id === updatedSalao.id ? updatedSalao : salao));
      setShowForm(false);
      setCurrentSalao(null);
    } catch (err) {
      console.error('Erro ao atualizar salão:', err);
      throw err;
    }
  };

  // Função para excluir um salão
  const handleDelete = async (id) => {
    try {
      await salaoService.delete(id);
      setSaloes(saloes.filter(salao => salao.id !== id));
      setConfirmDelete(null);
    } catch (err) {
      console.error('Erro ao excluir salão:', err);
      setError('Não foi possível excluir o salão. Por favor, tente novamente.');
    }
  };

  // Iniciar edição de um salão
  const handleEdit = (salao) => {
    setCurrentSalao(salao);
    setShowForm(true);
  };

  // Cancelar o formulário
  const handleCancel = () => {
    setShowForm(false);
    setCurrentSalao(null);
  };

  // Redirecionar para login se não estiver autenticado
  if (!authLoading && !user) {
    return <Navigate to="/login" />;
  }
  
  if (authLoading) {
    return <div className="loading-container">Carregando...</div>;
  }
  
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Gerenciamento de Salões de Beleza</h1>
        <button onClick={signOut} className="logout-button">Sair</button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="dashboard-content">
        {/* Formulário para adicionar/editar salão */}
        {showForm ? (
          <SalaoForm 
            record={currentSalao} 
            onSubmit={currentSalao ? handleUpdate : handleCreate}
            onCancel={handleCancel}
          />
        ) : (
          <>
            <div className="action-bar">
              <button onClick={() => setShowForm(true)} className="add-button">
                Adicionar Novo Salão
              </button>
            </div>

            {/* Tabela de salões */}
            {loading ? (
              <div className="loading">Carregando dados...</div>
            ) : saloes.length === 0 ? (
              <div className="empty-state">
                <p>Nenhum salão cadastrado. Clique em "Adicionar Novo Salão" para começar.</p>
              </div>
            ) : (
              <div className="table-container">
                <table className="saloes-table">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Endereço</th>
                      <th>Telefone</th>
                      <th>Email</th>
                      <th>Horário</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {saloes.map(salao => (
                      <tr key={salao.id}>
                        <td>{salao.nome}</td>
                        <td>{salao.endereco}</td>
                        <td>{salao.telefone}</td>
                        <td>{salao.email}</td>
                        <td>{salao.horario_funcionamento}</td>
                        <td className="actions">
                          <button 
                            onClick={() => handleEdit(salao)}
                            className="edit-button"
                          >
                            Editar
                          </button>
                          <button 
                            onClick={() => setConfirmDelete(salao.id)}
                            className="delete-button"
                          >
                            Excluir
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal de confirmação de exclusão */}
      {confirmDelete && (
        <div className="modal-backdrop">
          <div className="confirm-modal">
            <h3>Confirmar Exclusão</h3>
            <p>Tem certeza que deseja excluir este salão? Esta ação não pode ser desfeita.</p>
            <div className="modal-actions">
              <button 
                onClick={() => setConfirmDelete(null)}
                className="cancel-button"
              >
                Cancelar
              </button>
              <button 
                onClick={() => handleDelete(confirmDelete)}
                className="confirm-button"
              >
                Confirmar Exclusão
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
