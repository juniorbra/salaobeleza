import { supabase } from './supabaseClient';

// Serviço para operações CRUD na tabela public.salaobeleza (serviços do salão)
export const salaoService = {
  // Buscar todos os serviços
  getAll: async () => {
    const { data, error } = await supabase
      .from('salaobeleza')
      .select('*')
      .order('id', { ascending: true });
    
    if (error) throw error;
    return data;
  },
  
  // Buscar um serviço pelo ID
  getById: async (id) => {
    const { data, error } = await supabase
      .from('salaobeleza')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  // Criar um novo serviço
  create: async (servico) => {
    const { data, error } = await supabase
      .from('salaobeleza')
      .insert([servico])
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  // Atualizar um serviço existente
  update: async (id, updates) => {
    const { data, error } = await supabase
      .from('salaobeleza')
      .update(updates)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  // Excluir um serviço
  delete: async (id) => {
    const { error } = await supabase
      .from('salaobeleza')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
};
