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
  const [profissionaisList, setProfissionaisList] = useState([]);

  // Atualizar o formulário se o registro mudar
  useEffect(() => {
    if (record) {
      setFormData(record);
      
      // Converter a string de profissionais para o formato de lista
      if (record.profissionais) {
        try {
          // Tenta extrair os profissionais do formato JSON
          const profArray = parseProfissionais(record.profissionais);
          setProfissionaisList(profArray);
        } catch (err) {
          console.error("Erro ao processar profissionais:", err);
          // Fallback: Divide a string por vírgulas se não for possível parsear
          setProfissionaisList([{ id: '', nome: record.profissionais }]);
        }
      } else {
        setProfissionaisList([{ id: '', nome: '' }]);
      }
    } else {
      setProfissionaisList([{ id: '', nome: '' }]);
    }
  }, [record]);

  // Função para extrair profissionais do formato JSON ou string
  const parseProfissionais = (profString) => {
    // Se for uma string vazia, retorna um array vazio
    if (!profString) return [{ id: '', nome: '' }];
    
    // Verifica se é uma string que contém objetos JSON
    if (profString.includes('"id":') || profString.includes("'id':")) {
      try {
        // Tenta converter para objeto JavaScript
        const cleanString = profString.replace(/'/g, '"');
        return JSON.parse(cleanString);
      } catch (e) {
        // Se falhar, tenta extrair usando regex
        const profArray = [];
        const regex = /\{.*?'id':\s*'(.*?)'.*?'nome':\s*'(.*?)'.*?\}/g;
        let match;
        
        while ((match = regex.exec(profString)) !== null) {
          profArray.push({ id: match[1], nome: match[2] });
        }
        
        if (profArray.length > 0) {
          return profArray;
        }
      }
    }
    
    // Se não conseguir extrair como JSON, divide por vírgula
    const nomes = profString.split(',').map(nome => nome.trim());
    return nomes.map((nome, index) => ({ id: `${index + 1}`, nome }));
  };

  // Lidar com mudanças nos campos do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Lidar com mudanças nos campos de profissionais
  const handleProfissionalChange = (index, field, value) => {
    const updatedProfissionais = [...profissionaisList];
    updatedProfissionais[index][field] = value;
    setProfissionaisList(updatedProfissionais);
    
    // Atualiza o formData com a nova string de profissionais
    const profissionaisString = formatProfissionaisToString(updatedProfissionais);
    setFormData(prev => ({
      ...prev,
      profissionais: profissionaisString
    }));
  };

  // Formatar a lista de profissionais para string no formato esperado pelo backend
  const formatProfissionaisToString = (profList) => {
    // Filtra profissionais sem nome
    const validProfs = profList.filter(prof => prof.nome.trim() !== '');
    
    if (validProfs.length === 0) return '';
    
    // Formata como uma lista de objetos em string
    return validProfs.map(prof => 
      `{'id': '${prof.id}', 'nome': '${prof.nome}'}`
    ).join(', ');
  };

  // Adicionar novo profissional
  const addProfissional = () => {
    setProfissionaisList([...profissionaisList, { id: '', nome: '' }]);
  };

  // Remover profissional
  const removeProfissional = (index) => {
    if (profissionaisList.length > 1) {
      const updatedProfissionais = [...profissionaisList];
      updatedProfissionais.splice(index, 1);
      setProfissionaisList(updatedProfissionais);
      
      // Atualiza o formData com a nova string de profissionais
      const profissionaisString = formatProfissionaisToString(updatedProfissionais);
      setFormData(prev => ({
        ...prev,
        profissionais: profissionaisString
      }));
    }
  };

  // Enviar o formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Formata os profissionais antes de enviar
      const dataToSubmit = {
        ...formData,
        profissionais: formatProfissionaisToString(profissionaisList)
      };
      
      await onSubmit(dataToSubmit);
      // Resetar o formulário após o envio bem-sucedido
      if (!record) {
        setFormData(initialState);
        setProfissionaisList([{ id: '', nome: '' }]);
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
          <label>Profissionais</label>
          <div className="profissionais-container">
            {profissionaisList.map((prof, index) => (
              <div key={index} className="profissional-item">
                <input
                  type="text"
                  className="id-input"
                  placeholder="ID"
                  value={prof.id}
                  onChange={(e) => handleProfissionalChange(index, 'id', e.target.value)}
                />
                <input
                  type="text"
                  className="nome-input"
                  placeholder="Nome do profissional"
                  value={prof.nome}
                  onChange={(e) => handleProfissionalChange(index, 'nome', e.target.value)}
                />
                <button 
                  type="button" 
                  className="remove-profissional-btn"
                  onClick={() => removeProfissional(index)}
                  disabled={profissionaisList.length === 1}
                >
                  -
                </button>
              </div>
            ))}
            <button 
              type="button" 
              className="add-profissional-btn"
              onClick={addProfissional}
            >
              +
            </button>
          </div>
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
