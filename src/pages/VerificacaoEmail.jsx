import { Link } from 'react-router-dom';

export default function VerificacaoEmail() {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Verifique seu Email</h2>
        <p>
          Enviamos um link de confirmação para o seu email. 
          Por favor, verifique sua caixa de entrada e clique no link para ativar sua conta.
        </p>
        <p>
          Depois de verificar seu email, você poderá <Link to="/login">fazer login</Link>.
        </p>
      </div>
    </div>
  );
}
