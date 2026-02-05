import { Navigate } from 'react-router-dom';
import { auth } from '../FirebaseConfig'; // Usando a config do Item 2

const PrivateRoute = ({ children }) => {
  // Verifica se há usuário logado no Firebase
  const user = auth.currentUser;

  // Se não tiver user, manda pro login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;  
};

export default PrivateRoute;