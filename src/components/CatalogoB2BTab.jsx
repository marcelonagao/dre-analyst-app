import React, { useState, useEffect } from 'react';

// --- IMPORTAÇÕES DO FIREBASE ---
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, signInWithCustomToken } from 'firebase/auth';
import { getFirestore, collection, onSnapshot, addDoc, doc, updateDoc } from 'firebase/firestore';

// --- COMPONENTES NATIVOS DE ÍCONES EM SVG ---
const ShoppingCartIcon = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" />
    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
  </svg>
);

const LogOutIcon = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const ArrowLeftIcon = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
  </svg>
);

const CheckCircleIcon = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const CreditCardIcon = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" />
  </svg>
);

const QrCodeIcon = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
  </svg>
);

const FileTextIcon = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
  </svg>
);

const SearchIcon = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const SparklesIcon = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
  </svg>
);

const PlusIcon = ({ size = 20, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const MinusIcon = ({ size = 20, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const CloseIcon = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const ClipboardIcon = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
  </svg>
);

const TargetIcon = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
  </svg>
);

const AlertCircleIcon = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const ShieldIcon = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const BriefcaseIcon = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

const UsersIcon = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const ListIcon = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="8" y1="6" x2="21" y2="6"></line>
    <line x1="8" y1="12" x2="21" y2="12"></line>
    <line x1="8" y1="18" x2="21" y2="18"></line>
    <line x1="3" y1="6" x2="3.01" y2="6"></line>
    <line x1="3" y1="12" x2="3.01" y2="12"></line>
    <line x1="3" y1="18" x2="3.01" y2="18"></line>
  </svg>
);

// ============================================================================
// CONFIGURAÇÕES DO FIREBASE
// ============================================================================
const customConfig = {
  apiKey: "AIzaSyDlAEHAeBpfvXtmiitPNHTPtzeZDYzVuqA",
  authDomain: "gkl-distribuidora.firebaseapp.com",
  projectId: "gkl-distribuidora",
  storageBucket: "gkl-distribuidora.firebasestorage.app",
  messagingSenderId: "791567747101",
  appId: "1:791567747101:web:e59cecf699c8715e30def4"
};

const rawAppId = typeof window !== 'undefined' && window.__app_id ? window.__app_id : 'gkl-distribuidora';
const appId = rawAppId.split('/')[0];

const firebaseConfig = typeof window !== 'undefined' && window.__firebase_config ? JSON.parse(window.__firebase_config) : customConfig;
const isFirebaseConfigured = firebaseConfig.apiKey && firebaseConfig.apiKey !== "SUA_API_KEY";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const PRODUCTS_FALLBACK = [
  { id: 1, name: 'Produto Falso - Erro API', category: 'Erro', price: 0.00, stock: 0, image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=400' }
];

const MOCK_USERS = {
  // Troquei o nif da Teste Ltda por um CNPJ matematicamente válido
  b2b_approved: { id: 'u2', name: 'Teste Ltda', isB2B: true, creditLimit: 5000.00, status: 'aprovado', nif: '45997418000153' },
  b2b_novato: { id: 'u3', name: 'Nova Loja (Novo)', isB2B: true, creditLimit: 0.00, status: 'pendente', nif: '98765432000199' },
  rep: { id: 'rep_1', name: 'Carlos Vendedor', isRep: true },
  admin: { id: 'admin', name: 'Gestor GKL', isAdmin: true }
};

const formatPrice = (value) => {
  const num = Number(value);
  return isNaN(num) ? '0.00' : num.toFixed(2);
};

export default function CatalogoB2BTab({ onRoleChange }) {
  const [currentScreen, setCurrentScreen] = useState('login'); 
  const [currentUser, setCurrentUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalQuantity, setModalQuantity] = useState(1);
  const [myOrders, setMyOrders] = useState([]);
  // Adicione estes estados junto com os que você já tem:
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [temMaisProdutos, setTemMaisProdutos] = useState(true);
  const [carregandoMais, setCarregandoMais] = useState(false);

// 🌟 CONTROLE DE TELA (3 Níveis de Navegação)
const [catalogView, setCatalogView] = useState('home'); // 'home' | 'departamento' | 'lista'

// ============================================================================
  // 🌟 ESTADOS PARA GESTÃO DA VITRINE (Modais e Uploads)
  // ============================================================================
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null); // Guarda o ID se for edição, ou null se for novo

  // Dados do formulário de Banner
  const [formBannerName, setFormBannerName] = useState('');
  const [formBannerImageFile, setFormBannerImageFile] = useState(null);
  const [formBannerPreview, setFormBannerPreview] = useState(null);


// 🌟 O "MAPA DO SUPERMERCADO" (Futuramente vira dinâmico do Supabase)
const mapaCategorias = [
  {
    id: 'beleza',
    nome: 'Beleza & Cosméticos',
    icone: '💄',
    cor: 'bg-pink-50 text-pink-600 border-pink-100',
    marcas: [
      { nome: 'Dermachem', busca: 'Dermachem' },
      { nome: 'Face Beautiful', busca: 'Face Beautiful' },
      { nome: 'Porán', busca: 'Poran' },
      { nome: 'Skincare (Geral)', busca: 'Skincare' }
    ]
  },
  {
    id: 'ferramentas',
    nome: 'Ferramentas & Casa',
    icone: '🛠️',
    cor: 'bg-orange-50 text-orange-600 border-orange-100',
    marcas: [
      { nome: 'Tramontina', busca: 'Tramontina' },
      { nome: 'Action', busca: 'Action' },
      { nome: 'Kala', busca: 'Kala' }
    ]
  },
  {
    id: 'brinquedos',
    nome: 'Brinquedos & Kids',
    icone: '🧸',
    cor: 'bg-blue-50 text-blue-600 border-blue-100',
    marcas: [
      { nome: 'Baby Club', busca: 'Baby' },
      { nome: 'Geral', busca: 'Brinquedo' }
    ]
  }
];

// Controle do Carrossel de Banners
const [currentBanner, setCurrentBanner] = useState(0);
const bannersPromocionais = [
  { id: 1, imagem: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=1200&h=400', alt: 'Make Week' },
  { id: 2, imagem: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=1200&h=400', alt: 'Semana de Ofertas' }
];

// Motor do Banner
useEffect(() => {
  if (catalogView !== 'home') return;
  const timer = setInterval(() => setCurrentBanner((prev) => (prev + 1) % bannersPromocionais.length), 4000);
  return () => clearInterval(timer);
}, [catalogView]);

const marcasDestaque = ['DERMACHEM', 'FACE BEAUTIFUL', 'AIFER', 'ACTION'];

  // Estado para armazenar o cliente que o Representante está a atender
  const [selectedClientForRep, setSelectedClientForRep] = useState(null);

  // Estados de Abas para Painéis de Gestão
  const [adminTab, setAdminTab] = useState('clientes');
  const [repTab, setRepTab] = useState('clientes');

  const [activeAuthTab, setActiveAuthTab] = useState('login');
  const [authEmail, setAuthFormEmail] = useState('');
  const [authPassword, setAuthFormPassword] = useState('');
  const [authName, setAuthFormName] = useState(''); 
  const [authNIF, setAuthFormNif] = useState('');   

  const [firebaseUser, setFirebaseUser] = useState(null);
  const [dbProducts, setDbProducts] = useState([]);
  const [dbClients, setDbClients] = useState([]);
  
  // 🌟 NOVO: Estado para sabermos se o Bling está carregando
  const [loadingCatalog, setLoadingCatalog] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Dados do formulário de Departamento
  const [formDeptName, setFormDeptName] = useState('');
  const [formDeptIcon, setFormDeptIcon] = useState(''); 

  // 🌟 COMUNICAÇÃO COM O APP.JSX (Esconder/Mostrar Menu Lateral)
  useEffect(() => {
    if (onRoleChange) {
      // Se não tem ninguém logado ou é cliente B2B comum -> Modo B2B (Sem menu)
      if (!currentUser || currentUser.isB2B) {
        onRoleChange('b2b');
      } 
      // Se for Admin ou Representante -> Modo Gestão (Com menu)
      else if (currentUser.isAdmin || currentUser.isRep) {
        onRoleChange('admin');
      }
    }
  }, [currentUser, onRoleChange]);


  useEffect(() => {
    if (!isFirebaseConfigured) {
      setDbProducts(PRODUCTS_FALLBACK);
      return;
    }

    const initAuth = async () => {
      try {
        if (typeof window !== 'undefined' && window.__initial_auth_token) {
          try {
            await signInWithCustomToken(auth, window.__initial_auth_token);
            return;
          } catch (tokenError) {
            console.warn("Falha no login por token customizado, tentando login anônimo de fallback:", tokenError);
          }
        }
        await signInAnonymously(auth);
      } catch (error) {
        console.error("Erro na autenticação do Firebase:", error);
      }
    };
    initAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
    });
    return () => unsubscribe();
  }, []);

    // ============================================================================
  // 🚀 MOTOR DE BUSCA COM PAGINAÇÃO E FILTRO
  // ============================================================================
  const buscarProdutos = async (pagina = 1, termoDeBusca = selectedCategory) => {
    if (!firebaseUser && !currentUser) return;

    if (pagina === 1) {
      setLoadingCatalog(true);
      setDbProducts([]); // Limpa a tela ao trocar de categoria
    } else {
      setCarregandoMais(true);
    }

    try {
      const query = termoDeBusca !== 'Todas' ? termoDeBusca : searchQuery;
      const res = await fetch(`/api/catalogo-b2b?pagina=${pagina}&busca=${encodeURIComponent(query)}`);
      const data = await res.json();
      
      if (data.success) {
        const produtosAdaptados = data.produtos.map((p) => {
          const partesNome = p.nome.split('-');
          const categoriaDerivada = partesNome.length > 1 ? partesNome[0].trim() : 'Geral';
          const horaAtual = new Date().getHours();
          
          return {
            id: p.sku, 
            blingId: p.id, 
            name: p.nome, 
            category: categoriaDerivada,
            price: Number(p.preco), 
            stock: 999, 
            image: p.imagemUrl + `?v=${horaAtual}`, 
            description: `SKU: ${p.sku} | Distribuição Oficial GKL.`
          };
        });
        
        // Empilha (se for pg > 1) ou Substitui (se for pg 1)
        if (pagina === 1) setDbProducts(produtosAdaptados);
        else setDbProducts(prev => [...prev, ...produtosAdaptados]);
        
        setTemMaisProdutos(data.temMais);
        setPaginaAtual(pagina);
      }
    } catch (error) {
      console.error("Erro ao buscar:", error);
    } finally {
      setLoadingCatalog(false);
      setCarregandoMais(false);
    }
  };

  // ============================================================================
  // 🌟 NOVO: CONTROLE DE NAVEGAÇÃO DA VITRINE
  // ============================================================================
  // ============================================================================
  // 🌟 MOTOR DE NAVEGAÇÃO (3 NÍVEIS)
  // ============================================================================
  
   // Nível 2 para 3: Clicou na Marca (ex: Dermachem)
  const abrirMarca = (termo) => {
    setSearchQuery(termo);
    setSelectedCategory(termo);
    setCatalogView('lista');
    buscarProdutos(1, termo); // Agora sim chama o Bling!
    window.scrollTo(0, 0);
  };

  const voltarParaHome = () => {
    setCatalogView('home');
    setSearchQuery('');
    buscarProdutos(1, 'Todas'); // 🌟 MÁGICA: Em vez de esvaziar, ele puxa os destaques!
  };

  const voltarParaDepartamento = () => {
    setCatalogView('departamento');
    setSearchQuery('');
    setDbProducts([]);
  };

  // Dispara busca automatica ao mudar a categoria, mas APENAS se estiver na visão de lista
  useEffect(() => {
    if (firebaseUser) {
      buscarProdutos(1, 'Todas');
    }
  }, [firebaseUser, currentUser]);

  useEffect(() => {
    if (!isFirebaseConfigured || !firebaseUser) return;
    
    const clientsPath = typeof window !== 'undefined' && window.__app_id 
      ? collection(db, 'artifacts', appId, 'public', 'data', 'clientes')
      : collection(db, 'clientes'); 
      
    const unsubscribe = onSnapshot(clientsPath, (snapshot) => {
      const fetchedClients = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDbClients(fetchedClients);
    }, (error) => {
      console.error("Aviso do Firestore (clientes):", error);
    });
    
    return () => unsubscribe();
  }, [firebaseUser]);

  useEffect(() => {
    if (currentUser && !currentUser.isAdmin && !currentUser.isRep && currentUser.id.startsWith('db_')) {
      const updatedUser = dbClients.find(c => c.id === currentUser.id);
      if (updatedUser && (updatedUser.status !== currentUser.status || updatedUser.creditLimit !== currentUser.creditLimit)) {
        setCurrentUser(updatedUser);
      }
    }
  }, [dbClients, currentUser]);

  useEffect(() => {
    if (!isFirebaseConfigured || !firebaseUser || !currentUser) return;

    const orderPath = typeof window !== 'undefined' && window.__app_id
      ? collection(db, 'artifacts', appId, 'public', 'data', 'pedidos')
      : collection(db, 'pedidos');

    const unsubscribe = onSnapshot(orderPath, (snapshot) => {
      let fetchedOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      if (currentUser.isAdmin) {
        // Admin vê todos os pedidos
      } else if (currentUser.isRep) {
        if (selectedClientForRep) {
          fetchedOrders = fetchedOrders.filter((o) => o.clienteId === selectedClientForRep.id);
        } else {
          fetchedOrders = fetchedOrders.filter((o) => o.vendedorId === currentUser.id);
        }
      } else {
        const clientId = currentUser.id || firebaseUser.uid;
        fetchedOrders = fetchedOrders.filter((o) => o.clienteId === clientId);
      }

      fetchedOrders.sort((a, b) => {
        return new Date(b.dataCriacao || 0).getTime() - new Date(a.dataCriacao || 0).getTime();
      });
      setMyOrders(fetchedOrders);
    }, (error) => {
      console.error("Aviso do Firestore (pedidos):", error);
    });

    return () => unsubscribe();
  }, [firebaseUser, currentUser, selectedClientForRep]);

  const addToCart = (product, quantity = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevCart, { ...product, quantity }];
    });

    // 🌟 NOVO: Feedback Visual (UX)
    setToastMessage(`✔️ ${quantity}x ${product.name.split('-')[0]} adicionado!`);
    setTimeout(() => setToastMessage(null), 2500); // Some depois de 2.5 segundos
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter(item => item.id !== productId));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (Number(item.price || 0) * item.quantity), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogin = (userType) => {
    setCurrentUser(MOCK_USERS[userType]);
    if (userType === 'admin') {
      setAdminTab('clientes');
      setCurrentScreen('admin');
    } else if (userType === 'rep') {
      setRepTab('clientes');
      setCurrentScreen('rep_dashboard');
    } else {
      setCurrentScreen('catalog');
    }
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    if (activeAuthTab === 'register') {
      if (!authName || !authEmail || !authPassword || !authNIF) {
        alert("Por favor, preencha todos os campos para efetuar o registo.");
        return;
      }
      
      const newUser = {
        name: authName,
        email: authEmail,
        isB2B: true, 
        creditLimit: 0.00,
        status: 'pendente',
        nif: authNIF,
        dataCriacao: new Date().toISOString()
      };

      if (isFirebaseConfigured && firebaseUser) {
        try {
          const clientsPath = typeof window !== 'undefined' && window.__app_id 
            ? collection(db, 'artifacts', appId, 'public', 'data', 'clientes')
            : collection(db, 'clientes');
          
          const docRef = await addDoc(clientsPath, newUser);
          setCurrentUser({ id: `db_${docRef.id}`, ...newUser });
          alert(`Cadastro criado com sucesso! Faça 3 compras à vista para desbloquear o Boleto Faturado ou aguarde aprovação.`);
          setCurrentScreen('catalog');
        } catch (error) {
          console.error("Erro ao registrar cliente no Firebase:", error);
          alert("Erro ao criar cadastro. Tente novamente.");
        }
      } else {
        setCurrentUser({ id: 'u_local', ...newUser });
        alert(`Cadastro criado (Localmente).`);
        setCurrentScreen('catalog');
      }

    } else {
      if (!authEmail || !authPassword) {
        alert("Por favor, introduza o seu Email e Palavra-passe.");
        return;
      }

      const foundClient = dbClients.find(c => c.email.toLowerCase() === authEmail.toLowerCase());
      
      if (foundClient) {
        setCurrentUser({ id: `db_${foundClient.id}`, ...foundClient });
        setCurrentScreen('catalog');
      } else {
        const isNovato = authEmail.includes('novo');
        const loggedUser = {
          id: 'u_logged',
          name: isNovato ? 'Loja Nova (Sem histórico)' : 'Lojista Aprovado',
          email: authEmail,
          isB2B: true,
          creditLimit: isNovato ? 0.00 : 5000.00,
          status: isNovato ? 'pendente' : 'aprovado'
        };
        setCurrentUser(loggedUser);
        setCurrentScreen('catalog');
      }
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCart([]);
    setSelectedCategory('Todas');
    setSelectedProduct(null);
    setSelectedClientForRep(null);
    setAuthFormEmail('');
    setAuthFormPassword('');
    setAuthFormName('');
    setAuthFormNif('');
    setCurrentScreen('login');
  };

  const handleFinalizeOrder = async (paymentMethod) => {
    if (!isFirebaseConfigured) {
      alert("Modo de Simulação: Configure o Firebase.");
      return;
    }

    if (!firebaseUser) {
       alert("Aguarde a conexão com o banco de dados e tente novamente.");
       return;
    }

    try {
      // 1. DADOS DO CLIENTE (Firebase)
      const targetClient = currentUser.isRep ? selectedClientForRep : currentUser;
      const targetClientId = targetClient?.id || firebaseUser.uid;

      // 2. AÇÃO A: INJETAR NO BLING (Via Vercel)
      const itensBling = cart.map(item => ({
        sku: item.id, 
        id: item.blingId, 
        nome: item.name,
        quantidade: item.quantity,
        preco: item.price
      }));

      // Dispara para a nuvem enviando também os dados do cliente!
      const resBling = await fetch('/api/create-order-b2b', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          itens: itensBling,
          clienteCnpj: targetClient?.nif,  // Envia o CNPJ salvo no Firebase
          clienteNome: targetClient?.name  // Envia o Nome salvo no Firebase
        })
      });
      const dataBling = await resBling.json();

      if (!dataBling.success) {
        alert(`❌ Erro retornado pelo Bling: ${dataBling.error}`);
        return; // Interrompe o processo e não salva no Firebase se o Bling recusar!
      }

      // 3. AÇÃO B: SALVAR NO FIREBASE (Para histórico do app)
      try {
        const orderPath = typeof window !== 'undefined' && window.__app_id
          ? collection(db, 'artifacts', appId, 'public', 'data', 'pedidos')
          : collection(db, 'pedidos');

        await addDoc(orderPath, {
          clienteId: targetClientId,
          clienteNome: targetClient?.name || 'Cliente GKL',
          isB2B: targetClient?.isB2B || false,
          vendedorId: currentUser.isRep ? currentUser.id : null,     
          vendedorNome: currentUser.isRep ? currentUser.name : null, 
          itens: cart,
          total: cartTotal,
          metodoPagamento: paymentMethod,
          status: 'Integrado ao Bling',
          blingPedidoId: dataBling.pedidoBlingId || 'N/A',
          dataCriacao: new Date().toISOString()
        });
      } catch (firebaseError) {
        console.warn("⚠️ Pedido salvo no Bling, mas Firebase bloqueou o histórico:", firebaseError);
        // Não damos alert() aqui para não travar a tela de sucesso do usuário
      }

      // 4. SUCESSO! Limpa o carrinho e avança de tela
      setCart([]); 
      setCurrentScreen('success');

    } catch (error) {
      console.error("Erro ao guardar pedido:", error);
      alert("❌ Falha de comunicação ao finalizar pedido. Tente novamente.");
    }
  };

  const handleApproveCredit = async (clientId) => {
    if (!isFirebaseConfigured) {
      alert("Simulação: Cliente aprovado localmente.");
      return;
    }
    try {
      const clientDocRef = typeof window !== 'undefined' && window.__app_id
        ? doc(db, 'artifacts', appId, 'public', 'data', 'clientes', clientId)
        : doc(db, 'clientes', clientId);

      await updateDoc(clientDocRef, {
        status: 'aprovado',
        creditLimit: 5000.00,
        vendedorId: 'rep_1',
        vendedorNome: 'Carlos Vendedor'
      });
      alert("Crédito de R$ 5.000,00 aprovado e cliente atribuído ao representante!");
    } catch (error) {
      console.error("Erro ao aprovar crédito:", error);
      alert("Erro ao aprovar cliente. Verifique as permissões.");
    }
  };

  const openProductDetails = (product) => {
    setSelectedProduct(product);
    setModalQuantity(1);
  };

  const renderLogin = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F4F9F8] p-6">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-[#8ECAC5]/25">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-[#E8F3F2] text-[#8ECAC5] rounded-full flex items-center justify-center mx-auto mb-3">
            <SparklesIcon size={32} />
          </div>
          <h1 className="text-3xl font-extrabold text-[#8ECAC5] tracking-wide">GKL BRASIL</h1>
          <p className="text-[#698F8A] font-bold tracking-widest uppercase text-xs mb-1">Distribuidora</p>
          <p className="text-[#8ECAC5] text-sm font-semibold bg-[#E8F3F2] inline-block px-3 py-1 rounded-full">Acesso Exclusivo B2B</p>
        </div>

        <div className="flex bg-[#F4F9F8] rounded-xl p-1 mb-6 border border-[#E8F3F2]">
          <button
            onClick={() => setActiveAuthTab('login')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeAuthTab === 'login'
                ? 'bg-[#4A6B64] text-white shadow-sm'
                : 'text-[#698F8A] hover:text-[#4A6B64]'
            }`}
          >
            Entrar
          </button>
          <button
            onClick={() => setActiveAuthTab('register')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeAuthTab === 'register'
                ? 'bg-[#4A6B64] text-white shadow-sm'
                : 'text-[#698F8A] hover:text-[#4A6B64]'
            }`}
          >
            Criar Cadastro CNPJ
          </button>
        </div>

        <form onSubmit={handleAuthSubmit} className="space-y-4">
          {activeAuthTab === 'register' && (
            <>
              <div>
                <label className="block text-xs font-bold text-[#4A6B64] uppercase mb-1">Razão Social / Nome Fantasia</label>
                <input
                  type="text"
                  placeholder="Nome da sua loja ou empresa"
                  value={authName}
                  onChange={(e) => setAuthFormName(e.target.value)}
                  className="w-full bg-[#F4F9F8] text-[#4A6B64] border border-[#E8F3F2] rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-[#8ECAC5] transition"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A6B64] uppercase mb-1">CNPJ</label>
                <input
                  type="text"
                  placeholder="00.000.000/0000-00"
                  value={authNIF}
                  onChange={(e) => setAuthFormNif(e.target.value)}
                  className="w-full bg-[#F4F9F8] text-[#4A6B64] border border-[#E8F3F2] rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-[#8ECAC5] transition"
                  required
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-[#4A6B64] uppercase mb-1">Endereço de Email (Comercial)</label>
            <input
              type="email"
              placeholder="contato@sualoja.com"
              value={authEmail}
              onChange={(e) => setAuthFormEmail(e.target.value)}
              className="w-full bg-[#F4F9F8] text-[#4A6B64] border border-[#E8F3F2] rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-[#8ECAC5] transition"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#4A6B64] uppercase mb-1">Palavra-passe</label>
            <input
              type="password"
              placeholder="••••••••"
              value={authPassword}
              onChange={(e) => setAuthFormPassword(e.target.value)}
              className="w-full bg-[#F4F9F8] text-[#4A6B64] border border-[#E8F3F2] rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-[#8ECAC5] transition"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#4A6B64] hover:bg-[#3A5A53] text-white py-3.5 rounded-xl font-bold transition shadow-md mt-4 active:scale-95"
          >
            {activeAuthTab === 'register' ? 'Criar Conta' : 'Acessar Catálogo'}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#E8F3F2]"></div></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-3 text-[#698F8A] font-bold">Acesso para Testes</span></div>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={() => handleLogin('b2b_approved')}
            className="w-full flex items-center justify-center gap-1.5 bg-[#F4F9F8] hover:bg-[#E8F3F2] text-[#8ECAC5] py-2.5 px-4 rounded-xl text-xs font-bold border border-[#8ECAC5]/30 transition"
          >
            <FileTextIcon size={14} /> Entrar com Lojista Antigo (Crédito Aprovado)
          </button>
          
          <button
            onClick={() => handleLogin('b2b_novato')}
            className="w-full flex items-center justify-center gap-1.5 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 py-2.5 px-4 rounded-xl text-xs font-bold border border-yellow-200 transition"
          >
            <AlertCircleIcon size={14} /> Entrar como Loja Nova (Progresso 0/3)
          </button>

          <button
            onClick={() => handleLogin('rep')}
            className="w-full flex items-center justify-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 py-2.5 px-4 rounded-xl text-xs font-bold border border-indigo-200 transition"
          >
            <BriefcaseIcon size={14} /> Entrar como Representante (Nova Venda)
          </button>

          <button
            onClick={() => handleLogin('admin')}
            className="w-full flex items-center justify-center gap-1.5 bg-gray-800 hover:bg-gray-900 text-white py-2.5 px-4 rounded-xl text-xs font-bold border border-gray-700 transition mt-2 shadow-sm"
          >
            <ShieldIcon size={14} /> Acesso Painel Gestor (Aprovar Clientes)
          </button>
        </div>
      </div>
    </div>
  );

  const renderRepDashboard = () => {
    const myClients = dbClients.filter(c => c.vendedorId === currentUser.id || !c.vendedorId);
    
    const filteredClients = myClients.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.nif.includes(searchQuery)
    );

    return (
      <div className="max-w-5xl mx-auto px-4 py-8 pb-24">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-extrabold text-[#4A6B64] flex items-center gap-3">
              <BriefcaseIcon size={32} />
              Portal do Representante
            </h2>
            <p className="text-[#698F8A] mt-1">Gerencie a sua carteira e acompanhe as suas vendas.</p>
          </div>
        </div>

        <div className="flex bg-[#F4F9F8] rounded-xl p-1 mb-8 border border-[#E8F3F2] max-w-md">
          <button
            onClick={() => setRepTab('clientes')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${
              repTab === 'clientes' ? 'bg-[#4A6B64] text-white shadow-sm' : 'text-[#698F8A] hover:text-[#4A6B64]'
            }`}
          >
            <UsersIcon size={16} /> Carteira de Clientes
          </button>
          <button
            onClick={() => setRepTab('pedidos')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${
              repTab === 'pedidos' ? 'bg-[#4A6B64] text-white shadow-sm' : 'text-[#698F8A] hover:text-[#4A6B64]'
            }`}
          >
            <ListIcon size={16} /> Meus Pedidos ({myOrders.length})
          </button>
        </div>

        {repTab === 'clientes' && (
          <>
            <div className="bg-white p-4 shadow-sm rounded-2xl mb-6 border border-[#8ECAC5]/20">
              <div className="relative w-full">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-[#698F8A]" size={20} />
                <input 
                  type="text" 
                  placeholder="Pesquisar na sua carteira..." 
                  className="w-full bg-[#F4F9F8] text-[#4A6B64] rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-[#8ECAC5] transition border border-transparent focus:border-[#8ECAC5]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {myClients.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl shadow-sm text-center border border-[#E8F3F2]">
                <UsersIcon size={48} className="mx-auto text-[#8ECAC5]/50 mb-4" />
                <p className="text-[#698F8A]">Nenhum cliente atribuído à sua carteira.</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {filteredClients.map(client => (
                  <div key={client.id} className="bg-white p-6 rounded-2xl shadow-sm border border-[#E8F3F2] hover:border-[#8ECAC5] transition-all group">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-bold text-lg text-[#4A6B64] group-hover:text-[#8ECAC5] transition-colors">{client.name}</h4>
                        <span className="text-sm text-[#698F8A] block">CNPJ: {client.nif}</span>
                      </div>
                      {client.status === 'aprovado' || client.creditLimit > 0 ? (
                        <span className="bg-[#E8F3F2] text-[#4A6B64] text-xs font-extrabold px-3 py-1 rounded-full">Crédito Aprovado</span>
                      ) : (
                        <span className="bg-yellow-50 text-yellow-700 border border-yellow-200 text-xs font-extrabold px-3 py-1 rounded-full">À Vista (PIX/Cartão)</span>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-end mt-4 pt-4 border-t border-[#F4F9F8]">
                      <div>
                        <span className="text-xs text-[#698F8A] block">Limite Disponível</span>
                        <span className="font-bold text-[#8ECAC5]">R$ {formatPrice(client.creditLimit)}</span>
                      </div>
                      <button 
                        onClick={() => {
                          setSelectedClientForRep(client);
                          setCurrentScreen('catalog');
                        }}
                        className="bg-[#4A6B64] hover:bg-[#3A5A53] text-white px-5 py-2.5 rounded-xl font-bold shadow-sm transition-all active:scale-95 text-sm"
                      >
                        Iniciar Pedido
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {repTab === 'pedidos' && (
          <div className="space-y-4">
            {myOrders.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl shadow-sm text-center border border-[#E8F3F2]">
                <ClipboardIcon size={48} className="mx-auto text-[#8ECAC5]/50 mb-4" />
                <p className="text-[#698F8A]">Nenhum pedido efetuado pelos seus clientes.</p>
              </div>
            ) : (
              myOrders.map((order) => (
                <div key={order.id} className="bg-white rounded-2xl shadow-sm p-6 border border-[#E8F3F2]">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#F4F9F8] pb-4 mb-4 gap-2">
                    <div>
                      <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block">Cliente</span>
                      <span className="text-base text-[#4A6B64] font-bold">{order.clienteNome}</span>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#698F8A] uppercase tracking-wider block text-left sm:text-right">Data</span>
                      <span className="text-sm text-[#4A6B64]">
                        {order.dataCriacao ? new Date(order.dataCriacao).toLocaleDateString('pt-PT') : 'Sem data'}
                      </span>
                    </div>
                    <div>
                      <span className="inline-block bg-[#E8F3F2] text-[#4A6B64] text-xs font-extrabold px-3 py-1 rounded-full">
                        {order.status || 'Autorizado'}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-xs text-[#698F8A] block">ID do Pedido</span>
                      <span className="text-xs font-mono text-[#4A6B64] font-bold">{order.id}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-[#698F8A] block">Total</span>
                      <span className="text-xl font-black text-[#8ECAC5]">R$ {formatPrice(order.total)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    );
  };

  const renderCatalog = () => {
    // 🌟 TELA DE CARREGAMENTO ANIMADA
    if (loadingCatalog) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] pb-24">
          <div className="w-16 h-16 border-4 border-[#E8F3F2] border-t-[#8ECAC5] rounded-full animate-spin mb-6 shadow-sm"></div>
          <h2 className="text-xl font-bold text-[#4A6B64] animate-pulse">Sincronizando com o ERP...</h2>
          <p className="text-[#698F8A] text-sm mt-2">Buscando catálogo e preços atualizados no Bling</p>
        </div>
      );
    }

    const uniqueCategories = ['Todas', ...Array.from(new Set(dbProducts.map(p => p.category).filter(Boolean)))];

    const filteredProducts = dbProducts.filter(p => {
      const nameMatch = p.name ? p.name.toLowerCase().includes(searchQuery.toLowerCase()) : false;
      const categorySearchMatch = p.category ? p.category.toLowerCase().includes(searchQuery.toLowerCase()) : false;
      const textMatch = nameMatch || categorySearchMatch;
      const categoryFilterMatch = selectedCategory === 'Todas' || p.category === selectedCategory;
      return textMatch && categoryFilterMatch;
    });

    const targetClient = currentUser?.isRep ? selectedClientForRep : currentUser;

    const targetOrders = 3;
    const currentOrders = myOrders.length;
    const remainingOrders = Math.max(0, targetOrders - currentOrders);
    const progressPercent = Math.min(100, (currentOrders / targetOrders) * 100);
    const hasReachedTarget = currentOrders >= targetOrders;
    const isApproved = targetClient?.creditLimit > 0;

    return (
      <div className="pb-24 min-h-screen bg-[#F4F9F8]">
        {/* Barra de Progresso Inteligente */}
        {!isApproved && targetClient && !currentUser.isAdmin && (
          <div className={`p-4 border-b ${hasReachedTarget ? 'bg-[#E8F3F2] border-[#8ECAC5]' : 'bg-yellow-50 border-yellow-200'}`}>
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center gap-3 mb-2">
                {hasReachedTarget ? <CheckCircleIcon size={20} className="text-[#4A6B64]" /> : <TargetIcon size={20} className="text-yellow-700" />}
                <p className={`text-sm font-bold ${hasReachedTarget ? 'text-[#4A6B64]' : 'text-yellow-800'}`}>
                  {hasReachedTarget 
                    ? "Meta atingida! O seu CNPJ encontra-se em análise de crédito." 
                    : `Faltam ${remainingOrders} compra${remainingOrders > 1 ? 's' : ''} à vista para solicitar limite faturado.`}
                </p>
              </div>
              
              {!hasReachedTarget && (
                <div className="w-full bg-yellow-200/50 rounded-full h-2.5 mt-2">
                  <div 
                    className="bg-yellow-500 h-2.5 rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================= */}
        {/* MODO 1: HOME (Vitrine Completa) */}
        {/* ========================================= */}
        {catalogView === 'home' && (
          <div className="max-w-6xl mx-auto px-2 sm:px-4 mt-4 sm:mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* AS BOLINHAS ORIGINAIS DO CARROSSEL */}
            <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
                {bannersPromocionais.map((_, index) => (
                  <button key={index} onClick={() => setCurrentBanner(index)} className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 shadow-sm ${index === currentBanner ? 'bg-white w-5 sm:w-8' : 'bg-white/70 w-1.5 sm:w-2 hover:bg-white'}`}></button>
                ))}
              </div>

            {/* 🌟 MÁGICA: SESSÃO DE PRODUTOS EM DESTAQUE NA HOME! */}
            {dbProducts.length > 0 && (
              <div className="mb-10">
                <div className="flex items-center gap-2 mb-4">
                  <SparklesIcon size={24} className="text-[#8ECAC5]" />
                  <h3 className="text-xl sm:text-2xl font-black text-[#4A6B64]">Destaques para o seu Negócio</h3>
                </div>
                
                {/* Aqui nós reaproveitamos os cartões lindos que você já tem, mas mostramos só os 10 primeiros! */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                  {dbProducts.slice(0, 10).map(product => (
                    <div key={product.id} onClick={() => openProductDetails(product)} className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col border border-gray-100 hover:shadow-md transition-all duration-300 cursor-pointer group">
                      
                      <div className="h-40 relative p-3 flex justify-center items-center bg-white border-b border-gray-50">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" 
                          onError={(e) => { e.target.onerror = null; e.target.src = product.blingImage || 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=400'; }}
                        />
                      </div>
                      
                      <div className="p-3 flex-1 flex flex-col">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{product.category}</span>
                        <h3 className="text-xs font-semibold text-[#4A6B64] line-clamp-2 leading-tight mb-2 group-hover:text-[#8ECAC5] transition-colors">{product.name}</h3>
                        <div className="mt-auto flex justify-between items-end">
                          <span className="text-base font-black text-[#4A6B64]">R$ {formatPrice(product.price)}</span>
                          <button onClick={(e) => { e.stopPropagation(); addToCart(product, 1); }} className="w-8 h-8 flex items-center justify-center bg-[#F4F9F8] text-[#8ECAC5] rounded-full hover:bg-[#8ECAC5] hover:text-white transition-colors">
                            <PlusIcon size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Botão para ir para a lista completa */}
                <div className="flex justify-center mt-6">
                  <button onClick={() => abrirMarca('Todas')} className="text-sm font-bold text-[#8ECAC5] hover:text-[#4A6B64] transition-colors border border-[#8ECAC5] hover:border-[#4A6B64] rounded-full px-6 py-2">
                    Ver todos os produtos
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================= */}
        {/* MODO 2: LISTA DE PRODUTOS */}
        {/* ========================================= */}
        {catalogView === 'lista' && (
          <div className="max-w-6xl mx-auto px-3 sm:px-4 mt-6 animate-in fade-in duration-300">
            
            {/* Cabeçalho da Lista */}
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-[#4A6B64]">
                {selectedCategory ? `Resultados para "${selectedCategory}"` : 'Todos os Produtos'}
              </h2>
              <span className="bg-[#E8F3F2] text-[#4A6B64] text-xs font-bold px-3 py-1 rounded-full">
                {dbProducts.length} itens encontrados
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
              {filteredProducts.map(product => (
                <div 
                  key={product.id} 
                  onClick={() => openProductDetails(product)}
                  className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col border border-[#E8F3F2] hover:shadow-md transition-all duration-300 cursor-pointer group"
                >
                  {/* CAIXA DE IMAGEM COM ALTURA ADAPTÁVEL E FUNDO CLEAN */}
                  <div className="h-40 sm:h-48 relative p-3 flex justify-center items-center bg-white border-b border-[#F4F9F8]">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" 
                      onError={(e) => {
                        // Se falhar no Supabase, tenta a imagem original do Bling
                        if (product.blingImage && e.target.src !== product.blingImage) {
                          e.target.src = product.blingImage;
                        } else {
                          // Se falhar no Bling também, aí sim usa o placeholder neutro
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=400';
                        }
                      }}
                    />
                    {product.category && (
                      <span className="absolute top-2 left-2 bg-[#8ECAC5] text-white text-[9px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-widest shadow-sm z-10">
                        {product.category}
                      </span>
                    )}
                  </div>
                  
                  <div className="p-2 sm:p-3 flex-1 flex flex-col items-center text-center">
                    <h3 className="text-xs sm:text-sm font-semibold text-[#4A6B64] line-clamp-2 min-h-[32px] sm:min-h-[40px] leading-tight mb-1 group-hover:text-[#8ECAC5] transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-[10px] text-[#698F8A] mb-2">Disponível em Estoque</p>
                    
                    <div className="mt-auto w-full flex flex-col items-center">
                      <span className="text-base sm:text-lg font-extrabold text-[#4A6B64] mb-2">
                        R$ {formatPrice(product.price)}
                      </span>
                      
                      {(() => {
                        const itemNoCarrinho = cart.find(item => item.id === product.id);
                        const qtde = itemNoCarrinho ? itemNoCarrinho.quantity : 0;

                        if (qtde > 0) {
                          return (
                            <div className="w-full flex items-center justify-between bg-[#E8F3F2] border border-[#8ECAC5] rounded-lg p-1 overflow-hidden">
                              <button 
                                onClick={(e) => { 
                                  e.stopPropagation(); 
                                  if (qtde === 1) removeFromCart(product.id); 
                                  else addToCart(product, -1); 
                                }}
                                className="w-8 h-8 flex items-center justify-center text-[#4A6B64] font-bold text-lg hover:bg-white rounded-md transition-colors"
                              >-</button>
                              <span className="font-extrabold text-[#4A6B64]">{qtde}</span>
                              <button 
                                onClick={(e) => { e.stopPropagation(); addToCart(product, 1); }}
                                className="w-8 h-8 flex items-center justify-center text-[#4A6B64] font-bold text-lg hover:bg-white rounded-md transition-colors"
                              >+</button>
                            </div>
                          );
                        } else {
                          return (
                            <button 
                              onClick={(e) => { e.stopPropagation(); addToCart(product, 1); }}
                              className="w-full bg-[#E8F3F2] text-[#4A6B64] font-bold text-xs sm:text-sm py-2 rounded-lg hover:bg-[#8ECAC5] hover:text-white transition-colors"
                            >
                              Adicionar
                            </button>
                          );
                        }
                      })()}
                    </div>
                  </div>
                </div>
              ))}
            </div> {/* FIM DO GRID DE PRODUTOS */}

            {/* 🌟 BOTÃO DE ROLAGEM INFINITA */}
            {temMaisProdutos && !loadingCatalog && (
              <div className="flex justify-center mt-10 mb-6 pb-20">
                <button 
                  onClick={() => buscarProdutos(paginaAtual + 1)}
                  disabled={carregandoMais}
                  className="bg-[#4A6B64] hover:bg-[#3A5A53] text-white px-8 py-3.5 rounded-xl font-bold shadow-md transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {carregandoMais ? "Carregando..." : "Carregar mais produtos"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* 🌟 BARRA FLUTUANTE DE CARRINHO NO RODAPÉ */}
        {cartItemCount > 0 && currentScreen === 'catalog' && (
          <div className="fixed bottom-24 left-4 right-4 sm:bottom-8 sm:left-1/2 sm:-translate-x-1/2 sm:w-[500px] bg-[#00897B] text-white p-4 rounded-2xl shadow-[0_10px_40px_rgba(0,137,123,0.4)] flex justify-between items-center z-50 animate-in slide-in-from-bottom-5">
            <div className="flex flex-col">
              <span className="text-xs font-medium text-emerald-100 flex items-center gap-1">
                <ShoppingCartIcon size={14} /> Carrinho: {cartItemCount} itens
              </span>
              <span className="font-extrabold text-xl">R$ {formatPrice(cartTotal)}</span>
            </div>
            <button 
              onClick={() => setCurrentScreen('cart')}
              className="flex items-center gap-2 font-bold bg-white text-[#00897B] px-5 py-2.5 rounded-xl shadow-sm hover:scale-105 transition-transform"
            >
              Ver Carrinho
            </button>
          </div>
        )}
      </div>
    );
  }; // FIM DO renderCatalog

  const renderCart = () => (
    <div className="max-w-3xl mx-auto px-4 py-8 pb-24">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => setCurrentScreen('catalog')} className="p-2 hover:bg-[#E8F3F2] text-[#4A6B64] rounded-full transition">
          <ArrowLeftIcon size={24} />
        </button>
        <h2 className="text-2xl font-bold text-[#4A6B64]">Seu Carrinho</h2>
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-[#E8F3F2]">
          <ShoppingCartIcon size={48} className="mx-auto text-[#8ECAC5]/50 mb-4" />
          <p className="text-[#698F8A]">Seu carrinho está vazio.</p>
          <button 
            onClick={() => setCurrentScreen('catalog')}
            className="mt-4 text-[#8ECAC5] font-bold hover:underline"
          >
            Voltar ao catálogo
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {cart.map(item => (
            <div key={item.id} className="flex items-center bg-white p-4 rounded-xl shadow-sm border border-[#E8F3F2]">
              <img src={item.image} alt={item.name} className="w-16 h-16 object-contain mix-blend-multiply rounded-lg mr-4 border border-[#F4F9F8] p-1 bg-white" />
              <div className="flex-1">
                <h3 className="font-bold text-[#4A6B64] text-sm sm:text-base line-clamp-1">{item.name}</h3>
                <p className="text-[#698F8A] text-sm">R$ {formatPrice(item.price)} x {item.quantity}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-[#4A6B64]">R$ {formatPrice(item.price * item.quantity)}</p>
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-400 text-xs sm:text-sm font-semibold mt-1 hover:underline"
                >
                  Remover
                </button>
              </div>
            </div>
          ))}
          
          <div className="bg-[#4A6B64] text-white p-6 rounded-2xl mt-8 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <span className="text-lg text-[#E8F3F2]">Total do Pedido</span>
              <span className="text-3xl font-bold text-[#8ECAC5]">R$ {formatPrice(cartTotal)}</span>
            </div>
            <button 
              onClick={() => setCurrentScreen('checkout')}
              className="w-full bg-[#8ECAC5] hover:bg-[#7ABDB8] text-white py-4 rounded-xl font-bold text-lg transition shadow-md"
            >
              Avançar para Pagamento
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderCheckout = () => {
    const targetClient = currentUser?.isRep ? selectedClientForRep : currentUser;
    const isApproved = targetClient?.creditLimit > 0;
    const canUseCredit = targetClient?.isB2B && isApproved && targetClient.creditLimit >= cartTotal;
    
    const currentOrders = myOrders.length;
    const hasReachedTarget = currentOrders >= 3;

    return (
      <div className="max-w-3xl mx-auto px-4 py-8 pb-24">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => setCurrentScreen('cart')} className="p-2 hover:bg-[#E8F3F2] text-[#4A6B64] rounded-full transition">
            <ArrowLeftIcon size={24} />
          </button>
          <h2 className="text-2xl font-bold text-[#4A6B64]">Pagamento</h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E8F3F2] mb-6">
          <h3 className="font-bold text-[#698F8A] mb-2">Resumo do Pedido</h3>
          <p className="text-[#4A6B64]">Valor total a pagar: <strong className="text-2xl ml-2 text-[#8ECAC5]">R$ {formatPrice(cartTotal)}</strong></p>
          
          {targetClient?.isB2B && (
            <div className={`mt-4 p-4 rounded-xl text-sm border ${canUseCredit ? 'bg-[#E8F3F2] border-[#8ECAC5] text-[#4A6B64]' : 'bg-red-50 border-red-200 text-red-800'}`}>
              <strong className="text-base">Limite B2B do Lojista: R$ {formatPrice(targetClient.creditLimit)}</strong>
              {!isApproved ? (
                <p className="mt-1 font-semibold flex items-center gap-1">
                  <AlertCircleIcon size={14}/> 
                  {hasReachedTarget ? 'Crédito bloqueado. Cadastro em análise comercial.' : `Faltam ${3 - currentOrders} compras para liberar avaliação.`}
                </p>
              ) : !canUseCredit ? (
                <p className="mt-1">O valor do pedido excede o limite de crédito aprovado deste cliente.</p>
              ) : null}
            </div>
          )}
        </div>

        <h3 className="font-bold text-[#4A6B64] mb-4 ml-2">Escolha a forma de pagamento:</h3>
        
        <div className="space-y-3">
          <button 
            onClick={() => {
              if (canUseCredit) handleFinalizeOrder('boleto_faturado');
            }}
            disabled={!canUseCredit}
            className={`w-full flex items-center justify-between p-4 rounded-xl transition text-left shadow-sm border-2 ${
              canUseCredit 
                ? 'bg-[#F4F9F8] border-[#8ECAC5] hover:bg-[#E8F3F2] cursor-pointer' 
                : 'bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`${canUseCredit ? 'bg-[#8ECAC5]' : 'bg-gray-300'} p-3 rounded-xl text-white`}><FileTextIcon size={24} /></div>
              <div>
                <h4 className={`font-bold text-lg ${canUseCredit ? 'text-[#4A6B64]' : 'text-gray-500'}`}>Boleto Faturado (30/60/90)</h4>
                <p className={`text-sm ${canUseCredit ? 'text-[#698F8A]' : 'text-gray-400'}`}>
                  {!isApproved ? (hasReachedTarget ? 'Em análise financeira.' : `Exige 3 compras à vista (o cliente tem ${currentOrders}).`) : 'Utilizar limite de crédito aprovado.'}
                </p>
              </div>
            </div>
          </button>

          <button 
            onClick={() => handleFinalizeOrder('pix')}
            className="w-full flex items-center justify-between p-4 bg-white border border-[#E8F3F2] rounded-xl hover:border-[#8ECAC5] transition text-left shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="bg-teal-50 p-3 rounded-xl text-teal-500"><QrCodeIcon size={24} /></div>
              <div>
                <h4 className="font-bold text-[#4A6B64] text-lg">PIX</h4>
                <p className="text-[#698F8A] text-sm">Aprovação imediata. Separação rápida.</p>
              </div>
            </div>
          </button>

          <button 
            onClick={() => handleFinalizeOrder('cartao')}
            className="w-full flex items-center justify-between p-4 bg-white border border-[#E8F3F2] rounded-xl hover:border-[#8ECAC5] transition text-left shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="bg-blue-50 p-3 rounded-xl text-blue-500"><CreditCardIcon size={24} /></div>
              <div>
                <h4 className="font-bold text-[#4A6B64] text-lg">Cartão de Crédito</h4>
                <p className="text-[#698F8A] text-sm">Cobrado com o cliente na máquina ou link online.</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    );
  };

  const renderSuccess = () => (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
      <CheckCircleIcon size={80} className="text-[#8ECAC5] mb-6" />
      <h2 className="text-3xl font-bold text-[#4A6B64] mb-2">Pedido Realizado!</h2>
      <p className="text-[#698F8A] mb-8 max-w-md">
        Seu pedido foi enviado para o nosso sistema e já está na fila da expedição.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button 
          onClick={() => setCurrentScreen('catalog')}
          className="bg-[#4A6B64] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#3A5A53] transition shadow-lg"
        >
          Fazer novo pedido
        </button>
        {currentUser?.isRep ? (
           <button 
             onClick={() => {
               setSelectedClientForRep(null);
               setCurrentScreen('rep_dashboard');
             }}
             className="bg-white border border-[#4A6B64] text-[#4A6B64] px-8 py-3 rounded-xl font-bold hover:bg-[#E8F3F2] transition shadow-sm"
           >
             Atender outro cliente
           </button>
        ) : (
          <button 
            onClick={() => setCurrentScreen('orders')}
            className="bg-white border border-[#4A6B64] text-[#4A6B64] px-8 py-3 rounded-xl font-bold hover:bg-[#E8F3F2] transition shadow-sm"
          >
            Ver meus pedidos
          </button>
        )}
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-24">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => setCurrentScreen('catalog')} className="p-2 hover:bg-[#E8F3F2] text-[#4A6B64] rounded-full transition">
          <ArrowLeftIcon size={24} />
        </button>
        <h2 className="text-2xl font-bold text-[#4A6B64]">Histórico de Pedidos</h2>
      </div>

      {myOrders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-[#E8F3F2]">
          <ClipboardIcon size={48} className="mx-auto text-[#8ECAC5]/50 mb-4" />
          <p className="text-[#698F8A]">Nenhum pedido efetuado até ao momento para este cliente.</p>
          <button 
            onClick={() => setCurrentScreen('catalog')}
            className="mt-4 text-[#8ECAC5] font-bold hover:underline"
          >
            Começar a Comprar
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {myOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl shadow-sm p-6 border border-[#E8F3F2] hover:border-[#8ECAC5]/30 transition-all duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#F4F9F8] pb-4 mb-4 gap-2">
                <div>
                  <span className="text-xs font-bold text-[#698F8A] uppercase tracking-wider block">ID do Pedido</span>
                  <span className="text-sm font-mono text-[#4A6B64] font-bold">{order.id}</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-[#698F8A] uppercase tracking-wider block text-left sm:text-right">Data</span>
                  <span className="text-sm text-[#4A6B64]">
                    {order.dataCriacao ? new Date(order.dataCriacao).toLocaleDateString('pt-PT', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : 'Sem data'}
                  </span>
                </div>
                <div>
                  <span className="text-xs font-bold text-[#698F8A] uppercase tracking-wider block text-left sm:text-right font-bold">Status</span>
                  <span className="inline-block bg-[#E8F3F2] text-[#4A6B64] text-xs font-extrabold px-3 py-1 rounded-full mt-0.5">
                    {order.status || 'Autorizado'}
                  </span>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                {order.itens && Array.isArray(order.itens) ? order.itens.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm text-[#4A6B64]">
                    <span>{item.name} <strong className="text-[#8ECAC5]">x{item.quantity}</strong></span>
                    <span>R$ {formatPrice(Number(item.price || 0) * item.quantity)}</span>
                  </div>
                )) : null}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-[#F4F9F8]">
                <div>
                  <span className="text-xs text-[#698F8A] block">Pagamento</span>
                  <span className="text-xs font-bold uppercase text-[#4A6B64]">{order.metodoPagamento?.replace('_', ' ') || 'Não especificado'}</span>
                  {order.vendedorNome && (
                    <span className="text-xs font-semibold text-indigo-400 block mt-1">Vend. {order.vendedorNome}</span>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-xs text-[#698F8A] block">Total</span>
                  <span className="text-xl font-black text-[#8ECAC5]">R$ {formatPrice(order.total)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderAdmin = () => {
    const pendingClients = dbClients.filter(c => c.status === 'pendente');
    const approvedClients = dbClients.filter(c => c.status === 'aprovado' || c.creditLimit > 0);

    return (
      <div className="max-w-5xl mx-auto px-4 py-8 pb-24">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-extrabold text-[#4A6B64] flex items-center gap-3">
              <ShieldIcon size={32} />
              Painel de Gestão GKL
            </h2>
            <p className="text-[#698F8A] mt-1">Visão global e gestão de parceiros B2B.</p>
          </div>
        </div>

        {/* 🌟 ATUALIZADO: Menu de Abas do Admin com 3 botões */}
        <div className="flex bg-[#F4F9F8] rounded-xl p-1 mb-8 border border-[#E8F3F2] max-w-2xl">
          <button
            onClick={() => setAdminTab('clientes')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${
              adminTab === 'clientes' ? 'bg-[#4A6B64] text-white shadow-sm' : 'text-[#698F8A] hover:text-[#4A6B64]'
            }`}
          >
            <UsersIcon size={16} /> Gestão de Clientes
          </button>
          <button
            onClick={() => setAdminTab('pedidos')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${
              adminTab === 'pedidos' ? 'bg-[#4A6B64] text-white shadow-sm' : 'text-[#698F8A] hover:text-[#4A6B64]'
            }`}
          >
            <ListIcon size={16} /> Todos os Pedidos ({myOrders.length})
          </button>
          {/* 🌟 NOVO: Botão da Vitrine */}
          <button
            onClick={() => setAdminTab('vitrine')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${
              adminTab === 'vitrine' ? 'bg-[#8ECAC5] text-white shadow-sm' : 'text-[#698F8A] hover:text-[#8ECAC5]'
            }`}
          >
            <SparklesIcon size={16} /> Gestão da Vitrine
          </button>
        </div>

        {adminTab === 'clientes' && (
           // MANTENHA O CÓDIGO DE CLIENTES EXATAMENTE COMO ESTAVA ANTES...
           // (Para encurtar aqui na resposta, imagine que o código de aprovar clientes continua intacto aqui)
           <div className="space-y-8">
             {/* ... O conteúdo original da aba de clientes ... */}
             <h3 className="text-xl font-bold text-yellow-700 mb-4 flex items-center gap-2">
               <AlertCircleIcon size={24} /> Aguardando Aprovação Financeira ({pendingClients.length})
             </h3>
             {/* ... */}
           </div>
        )}

        {adminTab === 'pedidos' && (
           // MANTENHA O CÓDIGO DE PEDIDOS EXATAMENTE COMO ESTAVA ANTES...
           <div className="space-y-4">
             {/* ... O conteúdo original da aba de pedidos ... */}
           </div>
        )}

        {/* ========================================= */}
        {/* 🌟 NOVA ABA: GESTÃO DA VITRINE */}
        {/* ========================================= */}
        {adminTab === 'vitrine' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* PAINEL DE BANNERS */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-[#E8F3F2]">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-extrabold text-[#4A6B64]">Banners Promocionais</h3>
                  <p className="text-sm text-[#698F8A]">Gerencie o carrossel da tela inicial.</p>
                </div>
                <button onClick={() => setIsBannerModalOpen(true)} className="bg-[#E8F3F2] hover:bg-[#8ECAC5] text-[#4A6B64] hover:text-white px-4 py-2 rounded-xl text-sm font-bold transition flex items-center gap-2">
                  <PlusIcon size={16} /> Novo Banner
                </button>
              </div>

              {/* O LUGAR CORRETO DOS BOTÕES DE EDITAR: DENTRO DO ADMIN! */}
              <div className="grid gap-4 md:grid-cols-2">
                {bannersPromocionais.map((banner, idx) => (
                  <div key={idx} className="relative rounded-2xl overflow-hidden border-2 border-transparent hover:border-[#8ECAC5] transition-all group">
                    <img src={banner.imagem} alt={banner.alt} className="w-full h-32 object-cover opacity-80 group-hover:opacity-100 transition" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                      <span className="text-white font-bold">{banner.alt}</span>
                      <div className="flex gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        
                        {/* 🌟 AQUI ESTÁ O BOTÃO EDITAR FUNCIONANDO */}
                        <button 
                          onClick={() => {
                            setEditingItem(banner); 
                            setFormBannerName(banner.alt); 
                            setFormBannerPreview(banner.imagem); 
                            setIsBannerModalOpen(true); 
                          }} 
                          className="bg-white/20 hover:bg-white/40 text-white text-xs px-3 py-1 rounded-md backdrop-blur-sm transition"
                        >
                          Editar
                        </button>

                        <button className="bg-red-500/80 hover:bg-red-600 text-white text-xs px-3 py-1 rounded-md backdrop-blur-sm transition">Remover</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* PAINEL DE DEPARTAMENTOS */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-[#E8F3F2]">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-extrabold text-[#4A6B64]">Departamentos & Categorias</h3>
                  <p className="text-sm text-[#698F8A]">O menu superior e os atalhos de busca do cliente.</p>
                </div>
                <button onClick={() => { setEditingItem(null); setFormDeptName(''); setFormDeptIcon(''); setIsCategoryModalOpen(true); }} className="bg-[#E8F3F2] hover:bg-[#8ECAC5] text-[#4A6B64] hover:text-white px-4 py-2 rounded-xl text-sm font-bold transition flex items-center gap-2">
                  <PlusIcon size={16} /> Novo Departamento
                </button>
              </div>

              <div className="space-y-4">
                {mapaCategorias.map((dept, idx) => (
                  <div key={idx} className="border border-[#E8F3F2] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition">
                    <div className="flex items-center gap-4">
                      <span className={`w-12 h-12 flex items-center justify-center rounded-xl text-2xl ${dept.cor.split(' ')[0]}`}>{dept.icone}</span>
                      <div>
                        <h4 className="font-bold text-[#4A6B64] text-lg">{dept.nome}</h4>
                        <p className="text-xs text-[#698F8A]">{dept.marcas.length} subcategorias/marcas cadastradas</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                    <button 
  onClick={() => {
    setEditingItem(dept);
    setFormDeptName(dept.nome);
    setFormDeptIcon(dept.icone);
    setIsCategoryModalOpen(true);
  }} 
  className="flex-1 sm:flex-none text-center bg-[#F4F9F8] hover:bg-[#E8F3F2] text-[#4A6B64] px-4 py-2 rounded-xl text-sm font-bold transition"
>
  Editar
</button>
                      <button className="flex-1 sm:flex-none text-center bg-red-50 hover:bg-red-100 text-red-500 px-4 py-2 rounded-xl text-sm font-bold transition">Excluir</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* BOTÃO SALVAR (Visual) */}
            <div className="flex justify-end pt-4 border-t border-[#E8F3F2]">
              <button className="bg-[#4A6B64] text-white px-8 py-3 rounded-xl font-bold shadow-md hover:bg-[#3A5A53] transition">
                Salvar Alterações no Supabase
              </button>
            </div>

          </div>
        )}
        {/* ========================================= */}
        {/* MODAL: CRIAR / EDITAR BANNER */}
        {/* ========================================= */}
        {isBannerModalOpen && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative animate-in zoom-in-95 duration-200">
              
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-[#4A6B64] flex items-center gap-2">
                  <SparklesIcon size={24} className="text-[#8ECAC5]" />
                  {editingItem ? 'Editar Banner' : 'Novo Banner'}
                </h3>
                <button onClick={() => { setIsBannerModalOpen(false); setFormBannerPreview(null); }} className="text-gray-400 hover:text-gray-600 transition">
                  <CloseIcon size={24} />
                </button>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-[#4A6B64] uppercase mb-1">Nome de controle da Campanha</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Ofertas de Black Friday" 
                    value={formBannerName}
                    onChange={(e) => setFormBannerName(e.target.value)}
                    className="w-full bg-[#F4F9F8] text-[#4A6B64] border border-[#E8F3F2] rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-[#8ECAC5] transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4A6B64] uppercase mb-1">Imagem do Banner</label>
                  <p className="text-[10px] text-[#698F8A] mb-2 font-semibold">Tamanho recomendado: 1200x300 pixels (JPG ou PNG). Máx 2MB.</p>
                  
                  {/* Área de Upload Estilo Drag & Drop (Simplificada) */}
                  <label className="flex flex-col items-center justify-center w-full h-32 sm:h-40 border-2 border-[#8ECAC5] border-dashed rounded-2xl cursor-pointer bg-[#F4F9F8] hover:bg-[#E8F3F2] transition relative overflow-hidden">
                    {formBannerPreview ? (
                      <img src={formBannerPreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <PlusIcon size={32} className="text-[#8ECAC5] mb-2" />
                        <p className="text-sm font-bold text-[#4A6B64]">Clique para selecionar o arquivo</p>
                      </div>
                    )}
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/png, image/jpeg, image/webp"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setFormBannerImageFile(file);
                          setFormBannerPreview(URL.createObjectURL(file)); // Gera um link temporário para mostrar na hora!
                        }
                      }}
                    />
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                  <button onClick={() => { setIsBannerModalOpen(false); setFormBannerPreview(null); }} className="px-5 py-2.5 rounded-xl font-bold text-[#698F8A] hover:bg-gray-50 transition">
                    Cancelar
                  </button>
                  <button className="bg-[#4A6B64] hover:bg-[#3A5A53] text-white px-8 py-2.5 rounded-xl font-bold shadow-md transition active:scale-95">
                    {editingItem ? 'Salvar Edição' : 'Adicionar Banner'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================= */}
        {/* MODAL: CRIAR / EDITAR DEPARTAMENTO */}
        {/* ========================================= */}
        {isCategoryModalOpen && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative animate-in zoom-in-95 duration-200">
              
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-[#4A6B64] flex items-center gap-2">
                  <SparklesIcon size={24} className="text-[#8ECAC5]" />
                  {editingItem ? 'Editar Departamento' : 'Novo Departamento'}
                </h3>
                <button onClick={() => setIsCategoryModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition">
                  <CloseIcon size={24} />
                </button>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-[#4A6B64] uppercase mb-1">Nome do Departamento</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Skincare & Cuidados" 
                    value={formDeptName}
                    onChange={(e) => setFormDeptName(e.target.value)}
                    className="w-full bg-[#F4F9F8] text-[#4A6B64] border border-[#E8F3F2] rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-[#8ECAC5] transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4A6B64] uppercase mb-1">Emoji / Ícone</label>
                  <p className="text-[10px] text-[#698F8A] mb-2 font-semibold">Copie e cole um Emoji (Windows + Ponto) para ilustrar a categoria.</p>
                  <input 
                    type="text" 
                    placeholder="Ex: ✨" 
                    value={formDeptIcon}
                    onChange={(e) => setFormDeptIcon(e.target.value)}
                    className="w-20 text-center text-3xl bg-[#F4F9F8] text-[#4A6B64] border border-[#E8F3F2] rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-[#8ECAC5] transition"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                  <button onClick={() => setIsCategoryModalOpen(false)} className="px-5 py-2.5 rounded-xl font-bold text-[#698F8A] hover:bg-gray-50 transition">
                    Cancelar
                  </button>
                  <button className="bg-[#4A6B64] hover:bg-[#3A5A53] text-white px-8 py-2.5 rounded-xl font-bold shadow-md transition active:scale-95">
                    {editingItem ? 'Salvar Edição' : 'Adicionar'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    // 🌟 FUNDO CINZA MERCADO LIVRE (#EBEBEB)
    <div className="min-h-screen bg-[#EBEBEB] font-sans relative">
      
      {currentUser && currentScreen !== 'login' && (
        // 🌟 CABEÇALHO UNIFICADO (Cor principal do seu app)
        <header className="bg-[#4A6B64] sticky top-0 z-40 shadow-md">
          
          {/* 1º ANDAR: Logo, Busca, Usuário e Carrinho */}
          <div className="max-w-6xl mx-auto px-4 py-2 sm:py-3 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 sm:gap-6">
            
            {/* LOGO GKL */}
            <div className="flex items-center gap-2 cursor-pointer shrink-0" onClick={() => { if (!currentUser.isAdmin && !currentUser.isRep) voltarParaHome(); }}>
              <SparklesIcon size={24} className="text-[#8ECAC5]" />
              <div className="flex flex-col">
                <span className="font-black text-lg sm:text-xl leading-tight text-white tracking-wide">GKL BRASIL</span>
                <span className="text-[9px] sm:text-[10px] font-bold tracking-widest uppercase text-[#8ECAC5] leading-none">
                  {currentUser.isAdmin ? 'Painel Admin' : currentUser.isRep ? 'Portal Rep.' : 'B2B Atacado'}
                </span>
              </div>
            </div>

            {/* BARRA DE BUSCA CENTRAL (Ocupa linha inteira no celular, divide espaço no PC) */}
            {currentScreen === 'catalog' && (
              <div className="w-full sm:w-auto sm:flex-1 order-3 sm:order-none relative mt-1 sm:mt-0">
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="text" 
                  placeholder="Buscar produtos, marcas e muito mais..." 
                  className="w-full bg-white text-[#4A6B64] rounded-sm py-2.5 sm:py-3 pl-11 pr-4 outline-none shadow-inner text-sm font-medium focus:ring-2 focus:ring-[#8ECAC5] transition-all"
                  value={searchQuery}
                  onKeyDown={(e) => { if (e.key === 'Enter' && searchQuery.trim() !== '') abrirMarca(searchQuery); }}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            )}

            {/* ÁREA DO USUÁRIO E ÍCONES */}
            <div className="flex items-center gap-3 sm:gap-5 shrink-0 text-white order-2 sm:order-none">
              <div className="text-right hidden md:block">
                <span className="text-xs text-gray-200 block leading-tight">Olá, <strong className="text-white">{currentUser.name}</strong></span>
                {currentUser.isB2B && <span className="text-[10px] text-[#8ECAC5] font-bold">Limite: R$ {formatPrice(currentUser.creditLimit)}</span>}
              </div>

              {!currentUser.isAdmin && (
                <>
                  <button onClick={() => setCurrentScreen('orders')} className="hover:text-[#8ECAC5] transition" title="Meus Pedidos">
                    <ClipboardIcon size={22} />
                  </button>
                  <button onClick={() => setCurrentScreen('cart')} className="relative hover:text-[#8ECAC5] transition">
                    <ShoppingCartIcon size={22} />
                    {cartItemCount > 0 && (
                      <span className="absolute -top-1.5 -right-2 bg-yellow-400 text-yellow-900 text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full shadow-sm">
                        {cartItemCount}
                      </span>
                    )}
                  </button>
                </>
              )}
              <button onClick={handleLogout} className="hover:text-[#8ECAC5] transition ml-1" title="Sair">
                <LogOutIcon size={22} />
              </button>
            </div>
          </div>

          {/* 2º ANDAR: Menu Persistente de Categorias (Só no PC) */}
          {currentScreen === 'catalog' && (
            <div className="bg-[#3A5A53] px-4 hidden sm:block">
              <div className="max-w-6xl mx-auto flex gap-6 overflow-x-auto whitespace-nowrap scrollbar-none text-[13px] font-semibold text-white/90">
                <button onClick={voltarParaHome} className={`py-2.5 border-b-[3px] transition-all ${catalogView === 'home' ? 'border-[#8ECAC5] text-white font-bold' : 'border-transparent hover:text-white'}`}>
                  Início
                </button>
                {mapaCategorias.map(dept => (
                  <div key={dept.id} className="relative group">
                    <button className="flex items-center gap-1.5 py-2.5 border-b-[3px] border-transparent hover:text-white transition-all cursor-pointer">
                      {dept.nome} <span className="text-[9px] opacity-70">▼</span>
                    </button>
                    {/* Dropdown Menu */}
                    <div className="absolute top-full left-0 mt-0 w-52 bg-white text-[#4A6B64] rounded-b-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden border border-gray-200">
                      <div className="bg-gray-100 px-4 py-2 text-[10px] font-black uppercase tracking-wider text-gray-500">Marcas Relacionadas</div>
                      {dept.marcas.map((marca, idx) => (
                        <button key={idx} onClick={() => abrirMarca(marca.busca)} className="w-full text-left px-4 py-3 hover:bg-[#F4F9F8] hover:text-[#8ECAC5] text-sm font-bold border-b border-gray-100 last:border-0 transition-colors">
                          {marca.nome}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </header>
      )}

      {currentScreen === 'login' && renderLogin()}
      {currentScreen === 'rep_dashboard' && renderRepDashboard()}
      {currentScreen === 'catalog' && renderCatalog()}
      {currentScreen === 'cart' && renderCart()}
      {currentScreen === 'checkout' && renderCheckout()}
      {currentScreen === 'success' && renderSuccess()}
      {currentScreen === 'orders' && renderOrders()}
      {currentScreen === 'admin' && renderAdmin()}

      {/* Modal Flutuante para Detalhes do Produto */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-all duration-300">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto md:overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 flex flex-col md:flex-row border border-[#8ECAC5]/10">
            <button 
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 bg-white/80 p-2 rounded-full text-[#4A6B64] hover:bg-[#E8F3F2] transition z-10 shadow-sm"
            >
              <CloseIcon size={20} />
            </button>

            <div className="w-full md:w-1/2 h-64 md:h-auto bg-white relative p-6 flex items-center justify-center">
              <img 
                src={selectedProduct.image} 
                alt={selectedProduct.name} 
                className="max-h-full max-w-full object-contain mix-blend-multiply"
              />
              {selectedProduct.category && (
                <span className="absolute top-4 left-4 bg-[#8ECAC5] text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                  {selectedProduct.category}
                </span>
              )}
            </div>

            <div className="p-6 md:p-8 flex-1 flex flex-col justify-between bg-[#F4F9F8]/50">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#4A6B64] mb-2 leading-tight">
                  {selectedProduct.name}
                </h3>
                <span className="inline-block bg-[#E8F3F2] text-[#4A6B64] text-xs font-bold px-3 py-1 rounded-full mb-4">
                  Código: {selectedProduct.id}
                </span>
                
                <p className="text-sm text-[#698F8A] leading-relaxed mb-6">
                  {selectedProduct.description}
                </p>
              </div>

              <div>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-xs font-semibold text-[#698F8A] uppercase">Preço</span>
                  <span className="text-3xl font-extrabold text-[#8ECAC5]">
                    R$ {formatPrice(selectedProduct.price)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center bg-white border border-[#E8F3F2] rounded-xl p-1 shadow-sm">
                    <button 
                      onClick={() => setModalQuantity(prev => Math.max(1, prev - 1))}
                      className="p-2 text-[#4A6B64] hover:bg-[#F4F9F8] rounded-lg transition"
                    >
                      <MinusIcon size={16} />
                    </button>
                    <span className="px-4 font-bold text-[#4A6B64] min-w-[32px] text-center">
                      {modalQuantity}
                    </span>
                    <button 
                      onClick={() => setModalQuantity(prev => Math.min(selectedProduct.stock || 999, prev + 1))}
                      className="p-2 text-[#4A6B64] hover:bg-[#F4F9F8] rounded-lg transition"
                    >
                      <PlusIcon size={16} />
                    </button>
                  </div>

                  <button 
                    onClick={() => {
                      addToCart(selectedProduct, modalQuantity);
                      setSelectedProduct(null);
                    }}
                    className="flex-1 bg-[#4A6B64] hover:bg-[#3A5A53] text-white py-3 px-4 sm:px-6 rounded-xl font-bold flex items-center justify-center gap-2 transition shadow-md active:scale-95 text-sm sm:text-base"
                  >
                    <ShoppingCartIcon size={18} />
                    Adicionar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}