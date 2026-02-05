import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../FirebaseConfig';
import { 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence
} from 'firebase/auth';
import toast, { Toaster } from 'react-hot-toast';
import { doc, setDoc, getDoc } from 'firebase/firestore';


const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleResetPassword = async () => {
    if (!email) {
      toast.error("Digite seu e-mail no campo acima primeiro!");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success(`E-mail de recuperação enviado para ${email}`);
    } catch (error) {
      console.error(error);
      if (error.code === 'auth/user-not-found') toast.error("E-mail não cadastrado.");
      else if (error.code === 'auth/invalid-email') toast.error("E-mail inválido.");
      else toast.error("Erro ao enviar e-mail.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    try {
      const persistenceType = rememberMe ? browserLocalPersistence : browserSessionPersistence;
      await setPersistence(auth, persistenceType);

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      


      // 2. BUSCA O PERFIL NA COLEÇÃO "USERS" (Correção Principal)
      // Usamos doc() e getDoc() porque já sabemos o ID (uid) e queremos 1 documento específico
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists() && userDocSnap.data().role === 'admin') {
        // É Admin -> Manda pro painel admin
              toast.success("Login realizado com sucesso!");
        setTimeout(() => navigate('/admin'), 1500);
      } else if (userDocSnap.exists() && userDocSnap.data().role === 'client') {
        // É Cliente  -> Manda pro dashboard normal
              toast.success("Login realizado com sucesso!");
        setTimeout(() => navigate('/dashboard'), 1500);
      }else {
        // Usuário sem perfil ou perfil inválido
        toast.error("Perfil de usuário inválido. Contate o suporte.");
      }
    } catch (error) {
      console.error("Erro Firebase:", error);
      if(error.code === 'auth/wrong-password') toast.error("Senha incorreta.");
      else if(error.code === 'auth/user-not-found') toast.error("Usuário não encontrado.");
      else if(error.code === 'auth/invalid-email') toast.error("Email inválido.");
      else toast.error("Erro ao conectar. Tente novamente.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Toaster position="top-center" /> 
      
      <div className="max-w-md w-full p-8 bg-white rounded-2xl shadow-lg">
        
        <div className="text-center mb-8">
          <div className="bg-white-600 rounded-lg flex items-center justify-center">
            <img src="/logo512.png" alt="Logo AAS" width='150' className='mb-6 mt-6 border border-blue-900 rounded-2xl p-4'/>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Acesse sua conta</h2>
          <p className="text-gray-600 mt-2">Entre para gerenciar sua contabilidade</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="seu@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center cursor-pointer">
              <input 
                id="remember-me"
                type="checkbox" 
                className="h-4 w-4 text-blue-600 rounded cursor-pointer" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="remember-me" className="ml-2 text-sm text-gray-600 cursor-pointer">Lembrar-me</label>
            </div>
            
            <button 
              type="button" 
              onClick={handleResetPassword}
              className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
            >
              Esqueci minha senha
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
          >
            Entrar
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-gray-500">
          Ainda não tem acesso? <br/>
          <a href="https://wa.me/5511967756625?text=Olá,%20ocorreu%20um%20erro%20no%20login%20do%20site" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-semibold hover:underline">
            Fale com nosso suporte no WhatsApp
          </a>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;