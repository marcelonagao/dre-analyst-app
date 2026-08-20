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

export default function CatalogoB2BTab() {
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
  // 🚀 NOVO MOTOR: ROLAGEM INFINITA E SINCRONIZAÇÃO B2B
  // ============================================================================
  const buscarProdutos = async (pagina = 1) => {
    if (!firebaseUser && !currentUser) return;

    if (pagina === 1) setLoadingCatalog(true);
    else setCarregandoMais(true);

    try {
      // Passa a página na URL para o nosso back-end
      const res = await fetch(`/api/catalogo-b2b?pagina=${pagina}`);
      const data = await res.json();
      
      if (data.success) {
        const produtosAdaptados = data.produtos.map((p) => {
          const partesNome = p.nome.split('-');
          const categoriaDerivada = partesNome.length > 1 ? partesNome[0].trim() : 'Geral';
          const urlBlingOriginal = p.imagemUrl || '';
          
          const horaAtual = new Date().getHours();
          const urlSupabase = `https://owtdvdelyalhielaeoca.supabase.co/storage/v1/object/public/fotos-b2b/${p.sku}.jpg?v=${horaAtual}`;

          return {
            id: p.sku, 
            blingId: p.id,
            name: p.nome,
            category: categoriaDerivada,
            price: Number(p.preco),
            stock: 999,
            image: urlSupabase,
            blingImage: urlBlingOriginal,
            description: `SKU: ${p.sku} | Produto oficial distribuído pela GKL Brasil.`
          };
        });
        
        if (pagina === 1) {
          setDbProducts(produtosAdaptados); // Página 1: Substitui tudo
        } else {
          setDbProducts(prev => [...prev, ...produtosAdaptados]); // Página 2+: Empilha!
        }
        
        setTemMaisProdutos(data.temMais);
        setPaginaAtual(pagina);
      } else {
        if (pagina === 1) setDbProducts(PRODUCTS_FALLBACK);
      }
    } catch (error) {
      console.error("Falha de rede ao buscar Bling:", error);
      if (pagina === 1) setDbProducts(PRODUCTS_FALLBACK);
    } finally {
      setLoadingCatalog(false);
      setCarregandoMais(false);
    }
  };

  // Chama a página 1 automaticamente quando o usuário faz login
  useEffect(() => {
    buscarProdutos(1);
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
      <div className="pb-24">
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

        <div className="bg-white p-3 sm:p-4 shadow-sm sticky top-[68px] sm:top-[76px] z-10 mb-2 border-b border-[#8ECAC5]/20">
          <div className="relative max-w-3xl mx-auto">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-[#698F8A]" size={20} />
            <input 
              type="text" 
              placeholder="Buscar produtos..." 
              className="w-full bg-[#F4F9F8] text-[#4A6B64] rounded-xl py-2.5 sm:py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-[#8ECAC5] transition border border-transparent focus:border-[#8ECAC5] text-sm sm:text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-3 sm:px-4 mb-4 sm:mb-6">
          <div className="flex gap-2 overflow-x-auto py-2 scrollbar-none">
            {uniqueCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full font-semibold text-xs sm:text-sm whitespace-nowrap transition-all duration-300 ${
                  selectedCategory === cat 
                    ? 'bg-[#4A6B64] text-white shadow-md transform scale-105' 
                    : 'bg-white text-[#4A6B64] border border-[#E8F3F2] hover:bg-[#E8F3F2]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-3 sm:px-4">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-[#4A6B64]">
              {selectedCategory === 'Todas' ? 'Catálogo Geral' : selectedCategory}
            </h2>
            <span className="text-xs sm:text-sm text-[#698F8A] font-semibold">{filteredProducts.length} itens</span>
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
                    <button 
                      onClick={(e) => {
                        e.stopPropagation(); 
                        addToCart(product, 1);
                      }}
                      className="w-full bg-[#E8F3F2] text-[#4A6B64] font-bold text-xs sm:text-sm py-1.5 sm:py-2 rounded-lg hover:bg-[#8ECAC5] hover:text-white transition-colors"
                    >
                      Adicionar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* 🌟 NOVO: BOTÃO CARREGAR MAIS */}
          {temMaisProdutos && !loadingCatalog && (
            <div className="flex justify-center mt-10 mb-6">
              <button 
                onClick={() => buscarProdutos(paginaAtual + 1)}
                disabled={carregandoMais}
                className="bg-[#4A6B64] hover:bg-[#3A5A53] text-white px-8 py-3.5 rounded-xl font-bold shadow-md transition-all disabled:opacity-50 active:scale-95 flex items-center gap-2"
              >
                {carregandoMais ? (
                  <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Carregando...</>
                ) : (
                  "Carregar mais produtos"
                )}
              </button>
            </div>
          )}
        </div> 
        {/* 🌟 NOVO: AVISO FLUTUANTE DE PRODUTO ADICIONADO */}
      {toastMessage && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-[#4A6B64] text-white px-6 py-3 rounded-full shadow-2xl z-50 font-bold text-sm sm:text-base whitespace-nowrap flex items-center gap-2 transition-all duration-300">
          {toastMessage}
        </div>
      )}  
      </div>
    );
  };

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

        <div className="flex bg-[#F4F9F8] rounded-xl p-1 mb-8 border border-[#E8F3F2] max-w-md">
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
        </div>

        {adminTab === 'clientes' && (
          <>
            {dbClients.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl shadow-sm text-center border border-[#E8F3F2]">
                <p className="text-[#698F8A]">Nenhum cliente cadastrado no Firebase ainda.</p>
                <p className="text-sm mt-2 text-[#4A6B64]">Dica: Crie uma conta na tela de login para ver os dados aparecerem aqui.</p>
              </div>
            ) : (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-yellow-700 mb-4 flex items-center gap-2">
                    <AlertCircleIcon size={24} /> 
                    Aguardando Aprovação Financeira ({pendingClients.length})
                  </h3>
                  
                  {pendingClients.length === 0 ? (
                    <div className="bg-yellow-50 p-6 rounded-2xl border border-yellow-100 text-yellow-700 text-sm font-semibold">
                      Tudo limpo! Não há nenhuma solicitação pendente no momento.
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {pendingClients.map(client => (
                        <div key={client.id} className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-yellow-400 flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div>
                            <h4 className="font-bold text-lg text-[#4A6B64]">{client.name}</h4>
                            <div className="flex gap-4 mt-1 text-sm text-[#698F8A]">
                              <span><strong>CNPJ:</strong> {client.nif}</span>
                              <span><strong>Email:</strong> {client.email}</span>
                            </div>
                          </div>
                          <button 
                            onClick={() => handleApproveCredit(client.id)}
                            className="bg-[#8ECAC5] hover:bg-[#7ABDB8] text-white px-6 py-3 rounded-xl font-bold shadow-md transition-all active:scale-95"
                          >
                            Aprovar R$ 5.000,00
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-xl font-bold text-[#4A6B64] mb-4 flex items-center gap-2">
                    <CheckCircleIcon size={24} /> 
                    Lojistas Aprovados ({approvedClients.length})
                  </h3>
                  <div className="grid gap-4">
                    {approvedClients.map(client => (
                      <div key={client.id} className="bg-white p-4 rounded-xl shadow-sm border border-[#E8F3F2] flex justify-between items-center opacity-80">
                        <div>
                          <h4 className="font-bold text-[#4A6B64]">{client.name}</h4>
                          <span className="text-xs text-[#698F8A]">CNPJ: {client.nif} {client.vendedorNome && `• Rep: ${client.vendedorNome}`}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-[#698F8A] block">Limite Aprovado</span>
                          <span className="font-bold text-[#8ECAC5]">R$ {formatPrice(client.creditLimit)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {adminTab === 'pedidos' && (
          <div className="space-y-4">
            {myOrders.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl shadow-sm text-center border border-[#E8F3F2]">
                <ClipboardIcon size={48} className="mx-auto text-[#8ECAC5]/50 mb-4" />
                <p className="text-[#698F8A]">Nenhum pedido efetuado no sistema ainda.</p>
              </div>
            ) : (
              myOrders.map((order) => (
                <div key={order.id} className="bg-white rounded-2xl shadow-sm p-6 border border-[#E8F3F2]">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#F4F9F8] pb-4 mb-4 gap-2">
                    <div>
                      <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block">Cliente</span>
                      <span className="text-base text-[#4A6B64] font-bold">{order.clienteNome}</span>
                      {order.vendedorNome && <span className="text-xs text-[#698F8A] ml-2">• Via Rep. {order.vendedorNome}</span>}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#698F8A] uppercase tracking-wider block text-left sm:text-right">Data</span>
                      <span className="text-sm text-[#4A6B64]">
                        {order.dataCriacao ? new Date(order.dataCriacao).toLocaleDateString('pt-PT', {day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'}) : 'Sem data'}
                      </span>
                    </div>
                    <div>
                      <span className="inline-block bg-[#E8F3F2] text-[#4A6B64] text-xs font-extrabold px-3 py-1 rounded-full mt-0.5">
                        {order.status || 'Autorizado'}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-xs text-[#698F8A] block">Método</span>
                      <span className="text-xs uppercase font-bold text-[#4A6B64]">{order.metodoPagamento?.replace('_', ' ') || 'Não especificado'}</span>
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

  return (
    <div className="min-h-screen bg-[#F4F9F8] font-sans relative">
      {currentUser && currentScreen !== 'login' && (
        <header className="bg-white border-b border-[#8ECAC5]/30 text-[#4A6B64] p-3 sm:p-4 sticky top-0 z-20 shadow-sm">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-1.5 sm:gap-2" onClick={() => {
              if (currentUser.isAdmin) return;
              if (currentUser.isRep && !selectedClientForRep) return;
              setCurrentScreen('catalog');
            }} style={{cursor: (currentUser.isAdmin || (currentUser.isRep && !selectedClientForRep)) ? 'default' : 'pointer'}}>
              <SparklesIcon size={20} className="text-[#8ECAC5] w-5 h-5 sm:w-6 sm:h-6" />
              <div className="flex flex-col">
                <span className="font-bold text-sm sm:text-lg leading-tight text-[#8ECAC5]">GKL BRASIL</span>
                <span className="text-[7px] sm:text-[10px] font-bold tracking-wider uppercase text-[#698F8A] leading-none">
                  {currentUser.isAdmin ? 'Painel Admin' : currentUser.isRep ? 'Portal Rep.' : 'Distribuidora'}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-6">
              <div className="text-xs text-right hidden md:block text-[#698F8A]">
                {currentUser.isAdmin ? (
                   <><span className="mr-1">Olá,</span><span className="font-bold text-[#4A6B64]">{currentUser.name}</span><div className="text-xs font-semibold text-gray-500">Acesso Nível Gestão</div></>
                ) : currentUser.isRep ? (
                   <>
                     <span className="font-bold text-indigo-400 mr-1">Rep. {currentUser.name}</span>
                     <div className="text-xs font-semibold text-[#4A6B64]">
                       {selectedClientForRep ? `Atendendo: ${selectedClientForRep.name}` : 'Selecione um cliente'}
                     </div>
                   </>
                ) : (
                   <>
                     <span className="mr-1">Olá,</span><span className="font-bold text-[#4A6B64]">{currentUser.name}</span>
                     {currentUser.isB2B && (
                       <div className="text-xs font-semibold text-[#8ECAC5]">
                         {currentUser.creditLimit > 0 ? `Limite: R$ ${formatPrice(currentUser.creditLimit)}` : (myOrders.length >= 3 ? 'Conta em Análise' : `Compras: ${myOrders.length}/3`)}
                       </div>
                     )}
                   </>
                )}
              </div>

              {!currentUser.isAdmin && (!currentUser.isRep || (currentUser.isRep && selectedClientForRep)) && (
                <>
                  <button 
                    onClick={() => setCurrentScreen('orders')}
                    className={`p-1.5 sm:p-2 rounded-full transition ${currentScreen === 'orders' ? 'bg-[#E8F3F2] text-[#4A6B64]' : 'hover:bg-[#E8F3F2] text-[#698F8A]'}`}
                    title="Histórico de Pedidos"
                  >
                    <ClipboardIcon size={20} className="sm:w-6 sm:h-6" />
                  </button>
                  
                  <button 
                    onClick={() => setCurrentScreen('cart')}
                    className="relative p-1.5 sm:p-2 hover:bg-[#E8F3F2] rounded-full transition text-[#4A6B64]"
                  >
                    <ShoppingCartIcon size={20} className="sm:w-6 sm:h-6" />
                    {cartItemCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-[#8ECAC5] text-white text-[9px] sm:text-xs font-bold w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center rounded-full shadow-sm">
                        {cartItemCount}
                      </span>
                    )}
                  </button>
                </>
              )}

              {currentUser.isRep && selectedClientForRep && currentScreen !== 'rep_dashboard' && (
                 <button 
                   onClick={() => {
                     setSelectedClientForRep(null);
                     setCart([]);
                     setCurrentScreen('rep_dashboard');
                   }}
                   className="text-[10px] sm:text-xs font-bold text-indigo-400 bg-indigo-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg hover:bg-indigo-100 transition"
                 >
                   Trocar
                 </button>
              )}

              <button onClick={handleLogout} className="p-1.5 sm:p-2 text-[#698F8A] hover:text-[#4A6B64] transition" title="Sair">
                <LogOutIcon size={20} className="sm:w-6 sm:h-6" />
              </button>
            </div>
          </div>
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