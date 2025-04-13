import { useState, useEffect } from 'react';
import './SalaoForm.css';

export default function SalaoForm({ record, onSubmit, onCancel }) {
  // Estado inicial do formulário
  const initialState = record || {
    nome: '',
    endereco: '',
    telefone: '',
    email: '',
    horario_funcionamento: '',
    servicos_oferecidos: ''
  };

  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Atualizar o formulário se o registro mudar
  useEffect(() => {
    if (record) {
      setFormData(record);
    }
  }, [record]);

  // Lidar com mudanças nos campos do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Enviar o formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSubmit(formData);
      // Resetar o formulário após o envio bem-sucedido
      if (!record) {
        setFormData(initialState);
      }
    } catch (err) {
      setError(err.message || 'Ocorreu um erro ao salvar os dados.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="salao-form">
      <h2>{record ? 'Editar Salão' : 'Novo Salão'}</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nome">Nome</label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="endereco">Endereço</label>
          <input
            type="text"
            id="endereco"
            name="endereco"
            value={formData.endereco}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="telefone">Telefone</label>
          <input
            type="text"
            id="telefone"
            name="telefone"
            value={formData.telefone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="horario_funcionamento">Horário de Funcionamento</label>
          <input
            type="text"
            id="horario_funcionamento"
            name="horario_funcionamento"
            value={formData.horario_funcionamento}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="servicos_oferecidos">Serviços Oferecidos</label>
          <textarea
            id="servicos_oferecidos"
            name="servicos_oferecidos"
            value={formData.servicos_oferecidos}
            onChange={handleChange}
            rows="4"
          />
        </div>

        <div className="form-actions">
          <button type="button" onClick={onCancel} disabled={loading}>
            Cancelar
          </button>
          <button type="submit" disabled={loading}>
            {loading ? 'Salvando...' : record ? 'Atualizar' : 'Salvar'}
          </button>
        </div>
      </form>
    </div>
  );
}
