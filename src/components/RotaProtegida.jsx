import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';

export default function RotaProtegida() {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="loading-container">Carregando...</div>;
  }
  
  // Se não estiver autenticado, redireciona para a página de login
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  // Se estiver autenticado, renderiza o conteúdo da rota
  return <Outlet />;
}
