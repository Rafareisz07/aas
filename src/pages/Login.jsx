import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
  // Estado para controlar se é Login ou Cadastro
  const [isLogin, setIsLogin] = useState(true);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // 1. Lógica de CADASTRO
    if (!isLogin) {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      const userExists = users.find(u => u.email === email);
      if (userExists) {
        alert('Este e-mail já está cadastrado!');
        return;
      }

      const newUser = { name, email, password };
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      alert('Cadastro realizado com sucesso! Faça login.');
      setIsLogin(true); // Volta para a tela de login
      return;
    }

    // 2. Lógica de LOGIN
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      // Salva a sessão do usuário atual
      localStorage.setItem('currentUser', JSON.stringify(user));
      navigate('/dashboard');
    } else {
      alert('E-mail ou senha incorretos!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-2xl shadow-lg">
        <div className="text-center mb-8">
          <div className="bg-white-600 rounded-lg flex items-center justify-center">
             {/* Mantive sua logo e estilização */}
            <img src="/logo512.png" alt="Logo AAS" width='150' className='mb-10 mt-10 border border-blue-900 rounded-2xl p-8'/>
          </div>
          
          {/* Título dinâmico */}
          <h2 className="text-3xl font-bold text-gray-900">
            {isLogin ? 'Acesse sua conta' : 'Crie sua conta'}
          </h2>
          <p className="text-gray-600 mt-2">
            {isLogin ? 'Entre para gerenciar sua contabilidade' : 'Preencha os dados abaixo'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Campo Nome (Aparece apenas no Cadastro) */}
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome Completo
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Seu nome"
                required={!isLogin}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="seu@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
              required
            />
          </div>

          {/* Opções extras apenas no Login */}
          {isLogin && (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input type="checkbox" className="h-4 w-4 text-blue-600" />
                <label className="ml-2 text-sm text-gray-600">Lembrar-me</label>
              </div>
              <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
                Esqueci minha senha
              </a>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            {isLogin ? 'Entrar' : 'Cadastrar'}
          </button>
        </form>

        {/* Botão para alternar entre Login e Cadastro */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            {isLogin ? 'Não tem uma conta? ' : 'Já tem uma conta? '}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 font-semibold hover:text-blue-800 transition"
            >
              {isLogin ? 'Cadastre-se' : 'Fazer Login'}
            </button>
          </p>
        </div>

      </div>
    </div>
  );
};

export default AuthPage;