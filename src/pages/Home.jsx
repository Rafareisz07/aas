import { Link } from 'react-router-dom';
import { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import './app.css';
import { Sidebar } from 'lucide-react';
import {  FaWhatsapp 
} from 'react-icons/fa'; 


const Home = () => {
    const [expandedService, setExpandedService] = useState(null);
    

    const services = [
        {
            id: 1,
            title: 'Contabilidade Completa',
            shortDescription: 'Gestão completa da sua contabilidade empresarial',
            fullDescription: 'Transforme a gestão do seu negócio com nossa assessoria integral. Cuidamos de todas as rotinas fiscais, tributárias e trabalhistas, garantindo total conformidade legal. Mais do que apenas burocracia, entregamos inteligência financeira e dados precisos para que você possa focar exclusivamente no crescimento da sua empresa com segurança.',
            benefits: [
                'Gestão fiscal completa',
                'Emissão de relatórios mensais',
                'Consultoria empresarial',
                'Auditoria contábil'
            ]
        },
        {
            id: 2,
            title: 'Consultoria Tributária',
            shortDescription: 'Otimização fiscal e planejamento tributário',
            fullDescription: 'Não deixe que a carga tributária sufoque o crescimento do seu negócio. Desenvolvemos um planejamento personalizado que alinha a legislação vigente aos seus objetivos comerciais. Analisamos cada detalhe da sua operação para garantir total compliance e aproveitar todos os benefícios fiscais disponíveis para o seu setor.',
            benefits: [
                'Planejamento tributário estratégico',
                'Redução legal de impostos',
                'Compliance fiscal',
                'Análise de créditos tributários'
            ]
        },
        {
            id: 3,
            title: 'Departamento Pessoal',
            shortDescription: 'Gestão de folha de pagamento e obrigações',
            fullDescription: 'Sua equipe é seu maior ativo; a burocracia é por nossa conta. Assegure que seus colaboradores recebam seus direitos corretamente e em dia, fortalecendo a confiança interna. Gerenciamos benefícios, férias e obrigações acessórias com rigor técnico, permitindo que você foque na gestão de talentos enquanto nós cuidamos da papelada.',
            benefits: [
                'Folha de pagamento completa',
                'Cálculos trabalhistas',
                'e-Social e obrigações acessórias',
                'Gestão de benefícios'
            ]
        },
    ];
    const handleScroll = (e, sectionId) => {
        e.preventDefault();
        const element = document.getElementById(sectionId);
        if (element) {
            const offset = element.offsetTop - 50;
            window.scrollTo({
                top: offset,
                behavior: 'smooth'
            });
        }
    };

    const toggleService = (serviceId) => {
        if (expandedService === serviceId) {
            setExpandedService(null);
        } else {
            setExpandedService(serviceId);
            // Scroll suave para a seção expandida
            setTimeout(() => {
                const element = document.getElementById(`service-details-${serviceId}`);
                if (element) {
                    const offset = element.offsetTop - 90;
                    window.scrollTo({
                        top: offset,
                        behavior: 'smooth'
                    });
                }
            }, 100);
        }
    };

    return (
        
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
            {/* Header com menu centralizado */}
            <header className="bg-white shadow-sm sticky top-0 z-50">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <div className="h-100 w-40 bg-white-600 rounded-lg flex items-center justify-center">
                                <img src="/logo192.png" alt="Logo AAS"/>
                            </div>
                            <span className="text-2xl font-bold text-gray-800">AAS Assessoria Contábil</span>
                        </div>

                        {/* Menu centralizado */}
                        <nav className="absolute left-1/2 transform -translate-x-1/2 hidden md:flex items-center space-x-8">
                            <a
                                href="#servicos"
                                onClick={(e) => handleScroll(e, 'servicos')}
                                className="text-gray-700 hover:text-blue-600 font-medium transition"
                            >
                                Serviços
                            </a>
                            <a
                                href="#sobre"
                                onClick={(e) => handleScroll(e, 'sobre')}
                                className="text-gray-700 hover:text-blue-600 font-medium transition"
                            >
                                Sobre
                            </a>
                            <a
                                href="#contato"
                                onClick={(e) => handleScroll(e, 'contato')}
                                className="text-gray-700 hover:text-blue-600 font-medium transition"
                            >
                                Contato
                            </a>
                        </nav>
                        <Link to="/login" class='botão'>
                            Acessar
                        </Link>
                    </div>
                </div>
            </header>

          <a 
            href="https://wa.me/5511999999999"
            target="_blank" 
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition z-50 flex items-center justify-center animate-bounce"
          >
            <FaWhatsapp size={28} />
          </a>

            {/* Hero Section */}
            <section className="flex-1 flex items-center justify-center py-20 px-4 bg-gradient-to-b from-white to-gray-200">
                <div className="max-w-6xl mx-auto w-full">
                    <div className="text-center">
                        <h1 className="text-5xl font-bold text-gray-900 mb-6">
                            Excelência Contábil com <span className="text-blue-600">Inovação</span>
                        </h1>
                        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                            Transformamos números em estratégias para o crescimento do seu negócio
                        </p>
                        <Link to="/login" class='botão'>
                            Acessar Dashboard
                        </Link>
                    </div>
                </div>
            </section>

            {/* Serviços - Cards Interativos */}
            <section id="servicos" className="py-16 bg-gray-200">
                <div className="max-w-6xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">Nossos Serviços</h2>
                    <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
                        Clique em qualquer serviço para ver detalhes completos e como podemos ajudar seu negócio
                    </p>

                    <div className="grid md:grid-cols-3 gap-8 mb-16">
                        {services.map(service => (
                            <div
                                key={service.id}
                                className={`p-6 border rounded-xl hover:shadow-lg transition-all cursor-pointer transform hover:-translate-y-1 ${expandedService === service.id ? 'border-blue-500 shadow-lg' : ''}`}
                                onClick={() => toggleService(service.id)}
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                                        <p className="text-gray-600">{service.shortDescription}</p>
                                    </div>
                                    <span className="text-blue-600">
                                        {expandedService === service.id ? <FaChevronUp /> : <FaChevronDown />}
                                    </span>
                                </div>
                                <div className="mt-4 pt-4 border-t">
                                    <span className="text-sm font-medium text-blue-600">Clique para {expandedService === service.id ? 'recolher' : 'expandir'} detalhes</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Área de Detalhes Expandidos */}
                    {expandedService && (
                        <div id={`service-details-${expandedService}`} className="mb-16 animate-fadeIn">
                            {services.filter(s => s.id === expandedService).map(service => (
                                <div key={service.id} className="bg-blue-50 rounded-2xl p-8 border border-blue-100">
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-800 mb-2">{service.title}</h3>
                                            <p className="text-blue-600 font-medium">{service.shortDescription}</p>
                                        </div>
                                        <button
                                            onClick={() => setExpandedService(null)}
                                            className="text-gray-500 hover:text-gray-700"
                                        >
                                            ✕ Fechar
                                        </button>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div>
                                            <h4 className="text-lg font-semibold mb-4">Descrição Completa</h4>
                                            <p className="text-gray-700 mb-6">{service.fullDescription}</p>

                                            <h4 className="text-lg font-semibold mb-4">Benefícios Principais</h4>
                                            <ul className="space-y-3">
                                                {service.benefits.map((benefit, index) => (
                                                    <li key={index} className="flex items-start">
                                                        <span className="text-green-500 mr-3">✓</span>
                                                        <span className="text-gray-700">{benefit}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div>
                                            <div className="bg-white p-6 rounded-xl mb-6">
                                                <h4 className="text-lg font-semibold mb-4">Como Funciona</h4>
                                                <div className="space-y-4">
                                                    <div className="flex items-start">
                                                        <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">
                                                            1
                                                        </div>
                                                        <p className="text-gray-700">Análise detalhada da situação atual da empresa</p>
                                                    </div>
                                                    <div className="flex items-start">
                                                        <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">
                                                            2
                                                        </div>
                                                        <p className="text-gray-700">Planejamento estratégico personalizado</p>
                                                    </div>
                                                    <div className="flex items-start">
                                                        <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">
                                                            3
                                                        </div>
                                                        <p className="text-gray-700">Implementação das soluções propostas</p>
                                                    </div>
                                                    <div className="flex items-start">
                                                        <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">
                                                            4
                                                        </div>
                                                        <p className="text-gray-700">Acompanhamento contínuo e otimização</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-blue-600 text-white p-6 rounded-xl">
                                                <h4 className="text-lg font-semibold mb-4">Pronto para Transformar?</h4>
                                                <p className="mb-4">Entre em contato para uma consultoria gratuita sobre este serviço</p>
                                                <button
                                                
                                                    href="#contato"
                                                    onClick={(e) => handleScroll(e, 'contato')}
                                                    className="bg-blue-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 inline-block transition"
                                                >
                                                <a>
                                                    Solicite um orçamento &rarr;
                                                </a>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Sobre (mantido igual) */}
            <section id="sobre" className="py-16 bg-gray-200">
                <div className="max-w-6xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">Sobre Nós</h2>
                    <div className="prose max-w-none">
                        <p className="text-lg text-gray-700 mb-6">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        </p>
                        <p className="text-lg text-gray-700 mb-6">
                            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </p>
                        <div className="grid md:grid-cols-2 gap-8 mt-8">
                            <div>
                                <h3 className="text-xl font-semibold mb-4">Missão</h3>
                                <p className="text-gray-600">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold mb-4">Visão</h3>
                                <p className="text-gray-600">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contato (mantido igual) */}
            <section id="contato" className="py-16 bg-gradient-to-b from-gray-200 to-white">
                <div className=" max-w-6xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">Contato</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-xl font-semibold mb-4">Entre em contato</h3>
                            <p className="text-gray-700 mb-6">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <span className="font-medium mr-2">Email:</span>
                                    <a href="mailto:atendimento@aascontabilidade.com" className="text-blue-600 hover:text-blue-800">
                                        atendimento@aascontabilidade.com
                                    </a>
                                </div>
                                <div className="flex items-center">
                                    <span className="font-medium mr-2">Telefone:</span>
                                    <a href="tel:+5511999999999" className="text-blue-600 hover:text-blue-800">
                                        (11) 99999-9999
                                    </a>
                                </div>
                                <div className="flex items-center">
                                    <span className="font-medium mr-2">Endereço:</span>
                                    <span className="text-gray-600">
                                       Rua 27 de Janeiro, 105 - Sala 5 - Osasco, SP
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold mb-4">Solicite um orçamento agora!</h3>
                            <form className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Seu nome"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="seu@email.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Mensagem</label>
                                    <textarea
                                        rows="4"
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Sua mensagem..."
                                    ></textarea>
                                </div>
                                <button type="submit" class='botão'>
                                    Enviar Mensagem
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer (mantido igual) */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-8">
                        <div>
                            <div className="flex items-center space-x-2 mb-4">
                                <div className="h-30 w-12 bg-white-600 rounded-lg flex items-center justify-center">
                                <img src="/logo192.png" alt="Logo AAS"/>
                                </div>
                                <span className="text-xl font-bold">AAS Acessoria Contábil</span>
                            </div>
                            <p className="text-gray-400 text-sm">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Links Rápidos</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#servicos" className="hover:text-white transition">Serviços</a></li>
                                <li><a href="#sobre" className="hover:text-white transition">Sobre</a></li>
                                <li><a href="#contato" className="hover:text-white transition">Contato</a></li>
                                <li><Link to="/login" className="hover:text-white transition">Acessar Dashboard</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Horário de Atendimento</h4>
                            <p className="text-gray-400 text-sm">
                                Segunda a Sexta: 8h às 18h<br />
                                Sábado: 8h às 12h<br />
                                Domingo: Fechado
                            </p>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-8 pt-8 text-center">
                        <p className="text-gray-400">&copy; 2025 AAS Contabilidade. Todos os direitos reservados.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;