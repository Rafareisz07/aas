import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../FirebaseConfig'; // Importando auth (Item 2/8)
import { signOut } from 'firebase/auth';
import { FaChartLine, FaFileInvoice, FaUsers, FaBars, FaTimes } from 'react-icons/fa'; // Adicionei ícones de menu
import { FiLogOut } from 'react-icons/fi';

// Componentes internos para as abas (Item 1)
const Overview = () => <div className="p-6 bg-white rounded-xl shadow">Conteúdo da Visão Geral (Gráficos, Cards...)</div>;
const Documents = () => <div className="p-6 bg-white rounded-xl shadow">Lista de Documentos para Baixar</div>;
const Reports = () => <div className="p-6 bg-white rounded-xl shadow">Relatórios Financeiros</div>;

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // (Item 6 - Responsividade)
  
  // (Item 8 - Nome Dinâmico)
  const userEmail = auth.currentUser?.email || "Usuário";

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  // (Item 1 - Lógica de Renderização)
  const renderContent = () => {
    switch(activeTab) {
      case 'overview': return <Overview />;
      case 'documents': return <Documents />;
      case 'reports': return <Reports />;
      default: return <Overview />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 relative">
      
      {/* Botão Mobile (Item 6) */}
      <button 
        className="md:hidden absolute top-4 right-4 z-50 text-gray-600"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* Sidebar com classes responsivas (Item 6) */}
      <div className={`
        fixed md:relative z-40 w-64 h-full bg-white shadow-lg transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 border-b">
          <h2 className="font-bold text-lg text-blue-900">AAS Contabilidade</h2>
          <p className="text-xs text-gray-500 truncate">{userEmail}</p> {/* (Item 8) */}
        </div>

        <nav className="p-4 space-y-2">
          {/* Botões atualizam o estado activeTab (Item 1) */}
          {['overview', 'documents', 'reports'].map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setIsSidebarOpen(false); }}
              className={`w-full text-left px-4 py-3 rounded-lg capitalize ${activeTab === tab ? 'bg-blue-50 text-blue-600 font-bold' : 'hover:bg-gray-100 text-gray-600'}`}
            >
              {tab === 'overview' ? 'Visão Geral' : tab}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 w-64 p-4 border-t bg-white">
          <button onClick={handleLogout} className="flex items-center justify-center w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg">
            <FiLogOut className="mr-2" /> Sair
          </button>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="flex-1 p-8 pt-16 md:pt-8 overflow-y-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 capitalize">
            {activeTab === 'overview' ? 'Visão Geral' : activeTab}
          </h1>
        </header>
        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard;