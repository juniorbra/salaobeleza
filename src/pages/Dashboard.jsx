import { useAuth } from '../lib/AuthContext';
import { Navigate } from 'react-router-dom';

export default function Dashboard() {
  const { user, signOut, loading } = useAuth();
  
  // Redirecionar para login se não estiver autenticado
  if (!loading && !user) {
    return <Navigate to="/login" />;
  }
  
  if (loading) {
    return <div>Carregando...</div>;
  }
  
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Bem-vindo ao Salão Beleza</h1>
        <button onClick={signOut} className="logout-button">Sair</button>
      </div>
      <div className="dashboard-content">
        <div className="user-info">
          <h2>Informações do Usuário</h2>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>ID:</strong> {user.id}</p>
          <p><strong>Último login:</strong> {new Date(user.last_sign_in_at).toLocaleString()}</p>
        </div>
        
        {/* Aqui você pode adicionar mais conteúdo específico do seu salão de beleza */}
        <div className="dashboard-cards">
          <div className="card">
            <h3>Agendamentos</h3>
            <p>Gerencie seus agendamentos</p>
          </div>
          <div className="card">
            <h3>Clientes</h3>
            <p>Gerencie seus clientes</p>
          </div>
          <div className="card">
            <h3>Serviços</h3>
            <p>Gerencie seus serviços</p>
          </div>
        </div>
      </div>
    </div>
  );
}
