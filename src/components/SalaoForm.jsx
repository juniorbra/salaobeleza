import { useState, useEffect } from 'react';
import './SalaoForm.css';

export default function SalaoForm({ record, onSubmit, onCancel }) {
  // Estado inicial do formulário
  const initialState = record || {
    id_servico: '',
    nome_descricao: '',
    categoria: '',
    duracao: '',
    preco: '',
    profissionais: ''
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
      <h2>{record ? 'Editar Serviço' : 'Novo Serviço'}</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="id_servico">ID do Serviço</label>
          <input
            type="text"
            id="id_servico"
            name="id_servico"
            value={formData.id_servico}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="nome_descricao">Nome/Descrição</label>
          <input
            type="text"
            id="nome_descricao"
            name="nome_descricao"
            value={formData.nome_descricao}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="categoria">Categoria</label>
          <input
            type="text"
            id="categoria"
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="duracao">Duração</label>
          <input
            type="text"
            id="duracao"
            name="duracao"
            value={formData.duracao}
            onChange={handleChange}
            required
            placeholder="Ex: 30 min"
          />
        </div>

        <div className="form-group">
          <label htmlFor="preco">Preço</label>
          <input
            type="text"
            id="preco"
            name="preco"
            value={formData.preco}
            onChange={handleChange}
            required
            placeholder="Ex: 50.00"
          />
        </div>

        <div className="form-group">
          <label htmlFor="profissionais">Profissionais</label>
          <textarea
            id="profissionais"
            name="profissionais"
            value={formData.profissionais}
            onChange={handleChange}
            rows="3"
            placeholder="Nomes dos profissionais que realizam este serviço"
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
