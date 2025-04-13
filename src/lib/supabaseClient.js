import { createClient } from '@supabase/supabase-js';

// Credenciais do Supabase
// Definindo valores fixos para garantir que funcionem em produção
const supabaseUrl = "https://ipjxqbnuaioaircxsuix.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlwanhxYm51YWlvYWlyY3hzdWl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1NTk3ODAsImV4cCI6MjA2MDEzNTc4MH0.7K7WXD_eOV4JULX20vpgVkNZUm_mHaA_gjfTwOnpU_g";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
