import { supabase } from './supabaseClient';

// Serviço para operações CRUD na tabela public.salaobeleza
export const salaoService = {
  // Buscar todos os registros
  getAll: async () => {
    const { data, error } = await supabase
      .from('salaobeleza')
      .select('*')
      .order('id', { ascending: true });
    
    if (error) throw error;
    return data;
  },
  
  // Buscar um registro pelo ID
  getById: async (id) => {
    const { data, error } = await supabase
      .from('salaobeleza')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  // Criar um novo registro
  create: async (record) => {
    const { data, error } = await supabase
      .from('salaobeleza')
      .insert([record])
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  // Atualizar um registro existente
  update: async (id, updates) => {
    const { data, error } = await supabase
      .from('salaobeleza')
      .update(updates)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  // Excluir um registro
  delete: async (id) => {
    const { error } = await supabase
      .from('salaobeleza')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
};
