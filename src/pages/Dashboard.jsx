import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChartLine, FaFileInvoice, FaUsers, FaMoneyBill } from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { title: 'Receita Mensal', value: 'R$ XX.XXX', change: '+12%', icon: <FaMoneyBill />, color: 'bg-green-500' },
    { title: 'Despesas', value: 'R$ XX.XXX', change: '-5%', icon: <FaChartLine />, color: 'bg-red-500' },
    { title: 'Impostos', value: 'R$ X.XXX', change: '+3%', icon: <FaFileInvoice />, color: 'bg-blue-500' },
    { title: 'Clientes Ativos', value: 'XX', change: '+8%', icon: <FaUsers />, color: 'bg-purple-500' },
  ];

  const documents = [
    { id: 1, name: 'DRE - Janeiro 2024', date: '15/01/2024', type: 'Relatório' },
    { id: 2, name: 'DARF - IRPJ', date: '10/01/2024', type: 'Imposto' },
    { id: 3, name: 'Folha de Pagamento', date: '05/01/2024', type: 'Folha' },
  ];

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="bg-white rounded-lg">
              <img src="/logo192.png" alt="Logo AAS" width="100"/>
            </div>
            <div>
              <h2 className="font-bold text-lg">AAS Contabilidade</h2>
              <p className="text-sm text-gray-500">Dashboard</p>
            </div>
          </div>
        </div>

        <nav className="p-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full text-left px-4 py-3 rounded-lg mb-2 ${activeTab === 'overview' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
          >
            📊 Visão Geral
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`w-full text-left px-4 py-3 rounded-lg mb-2 ${activeTab === 'documents' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
          >
            📑 Documentos
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`w-full text-left px-4 py-3 rounded-lg mb-2 ${activeTab === 'reports' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
          >
            📈 Relatórios
          </button>
          <button
            onClick={() => setActiveTab('clients')}
            className={`w-full text-left px-4 py-3 rounded-lg mb-2 ${activeTab === 'clients' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
          >
            👥 Clientes
          </button>
        </nav>

        <div className="absolute bottom-0 w-64 p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
          >
            <FiLogOut className="mr-2" /> Sair
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Bem-vindo de volta, João Silva</p>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm">{stat.title}</p>
                  <p className="text-2xl font-bold mt-2">{stat.value}</p>
                  <span className={`text-sm ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change}
                  </span>
                </div>
                <div className={`${stat.color} p-3 rounded-lg text-white`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts and Documents */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Chart */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-xl font-semibold mb-4">Receita vs Despesas (Últimos 6 meses)</h3>
            <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-4">📊</div>
                <p className="text-gray-500">Gráfico de Receita vs Despesas</p>
                <p className="text-sm text-gray-400">(Integre com Chart.js ou Recharts)</p>
              </div>
            </div>
          </div>

          {/* Recent Documents */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-xl font-semibold mb-4">Documentos Recentes</h3>
            <div className="space-y-4">
              {documents.map(doc => (
                <div key={doc.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">{doc.name}</p>
                    <p className="text-sm text-gray-500">{doc.date} • {doc.type}</p>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800 px-3 py-1 border border-blue-600 rounded hover:bg-blue-50">
                    Baixar
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="mt-8 bg-white p-6 rounded-xl shadow">
          <h3 className="text-xl font-semibold mb-4">Próximas Obrigações</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-yellow-50 rounded">
              <div>
                <p className="font-medium">DARF - IRPJ</p>
                <p className="text-sm text-gray-500">Vencimento: 20/02/2024</p>
              </div>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                Em 5 dias
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded">
              <div>
                <p className="font-medium">Declaração DCTF</p>
                <p className="text-sm text-gray-500">Vencimento: 10/03/2024</p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                Em 24 dias
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;