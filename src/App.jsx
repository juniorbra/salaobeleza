import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './lib/AuthContext';
import Login from './pages/Login';
import Registro from './pages/Registro';
import VerificacaoEmail from './pages/VerificacaoEmail';
import Dashboard from './pages/Dashboard';
import RotaProtegida from './components/RotaProtegida';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Rotas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/verificacao-email" element={<VerificacaoEmail />} />
          
          {/* Rotas protegidas */}
          <Route element={<RotaProtegida />}>
            <Route path="/dashboard" element={<Dashboard />} />
            {/* Adicione mais rotas protegidas aqui */}
          </Route>
          
          {/* Redirecionar para login se a rota não existir */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
