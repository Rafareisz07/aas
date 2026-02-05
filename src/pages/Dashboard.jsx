import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../FirebaseConfig'; // Importando o DB
import { signOut } from 'firebase/auth';
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore'; // Importações do Banco de Dados
import {
  FaChartLine, FaFileInvoice, FaUsers, FaBars, FaTimes,
  FaMoneyBill, FaCloudUploadAlt, FaWhatsapp, FaDownload, FaTrash
} from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';

// --- COMPONENTE 1: VISÃO GERAL (Mantive estático por enquanto, foco nos Docs) ---
const Overview = () => {
  const stats = [
    { title: 'Receita Mensal', value: 'R$ 45.200', change: '+12%', icon: <FaMoneyBill />, color: 'bg-green-500' },
    { title: 'Despesas', value: 'R$ 12.350', change: '-5%', icon: <FaChartLine />, color: 'bg-red-500' },
    { title: 'Impostos', value: 'R$ 3.800', change: '+3%', icon: <FaFileInvoice />, color: 'bg-blue-500' },
    { title: 'Lucro Líquido', value: 'R$ 29.050', change: '+15%', icon: <FaUsers />, color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm">{stat.title}</p>
                <p className="text-2xl font-bold mt-2 text-gray-800">{stat.value}</p>
                <span className={`text-xs font-semibold ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change} vs mês anterior
                </span>
              </div>
              <div className={`${stat.color} p-3 rounded-lg text-white shadow-lg`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- COMPONENTE 2: DOCUMENTOS (AGORA REAL!) ---
const Documents = () => {
  const [docs, setDocs] = useState([]);
  const user = auth.currentUser;

  // 1. Efeito para BUSCAR (Ler) dados do Banco em Tempo Real
  useEffect(() => {
    if (!user) return;

    // Cria uma "query" buscando documentos apenas desse usuário
    const q = query(collection(db, "documents"), where("uid", "==", user.uid));
    // O onSnapshot fica "ouvindo" o banco. Se algo mudar lá, atualiza aqui na hora.
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const documentsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setDocs(documentsList);
    });

    return () => unsubscribe();
  }, [user]);

  // 2. Função para SALVAR (Upload Simulado) no Banco
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      // Aqui estamos salvando apenas o REGISTRO do arquivo
      // Para salvar o PDF real, precisaríamos do Firebase Storage (passo avançado)
      await addDoc(collection(db, "documents"), {
        uid: user.uid, // Importante: Salva QUEM é o dono
        name: file.name,
        date: new Date().toLocaleDateString('pt-BR'),
        size: (file.size / 1024).toFixed(1) + ' KB',
        type: 'Enviado pelo Cliente',
        createdAt: serverTimestamp()
      });
      toast.success("Documento enviado com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar:", error);
      toast.error("Erro ao enviar documento.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Área de Upload Funcional */}
      <div className="bg-blue-50 border-2 border-blue-200 border-dashed rounded-xl p-8 text-center hover:bg-blue-100 transition cursor-pointer group relative">
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleFileUpload}
        />
        <FaCloudUploadAlt size={48} className="mx-auto text-blue-400 group-hover:text-blue-600 mb-3" />
        <h3 className="font-semibold text-blue-900">Clique para enviar um documento</h3>
        <p className="text-sm text-blue-600">Selecione um PDF ou Imagem do seu computador</p>
      </div>

      {/* Lista de Documentos Real */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <h3 className="font-bold text-gray-800">Documentos Recentes ({docs.length})</h3>
        </div>
        <ul>
          {docs.length === 0 ? (
            <li className="p-8 text-center text-gray-500">Nenhum documento encontrado. Envie o primeiro acima!</li>
          ) : (
            docs.map((doc) => (
              <li key={doc.id} className="flex items-center justify-between p-4 border-b last:border-b-0 hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div className="bg-red-100 p-2 rounded text-red-600">
                    <FaFileInvoice />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{doc.name}</p>
                    <p className="text-xs text-gray-500">{doc.date} • {doc.size} • {doc.type}</p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-red-600 transition" title="Excluir (Simulação)">
                  <FaTrash />
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

const Reports = () => (
  <div className="bg-white p-8 rounded-xl shadow-sm text-center">
    <div className="inline-block p-4 bg-purple-100 text-purple-600 rounded-full mb-4">
      <FaChartLine size={32} />
    </div>
    <h2 className="text-xl font-bold text-gray-800 mb-2">Relatórios Gerenciais</h2>
    <p className="text-gray-500 mb-6">Em breve: gráficos reais gerados via PDF.</p>
  </div>
);

// --- DASHBOARD PRINCIPAL (IGUAL ANTES, SÓ ADICIONEI O TOASTER) ---
const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const userName = auth.currentUser?.displayName || auth.currentUser?.email || "Visitante";

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return <Overview />;
      case 'documents': return <Documents />; // <--- Esse agora é o componente REAL
      case 'reports': return <Reports />;
      default: return <Overview />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 relative">
      <Toaster position="top-right" /> {/* Notificações */}

      {/* ... (Botão Whatsapp e Sidebar iguais ao anterior) ... */}
      <a
        href="https://wa.me/5511999999999"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition z-50 flex items-center justify-center animate-bounce"
      >
        <FaWhatsapp size={28} />
      </a>

      <button
        className="md:hidden absolute top-4 right-4 z-50 text-gray-600 bg-white p-2 rounded-md shadow"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      <div className={`
        fixed md:relative z-40 w-64 h-full bg-white shadow-xl transition-transform duration-300 ease-in-out flex flex-col justify-between
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div>
          <div className="p-6 border-b">
            {/* 1. Criei uma div container com 'flex' e 'items-center' */}
            <div className="flex items-center gap-3 mb-6">
              <img src="./logo192.png" alt="AAS Contábil Logo" className="w-10 h-auto" />

              {/* 2. Removi a margem inferior (mb-4) do H2 para o alinhamento ficar perfeito */}
              <h2 className="font-bold text-xl text-blue-900">
                AAS Contábil
              </h2>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500 font-semibold uppercase">Olá,</p>
              <p className="text-sm text-blue-800 font-bold truncate">{userName}</p>
            </div>
          </div>
          <nav className="p-4 space-y-2">
            {[
              { id: 'overview', label: 'Visão Geral', icon: <FaChartLine /> },
              { id: 'documents', label: 'Documentos', icon: <FaFileInvoice /> },
              { id: 'reports', label: 'Relatórios', icon: <FaUsers /> },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
                className={`w-full flex items-center space-x-3 text-left px-4 py-3 rounded-lg transition
                  ${activeTab === item.id ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
        <div className="p-4 border-t bg-gray-50">
          <button onClick={handleLogout} className="flex items-center justify-center w-full px-4 py-2 text-red-600 hover:bg-red-100 rounded-lg transition font-medium">
            <FiLogOut className="mr-2" /> Sair
          </button>
        </div>
      </div>

      <div className="flex-1 h-screen overflow-y-auto p-4 md:p-8 pt-16 md:pt-8">
        <header className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 capitalize">
            {activeTab === 'overview' ? 'Visão Geral' : activeTab === 'documents' ? 'Documentos' : 'Relatórios'}
          </h1>
        </header>
        <div className="animate-fadeIn">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;