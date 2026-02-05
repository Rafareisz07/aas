import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db, storage, firebaseConfig } from '../FirebaseConfig'; // Importando a config
import { signOut, updateProfile, createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app'; // Para o truque do cadastro
import { 
  collection, getDocs, addDoc, setDoc, doc, query, where, serverTimestamp, orderBy 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { 
  FaUsers, FaFileInvoice, FaSignOutAlt, FaSearch, FaCloudUploadAlt, FaSpinner, FaTrash, FaUserPlus, FaTimes 
} from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientDocs, setClientDocs] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estados para o Modal de Cadastro
  const [showModal, setShowModal] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');
  const [newClientPass, setNewClientPass] = useState('');
  const [creatingClient, setCreatingClient] = useState(false);

  // 1. Buscar todos os clientes
  const fetchClients = async () => {
    const querySnapshot = await getDocs(collection(db, "users"));
    const clientsList = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })).filter(user => user.role !== 'admin');
    setClients(clientsList);
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // 2. Buscar documentos quando seleciona um cliente
  useEffect(() => {
    if (!selectedClient) return;
    const fetchDocs = async () => {
      const q = query(
        collection(db, "documents"), 
        where("uid", "==", selectedClient.uid),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      setClientDocs(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchDocs();
  }, [selectedClient, uploading]);

  // 3. Cadastrar Novo Cliente (O TRUQUE NINJA 🥷)
  const handleCreateClient = async (e) => {
    e.preventDefault();
    if(newClientPass.length < 6) return toast.error("Senha deve ter min. 6 caracteres");

    setCreatingClient(true);
    
    // Criamos uma "Segunda App" do Firebase só para criar o usuário
    // Se usássemos a auth principal, o Admin seria deslogado!
    const secondaryApp = initializeApp(firebaseConfig, "Secondary");
    const secondaryAuth = getAuth(secondaryApp);

    try {
      // 1. Cria o usuário na Auth Secundária
      const userCredential = await createUserWithEmailAndPassword(secondaryAuth, newClientEmail, newClientPass);
      const newUser = userCredential.user;

      // 2. Atualiza o Nome
      await updateProfile(newUser, { displayName: newClientName });

      // 3. Salva no Banco de Dados (Firestore) usando a conexão principal 'db'
      await setDoc(doc(db, "users", newUser.uid), {
        uid: newUser.uid,
        name: newClientName,
        email: newClientEmail,
        role: "client",
        createdAt: new Date().toISOString()
      });

      // 4. Limpeza
      await signOut(secondaryAuth); // Desloga da secundária
      toast.success("Cliente cadastrado com sucesso!");
      
      // Fecha Modal e Atualiza Lista
      setShowModal(false);
      setNewClientName(''); setNewClientEmail(''); setNewClientPass('');
      fetchClients(); // Recarrega a lista lateral

    } catch (error) {
      console.error(error);
      if(error.code === 'auth/email-already-in-use') toast.error("Email já cadastrado.");
      else toast.error("Erro ao criar cliente.");
    } finally {
      setCreatingClient(false);
    }
  };

  // 4. Upload Admin -> Cliente
  const handleAdminUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !selectedClient) return;

    setUploading(true);
    const toastId = toast.loading(`Enviando para ${selectedClient.name}...`);

    try {
      const storageRef = ref(storage, `uploads/${selectedClient.uid}/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      await addDoc(collection(db, "documents"), {
        uid: selectedClient.uid,
        userName: selectedClient.name,
        name: file.name,
        date: new Date().toLocaleDateString('pt-BR'),
        size: (file.size / 1024).toFixed(1) + ' KB',
        type: 'Enviado pelo Contador',
        url: url,
        createdAt: serverTimestamp()
      });

      toast.success("Arquivo enviado!", { id: toastId });
      setUploading(false);
    } catch (error) {
      console.error(error);
      toast.error("Erro no envio.", { id: toastId });
      setUploading(false);
    }
  };

  const filteredClients = clients.filter(c => 
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-100 relative">
      <Toaster />
      
      {/* --- SIDEBAR --- */}
      <div className="w-64 bg-blue-900 text-white flex flex-col">
        <div className="p-6 font-bold text-xl border-b border-blue-800">AAS Admin</div>
        
        {/* Botão Novo Cliente */}
        <div className="p-4 pb-0">
          <button 
            onClick={() => setShowModal(true)}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded flex items-center justify-center font-semibold transition"
          >
            <FaUserPlus className="mr-2" /> Novo Cliente
          </button>
        </div>

        <div className="flex-1 p-4">
          <div className="mb-4 mt-4">
            <div className="flex items-center bg-blue-800 rounded px-3 py-2">
              <FaSearch className="text-blue-400 mr-2" />
              <input 
                type="text" 
                placeholder="Buscar..." 
                className="bg-transparent text-sm w-full outline-none text-white placeholder-blue-400"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-1 overflow-y-auto max-h-[60vh]">
            {filteredClients.map(client => (
              <button
                key={client.id}
                onClick={() => setSelectedClient(client)}
                className={`w-full text-left px-3 py-2 rounded text-sm truncate transition
                  ${selectedClient?.id === client.id ? 'bg-blue-600 font-bold shadow' : 'hover:bg-blue-800 text-blue-100'}`}
              >
                {client.name}
              </button>
            ))}
          </div>
        </div>
        <button 
          onClick={() => { signOut(auth); navigate('/'); }}
          className="p-4 bg-blue-950 hover:bg-black text-red-300 flex items-center justify-center transition"
        >
          <FaSignOutAlt className="mr-2" /> Sair
        </button>
      </div>

      {/* --- ÁREA PRINCIPAL --- */}
      <div className="flex-1 p-8 overflow-y-auto">
        {!selectedClient ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <FaUsers size={64} className="mb-4 opacity-20" />
            <h2 className="text-2xl font-bold text-gray-600">Selecione um cliente ao lado</h2>
            <p>Ou cadastre um novo cliente para começar.</p>
          </div>
        ) : (
          <div className="animate-fadeIn">
            <header className="flex justify-between items-center mb-8 border-b pb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">{selectedClient.name}</h1>
                <p className="text-gray-500">{selectedClient.email}</p>
              </div>
              <div className="bg-blue-100 text-blue-800 px-4 py-1 rounded-full text-sm font-semibold">
                Cliente Ativo
              </div>
            </header>

            {/* Upload Admin */}
            <div className="mb-8">
              <h3 className="font-bold text-gray-700 mb-4">Enviar Documento para {selectedClient.name}</h3>
              <div className={`border-2 border-dashed border-blue-300 bg-blue-50 rounded-xl p-6 text-center transition relative ${uploading ? 'opacity-50' : 'hover:bg-blue-100'}`}>
                <input 
                  type="file" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleAdminUpload}
                  disabled={uploading}
                />
                {uploading ? (
                  <span className="flex items-center justify-center text-blue-600 font-medium">
                    <FaSpinner className="animate-spin mr-2" /> Enviando...
                  </span>
                ) : (
                  <span className="flex items-center justify-center text-blue-600 font-medium">
                    <FaCloudUploadAlt className="mr-2" size={20} /> Clique para enviar arquivo para o cliente
                  </span>
                )}
              </div>
            </div>

            {/* Lista Documentos */}
            <div className="bg-white rounded-xl shadow">
              <div className="p-4 border-b font-bold text-gray-700 flex justify-between">
                <span>Arquivos do Cliente</span>
                <span className="text-gray-400 text-sm">{clientDocs.length} arquivos</span>
              </div>
              <ul>
                {clientDocs.length === 0 ? (
                  <li className="p-6 text-center text-gray-400">Pasta vazia.</li>
                ) : (
                  clientDocs.map(doc => (
                    <li key={doc.id} className="p-4 border-b last:border-b-0 hover:bg-gray-50 flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`p-2 rounded mr-3 ${doc.type === 'Enviado pelo Contador' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                          <FaFileInvoice />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{doc.name}</p>
                          <p className="text-xs text-gray-500">
                            {doc.date} • {doc.size} • <span className="font-semibold">{doc.type}</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm px-3 py-1 border rounded">Baixar</a>
                        <button className="text-red-400 hover:text-red-600 p-2"><FaTrash /></button>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* --- MODAL DE CADASTRO --- */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md relative">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <FaTimes size={20} />
            </button>
            
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Novo Cliente</h2>
            
            <form onSubmit={handleCreateClient} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Empresa/Cliente</label>
                <input 
                  type="text" 
                  className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none" 
                  placeholder="Ex: Padaria do João"
                  value={newClientName} onChange={e => setNewClientName(e.target.value)} required 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email de Acesso</label>
                <input 
                  type="email" 
                  className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none" 
                  placeholder="cliente@email.com"
                  value={newClientEmail} onChange={e => setNewClientEmail(e.target.value)} required 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Senha Provisória</label>
                <input 
                  type="text" 
                  className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none" 
                  placeholder="Mínimo 6 dígitos"
                  value={newClientPass} onChange={e => setNewClientPass(e.target.value)} required 
                />
              </div>

              <button 
                type="submit" 
                disabled={creatingClient}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded transition flex justify-center items-center"
              >
                {creatingClient ? <FaSpinner className="animate-spin" /> : "Cadastrar Cliente"}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;