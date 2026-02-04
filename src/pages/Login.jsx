import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../FirebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import toast, { Toaster } from 'react-hot-toast'; // (Item 5 - Feedback Visual)

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Item 9 - Validação: Estado para confirmação de senha
  const [confirmPassword, setConfirmPassword] = useState(''); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // (Item 9 - Validação Simples)
    if (!isLogin && password !== confirmPassword) {
      toast.error("As senhas não coincidem!");
      return;
    }
    if (password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    try {
      if (isLogin) {
        // Login com Firebase (Item 2)
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("Login realizado com sucesso!");
        setTimeout(() => navigate('/dashboard'), 1500);
      } else {
        // Cadastro com Firebase (Item 2)
        await createUserWithEmailAndPassword(auth, email, password);
        toast.success("Conta criada! Bem-vindo.");
        setTimeout(() => navigate('/dashboard'), 1500);
      }
    } catch (error) {
      // (Item 5 - Feedback de Erro Real)
      console.error(error);
      if(error.code === 'auth/wrong-password') toast.error("Senha incorreta.");
      else if(error.code === 'auth/user-not-found') toast.error("Usuário não encontrado.");
      else if(error.code === 'auth/email-already-in-use') toast.error("Email já cadastrado.");
      else toast.error("Erro ao conectar. Tente novamente.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Toaster position="top-center" /> {/* Componente do Toast */}
      
      <div className="max-w-md w-full p-8 bg-white rounded-2xl shadow-lg">
        {/* ... (Cabeçalho igual) ... */}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Inputs de Email e Senha iguais ... */}
          
          {/* (Item 9 - Input de Confirmação apenas no Cadastro) */}
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirmar Senha</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg"
                required={!isLogin}
              />
            </div>
          )}

          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
            {isLogin ? 'Entrar' : 'Cadastrar'}
          </button>
        </form>
        {/* ... (Botão de alternar igual) ... */}
      </div>
    </div>
  );
};

export default AuthPage;