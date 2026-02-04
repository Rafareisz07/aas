import { Link } from 'react-router-dom';

const Header = () => {
  // Função de scroll suave mantida
  const handleScroll = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
           {/* Logo aqui */}
           <span className="text-2xl font-bold text-gray-800">AAS Contabilidade</span>
        </div>
        
        <nav className="hidden md:flex space-x-8">
          <button onClick={() => handleScroll('servicos')} className="text-gray-600 hover:text-blue-600">Serviços</button>
          <button onClick={() => handleScroll('sobre')} className="text-gray-600 hover:text-blue-600">Sobre</button>
          <button onClick={() => handleScroll('contato')} className="text-gray-600 hover:text-blue-600">Contato</button>
        </nav>

        {/* Item 10: Substituindo a classe .botão por Tailwind direto */}
        <Link to="/login" className="bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition">
          Acessar
        </Link>
      </div>
    </header>
  );
};
export default Header;