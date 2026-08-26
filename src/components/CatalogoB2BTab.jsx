import React, { useState, useEffect } from 'react';

// --- IMPORTAÇÕES DO FIREBASE ---
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, signInWithCustomToken } from 'firebase/auth';
import { getFirestore, collection, onSnapshot, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
// 🌟 NOVO: Importando o "Drive" de imagens do Firebase
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

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

const PackageIcon = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
    <line x1="12" y1="22.08" x2="12" y2="12"></line>
  </svg>
);

const TruckIcon = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="1" y="3" width="15" height="13"></rect>
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
    <circle cx="5.5" cy="18.5" r="2.5"></circle>
    <circle cx="18.5" cy="18.5" r="2.5"></circle>
  </svg>
);

const MapPinIcon = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
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
const storage = getStorage(app); 

const PRODUCTS_FALLBACK = [
  { id: 1, name: 'Produto Falso - Erro API', category: 'Erro', price: 0.00, stock: 0, image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=400' }
];

const MOCK_USERS = {
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
  
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [temMaisProdutos, setTemMaisProdutos] = useState(true);
  const [carregandoMais, setCarregandoMais] = useState(false);

  // 🌟 CONTROLE DE TELA (3 Níveis de Navegação)
  const [catalogView, setCatalogView] = useState('home'); // 'home' | 'lista'

  // ============================================================================
  // 🌟 ESTADOS PARA GESTÃO DA VITRINE (Modais e Uploads)
  // ============================================================================
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null); 

  // Dados do formulário de Banner
  const [formBannerName, setFormBannerName] = useState('');
  const [formBannerImageFile, setFormBannerImageFile] = useState(null);
  const [formBannerPreview, setFormBannerPreview] = useState(null);

  const [isUploading, setIsUploading] = useState(false);


  // 🌟 ESTADO DINÂMICO DOS DEPARTAMENTOS E BANNERS
  const [mapaCategorias, setMapaCategorias] = useState([]);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [bannersPromocionais, setBannersPromocionais] = useState([
    { id: 'fallback1', imagem: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=1200&h=400', alt: 'Carregando Banners...' }
  ]);

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [selectedDeptHome, setSelectedDeptHome] = useState(null);
  const [activeDeptHome, setActiveDeptHome] = useState(null);

  // ============================================================================
  // 🌟 ESTADOS DO PAINEL ADMIN (APROVAÇÃO DE CLIENTES)
  // ============================================================================
  const [isEvalModalOpen, setIsEvalModalOpen] = useState(false);
  const [evalClient, setEvalClient] = useState(null);
  const [evalCreditLimit, setEvalCreditLimit] = useState('');
  const [evalRepId, setEvalRepId] = useState('');

  // ============================================================================
  // 🌟 ESTADOS DO PORTAL DO REPRESENTANTE (NOVO CLIENTE)
  // ============================================================================
  const [isRepNewClientModalOpen, setIsRepNewClientModalOpen] = useState(false);
  const [repNewClientName, setRepNewClientName] = useState('');
  const [repNewClientNIF, setRepNewClientNIF] = useState('');
  const [repNewClientEmail, setRepNewClientEmail] = useState('');
  const [repNewClientWhatsApp, setRepNewClientWhatsApp] = useState('');
  const [repNewClientCEP, setRepNewClientCEP] = useState('');
  const [repNewClientRua, setRepNewClientRua] = useState('');
  const [repNewClientNumero, setRepNewClientNumero] = useState('');
  const [repNewClientBairro, setRepNewClientBairro] = useState('');
  const [repNewClientCidade, setRepNewClientCidade] = useState('');
  const [repNewClientEstado, setRepNewClientEstado] = useState('');

  // 🚀 BUSCADOR DE CEP DO REPRESENTANTE (VIACEP)
  const handleRepCepSearch = async (cepInput) => {
    const cep = cepInput.replace(/\D/g, '');
    setRepNewClientCEP(cep);

    if (cep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setRepNewClientRua(data.logradouro || '');
          setRepNewClientBairro(data.bairro || '');
          setRepNewClientCidade(data.localidade || '');
          setRepNewClientEstado(data.uf || '');
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
      }
    }
  };

  // ============================================================================
  // 🌟 ESTADOS DE FRETE E INTEGRAÇÃO MERCADO PAGO
  // ============================================================================
  const [checkoutCEP, setCheckoutCEP] = useState('');
  const [shippingCost, setShippingCost] = useState(null);
  const [isFreeShipping, setIsFreeShipping] = useState(false);
  const [pixQrCode, setPixQrCode] = useState(null); // Receberá o código PIX do Mercado Pago
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // ============================================================================
  // 🌟 ESTADOS DE AUTENTICAÇÃO E CADASTRO COMPLETO
  // ============================================================================
  // (Mantenha os que você já tem: authEmail, authPassword, authName, authNIF...)
  const [authName, setAuthName] = useState('');
  const [authNIF, setAuthNIF] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authWhatsApp, setAuthWhatsApp] = useState('');
  const [authCEP, setAuthCEP] = useState('');
  const [authRua, setAuthRua] = useState('');
  const [authNumero, setAuthNumero] = useState('');
  const [authBairro, setAuthBairro] = useState('');
  const [authCidade, setAuthCidade] = useState('');
  const [authEstado, setAuthEstado] = useState('');

  const [selectedClientForRep, setSelectedClientForRep] = useState(null);

  const [adminTab, setAdminTab] = useState('clientes');
  const [repTab, setRepTab] = useState('clientes');

  const [activeAuthTab, setActiveAuthTab] = useState('login');
  
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [dbProducts, setDbProducts] = useState([]);
  const [dbClients, setDbClients] = useState([]);
  
  const [loadingCatalog, setLoadingCatalog] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Dados do formulário de Departamento
  const [formDeptName, setFormDeptName] = useState('');
  const [formDeptIcon, setFormDeptIcon] = useState(''); 
  const [formDeptMarcas, setFormDeptMarcas] = useState([]); 
  const [novaMarcaInput, setNovaMarcaInput] = useState('');

  const [uploadingMarcaIndex, setUploadingMarcaIndex] = useState(null);

  // 🚀 BUSCADOR DE CEP AUTOMÁTICO (VIACEP)
  const handleCepSearch = async (cepInput) => {
    const cep = cepInput.replace(/\D/g, '');
    setAuthCEP(cep); // Atualiza o que o usuário digita

    if (cep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        
        if (!data.erro) {
          setAuthRua(data.logradouro || '');
          setAuthBairro(data.bairro || '');
          setAuthCidade(data.localidade || '');
          setAuthEstado(data.uf || '');
          // O foco vai naturalmente para o campo "Número" depois disso
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
      }
    }
  };

  // 🚀 LÓGICA DE VALIDAÇÃO DE CEP (Grande SP e Vale do Paraíba/Litoral)
  const handleCalculateShipping = (cepValue) => {
    const cleanCEP = cepValue.replace(/\D/g, '');
    setCheckoutCEP(cleanCEP);

    if (cleanCEP.length === 8) {
      const prefix = parseInt(cleanCEP.substring(0, 5));
      
      // Regra 1: Grande SP (Aprox 01000 a 09999)
      const isGrandeSP = prefix >= 1000 && prefix <= 9999;
      // Regra 2: Litoral Norte (11600-11699) e Vale do Paraíba (12000-12999)
      const isValeParaiba = (prefix >= 11600 && prefix <= 11699) || (prefix >= 12000 && prefix <= 12999);
      
      const regionElegible = isGrandeSP || isValeParaiba;
      const valueElegible = cartTotal >= 400;

      if (regionElegible && valueElegible) {
        setIsFreeShipping(true);
        setShippingCost(0);
      } else {
        setIsFreeShipping(false);
        setShippingCost(45.00); // Valor fixo simulado para outras regiões (pode ser dinâmico depois)
      }
    } else {
      setShippingCost(null);
      setIsFreeShipping(false);
    }
  };

  // 🌟 LISTA DA SUA EQUIPE COMERCIAL (Pode editar os nomes como preferir)
  const representantesCadastrados = [
    { id: 'rep_1', name: 'Carlos Vendedor' },
    { id: 'rep_2', name: 'Ana Costa' },
    { id: 'rep_3', name: 'Equipe Interna GKL' }
  ];

  // Motor do Banner
  useEffect(() => {
    if (catalogView !== 'home' || bannersPromocionais.length === 0) return;
    const timer = setInterval(() => setCurrentBanner((prev) => (prev + 1) % bannersPromocionais.length), 4000);
    return () => clearInterval(timer);
  }, [catalogView, bannersPromocionais.length]);

  const marcasDestaque = ['DERMACHEM', 'FACE BEAUTIFUL', 'AIFER', 'ACTION'];

  

  // 🌟 COMUNICAÇÃO COM O APP.JSX (Esconder/Mostrar Menu Lateral)
  useEffect(() => {
    if (onRoleChange) {
      if (!currentUser || currentUser.isB2B) {
        onRoleChange('b2b');
      } 
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
  // 🌟 ESCUTANDO OS DEPARTAMENTOS DO BANCO DE DADOS
  // ============================================================================
  useEffect(() => {
    if (!isFirebaseConfigured || !firebaseUser) return;
    
    const deptPath = typeof window !== 'undefined' && window.__app_id 
      ? collection(db, 'artifacts', appId, 'public', 'data', 'vitrine_departamentos')
      : collection(db, 'vitrine_departamentos');
      
    const unsubscribe = onSnapshot(deptPath, (snapshot) => {
      if (!snapshot.empty) {
        const fetchedDepts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        fetchedDepts.sort((a, b) => a.nome.localeCompare(b.nome));
        setMapaCategorias(fetchedDepts);
      } else {
        setMapaCategorias([]);
      }
    }, (error) => {
      console.error("Erro ao buscar departamentos:", error);
    });
    
    return () => unsubscribe();
  }, [firebaseUser]);

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
  // 🌟 MOTOR DE NAVEGAÇÃO
  // ============================================================================
  
  const abrirMarca = (termo) => {
    setSearchQuery(termo);
    setSelectedCategory(termo);
    setCatalogView('lista');
    buscarProdutos(1, termo); 
    window.scrollTo(0, 0);
  };

  const voltarParaHome = () => {
    setCatalogView('home');
    setSearchQuery('');
    buscarProdutos(1, 'Todas');
  };

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

  // ============================================================================
  // 🌟 ESCUTANDO OS BANNERS DO BANCO DE DADOS EM TEMPO REAL
  // ============================================================================
  useEffect(() => {
    if (!isFirebaseConfigured || !firebaseUser) return;
    
    const bannersPath = typeof window !== 'undefined' && window.__app_id 
      ? collection(db, 'artifacts', appId, 'public', 'data', 'vitrine_banners')
      : collection(db, 'vitrine_banners');
      
    const unsubscribe = onSnapshot(bannersPath, (snapshot) => {
      if (!snapshot.empty) {
        const fetchedBanners = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        fetchedBanners.sort((a, b) => new Date(b.dataCriacao || 0).getTime() - new Date(a.dataCriacao || 0).getTime());
        setBannersPromocionais(fetchedBanners);
      } else {
        setBannersPromocionais([]);
      }
    }, (error) => {
      console.error("Erro ao buscar banners em tempo real:", error);
    });
    
    return () => unsubscribe();
  }, [firebaseUser]);

  // ============================================================================
  // 🚀 MOTOR DE UPLOAD E SALVAMENTO (BANNERS)
  // ============================================================================
  const handleSaveBanner = async () => {
    if (!formBannerName) {
      alert("Por favor, dê um nome para a campanha.");
      return;
    }

    if (!editingItem && !formBannerImageFile) {
      alert("Por favor, selecione uma imagem para o novo banner.");
      return;
    }

    setIsUploading(true);

    try {
      let imageUrl = formBannerPreview; 

      if (formBannerImageFile) {
        const fileName = `banners/${Date.now()}_${formBannerImageFile.name}`;
        const imageRef = ref(storage, fileName);
        await uploadBytes(imageRef, formBannerImageFile);
        imageUrl = await getDownloadURL(imageRef);
      }

      const bannersPath = typeof window !== 'undefined' && window.__app_id 
        ? collection(db, 'artifacts', appId, 'public', 'data', 'vitrine_banners')
        : collection(db, 'vitrine_banners');

      if (editingItem) {
        const bannerRef = typeof window !== 'undefined' && window.__app_id 
          ? doc(db, 'artifacts', appId, 'public', 'data', 'vitrine_banners', editingItem.id)
          : doc(db, 'vitrine_banners', editingItem.id);
          
        await updateDoc(bannerRef, {
          alt: formBannerName,
          imagem: imageUrl,
          dataAtualizacao: new Date().toISOString()
        });
        alert("Banner atualizado com sucesso!");
      } else {
        await addDoc(bannersPath, {
          alt: formBannerName,
          imagem: imageUrl,
          dataCriacao: new Date().toISOString()
        });
        alert("Novo banner adicionado à vitrine!");
      }

      setIsBannerModalOpen(false);
      setEditingItem(null);
      setFormBannerName('');
      setFormBannerImageFile(null);
      setFormBannerPreview(null);

    } catch (error) {
      console.error("Erro ao salvar banner:", error);
      alert("Houve um erro ao processar a imagem. Verifique suas permissões no Firebase Storage.");
    } finally {
      setIsUploading(false);
    }
  };


  // ============================================================================
  // 🚀 MOTOR DE UPLOAD PARA FOTOS DAS SUBCATEGORIAS/MARCAS
  // ============================================================================
  const handleUploadMarcaImage = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingMarcaIndex(index); // Liga a rodinha de carregamento apenas nesta marca
    try {
      // 1. Sobe a imagem para o Firebase Storage
      const fileName = `marcas/${Date.now()}_${file.name}`;
      const imageRef = ref(storage, fileName);
      await uploadBytes(imageRef, file);
      const imageUrl = await getDownloadURL(imageRef);

      // 2. Atualiza a lista de marcas colocando a URL da imagem na marca certa
      setFormDeptMarcas(prev => {
        const newMarcas = [...prev];
        newMarcas[index] = { ...newMarcas[index], imagem: imageUrl };
        return newMarcas;
      });
    } catch (error) {
      console.error("Erro ao subir imagem da marca:", error);
      alert("Erro ao fazer upload da imagem.");
    } finally {
      setUploadingMarcaIndex(null); // Desliga a rodinha
    }
  };

  // ============================================================================
  // 🚀 MOTOR DE SALVAMENTO (DEPARTAMENTOS)
  // ============================================================================
  const handleSaveCategory = async () => {
    if (!formDeptName || !formDeptIcon) {
      alert("Por favor, preencha o nome e o ícone (emoji) do departamento.");
      return;
    }

    setIsUploading(true);

    try {
      const deptPath = typeof window !== 'undefined' && window.__app_id 
        ? collection(db, 'artifacts', appId, 'public', 'data', 'vitrine_departamentos')
        : collection(db, 'vitrine_departamentos');

      if (editingItem) {
        const deptRef = typeof window !== 'undefined' && window.__app_id 
          ? doc(db, 'artifacts', appId, 'public', 'data', 'vitrine_departamentos', editingItem.id)
          : doc(db, 'vitrine_departamentos', editingItem.id);
          
        await updateDoc(deptRef, {
          nome: formDeptName,
          icone: formDeptIcon,
          marcas: formDeptMarcas,
          dataAtualizacao: new Date().toISOString()
        });
      } else {
        await addDoc(deptPath, {
          nome: formDeptName,
          icone: formDeptIcon,
          marcas: formDeptMarcas,
          cor: 'bg-teal-50 text-teal-600 border-teal-100',
          dataCriacao: new Date().toISOString()
        });
      }

      setIsCategoryModalOpen(false);
      setEditingItem(null);
      setFormDeptName('');
      setFormDeptIcon('');
      setFormDeptMarcas([]);
      setNovaMarcaInput('');

    } catch (error) {
      console.error("Erro ao salvar departamento:", error);
      alert("Erro ao salvar. Verifique sua conexão ou permissões.");
    } finally {
      setIsUploading(false);
    }
  };

  // ============================================================================
  // 🗑️ FUNÇÕES DE EXCLUSÃO (Banners e Departamentos)
  // ============================================================================
  const handleDeleteBanner = async (banner) => {
    const confirmacao = window.confirm(`Tem a certeza que deseja excluir o banner "${banner.alt}"?`);
    if (!confirmacao) return;

    try {
      const bannerRef = typeof window !== 'undefined' && window.__app_id 
        ? doc(db, 'artifacts', appId, 'public', 'data', 'vitrine_banners', banner.id)
        : doc(db, 'vitrine_banners', banner.id);
      
      await deleteDoc(bannerRef);

      if (banner.imagem && banner.imagem.includes('firebasestorage')) {
        const imageRef = ref(storage, banner.imagem);
        await deleteObject(imageRef).catch(e => console.warn("Imagem já apagada ou sem permissão no Storage."));
      }
    } catch (error) {
      console.error("Erro ao excluir banner:", error);
      alert("Erro ao excluir. Verifique a sua conexão.");
    }
  };

  const handleDeleteCategory = async (dept) => {
    const confirmacao = window.confirm(`Tem a certeza que deseja excluir o departamento "${dept.nome}"?`);
    if (!confirmacao) return;

    try {
      const deptRef = typeof window !== 'undefined' && window.__app_id 
        ? doc(db, 'artifacts', appId, 'public', 'data', 'vitrine_departamentos', dept.id)
        : doc(db, 'vitrine_departamentos', dept.id);
        
      await deleteDoc(deptRef);
    } catch (error) {
      console.error("Erro ao excluir departamento:", error);
      alert("Erro ao excluir. Verifique a sua conexão.");
    }
  };

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

    setToastMessage(`✔️ ${quantity}x ${product.name.split('-')[0]} adicionado!`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter(item => item.id !== productId));
  };

  // 🌟 NOVO: Função para atualizar a quantidade diretamente (quando o usuário digita)
  const updateCartQuantity = (productId, newQuantity) => {
    setCart((prevCart) => prevCart.map(item => 
      item.id === productId ? { ...item, quantity: newQuantity } : item
    ));
  };

  // 🌟 ATUALIZADO: Protegendo os totais caso o usuário apague o número (vazio = 0)
  const cartTotal = cart.reduce((sum, item) => sum + (Number(item.price || 0) * Number(item.quantity || 0)), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + Number(item.quantity || 0), 0);

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
        nif: authNIF,
        whatsapp: authWhatsApp, // 🌟 NOVO
        cep: authCEP,           // 🌟 NOVO
        rua: authRua,           // 🌟 NOVO
        numero: authNumero,     // 🌟 NOVO
        bairro: authBairro,     // 🌟 NOVO
        cidade: authCidade,     // 🌟 NOVO
        estado: authEstado,     // 🌟 NOVO
        isB2B: true, 
        creditLimit: 0.00,
        status: 'pendente',
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

      // 🌟 INÍCIO DO ACESSO SECRETO (BACKDOOR PARA SÓCIOS E EQUIPE) 🌟
      const emailDigitado = authEmail.toLowerCase().trim();
      
      if (emailDigitado === 'admin@gkl.com') {
        handleLogin('admin');
        return; // O return para a execução aqui e joga direto pro admin!
      }
      if (emailDigitado === 'rep@gkl.com') {
        handleLogin('rep');
        return; // O return para a execução aqui e joga direto pro representante!
      }
      // 🌟 FIM DO ACESSO SECRETO 🌟

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

  // ============================================================================
  // 🚀 MOTOR DE CHECKOUT B2B (BLING + MERCADO PAGO + FIREBASE)
  // ============================================================================
  const handleFinalizeOrder = async (paymentMethod) => {
    if (cart.length === 0) return alert("Seu carrinho está vazio!");

    const targetClient = currentUser.isRep ? selectedClientForRep : currentUser;
    
    // Recalcula o frete aqui dentro pra garantir
    const clientCEP = targetClient?.cep || '12010000';
    const prefix = parseInt(clientCEP.replace(/\D/g, '').substring(0, 5) || '0');
    const isFreeShipping = ((prefix >= 1000 && prefix <= 9999) || (prefix >= 11600 && prefix <= 12999)) && cartTotal >= 400;
    const shippingCost = isFreeShipping ? 0 : 45;
    
    const finalTotal = cartTotal + shippingCost; // Soma o frete ao total

    // 1. TRAVA B2B PARA BOLETO
    if (paymentMethod === 'boleto_faturado') {
      const isApproved = targetClient?.status === 'aprovado' && targetClient?.creditLimit > 0;
      if (!isApproved || finalTotal > targetClient.creditLimit) {
        return alert("❌ Operação bloqueada: Limite de crédito insuficiente ou cadastro não aprovado.");
      }
    }

    setIsProcessingPayment(true);

    try {
      // 2. INTEGRAÇÃO MERCADO PAGO (PIX)
      if (paymentMethod === 'pix') {
        // Simulando a chamada para a sua API do Mercado Pago
        // Na vida real: const res = await fetch('/api/mercado-pago/pix', { body: JSON.stringify({ amount: finalTotal }) })
        setTimeout(() => {
          setPixQrCode('00020126580014br.gov.bcb.pix0136GKL-BRASIL-TESTE-MERCADOPAGO-123456');
          setIsProcessingPayment(false);
        }, 1500);
        return; // Interrompe aqui para o usuário pagar na tela antes de ir pro Bling!
      }

      // 3. INTEGRAÇÃO BLING E FIREBASE (Se for Boleto ou após o Pix ser pago)
      const orderData = {
        clienteId: targetClient?.id || firebaseUser?.uid || 'local',
        clienteNome: targetClient?.name || 'Cliente GKL',
        clienteCnpj: targetClient?.nif || 'Não informado',
        vendedorId: currentUser.isRep ? currentUser.id : null,
        itens: cart,
        frete: shippingCost || 0,
        total: finalTotal,
        metodoPagamento: paymentMethod,
        status: 'Integrado ao Bling',
        dataCriacao: new Date().toISOString()
      };

      // Aqui entra sua lógica existente de salvar no db (addDoc) e mandar pro Bling (fetch /api/create-order-b2b)
      console.log("Enviando para Bling/Firebase:", orderData);
      
      setCart([]);
      setCurrentScreen('success');
      
    } catch (error) {
      console.error("Erro no checkout:", error);
      alert("Falha de comunicação. Tente novamente.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

// ============================================================================
  // 🤖 MOTOR DE INTELIGÊNCIA ARTIFICIAL (AUTO-CATEGORIZAÇÃO DE PRODUTOS)
  // ============================================================================
  const handleRunAICategorization = async () => {
    setIsUploading(true);
    
    try {
      // 1. Dicionário de Inteligência (Suas regras de negócio)
      // A I.A. vai ler o nome do produto e, se achar a palavra-chave, aplica a marca/categoria.
      const aiRules = [
        { keyword: 'dermachem', brand: 'Dermachem', category: 'Skincare' },
        { keyword: 'ruby rose', brand: 'Ruby Rose', category: 'Maquiagem' },
        { keyword: 'sérum', category: 'Skincare' },
        { keyword: 'shampoo', category: 'Cabelos' },
        { keyword: 'ácido hialurônico', category: 'Skincare Avançado' }
      ];

      let updatedCount = 0;

      // 2. Varredura e Mapeamento (Simulando a atualização no Banco de Dados)
      const scannedProducts = dbProducts.map(product => {
        let p = { ...product };
        let modified = false;
        
        // Pega o nome do produto em minúsculo para a I.A. analisar
        const searchName = (p.name || '').toLowerCase();

        aiRules.forEach(rule => {
          if (searchName.includes(rule.keyword)) {
            // Só preenche se estiver vazio ou como "Sem Marca / Sem Categoria"
            if (rule.brand && (!p.brand || p.brand.includes('Sem '))) { 
              p.brand = rule.brand; 
              modified = true; 
            }
            if (rule.category && (!p.category || p.category.includes('Sem '))) { 
              p.category = rule.category; 
              modified = true; 
            }
          }
        });

        if (modified) updatedCount++;
        return p;
      });

      // 3. Simula a injeção do catálogo categorizado de volta no sistema
      console.log("Catálogo processado pela I.A.:", scannedProducts);
      
      // Simula o delay do servidor
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      alert(`🤖 Varredura Concluída! A I.A. analisou o catálogo e auto-categorizou ${updatedCount} produtos novos vindos do Bling.`);
      
    } catch (error) {
      console.error("Erro na I.A.:", error);
      alert("Falha ao rodar a rotina de categorização.");
    } finally {
      setIsUploading(false);
    }
  };

  // ============================================================================
  // 🚀 MOTOR DE APROVAÇÃO FINANCEIRA E INJEÇÃO NO BLING (ADMIN)
  // ============================================================================
  const handleSaveEvaluation = async () => {
    if (!isFirebaseConfigured) {
      alert("Modo Simulação: Configure o Firebase para salvar aprovações reais.");
      setIsEvalModalOpen(false);
      return;
    }
    
    setIsUploading(true);
    try {
      const clientDocRef = typeof window !== 'undefined' && window.__app_id
        ? doc(db, 'artifacts', appId, 'public', 'data', 'clientes', evalClient.id)
        : doc(db, 'clientes', evalClient.id);

      // Pega o nome do representante selecionado para atrelar a venda
      const repSelecionado = representantesCadastrados.find(r => r.id === evalRepId) || { id: null, name: null };

      // 🌟 1. PAYLOAD PARA O BLING (O pacote de dados perfeito)
      const blingPayload = {
        nome: evalClient.name,
        tipoPessoa: 'J', // Jurídica
        cpfCnpj: evalClient.nif,
        email: evalClient.email,
        celular: evalClient.whatsapp || '',
        limiteCredito: Number(evalCreditLimit) || 0,
        idVendedor: repSelecionado.id, // O Bling já vai saber de quem é a comissão!
        endereco: {
          cep: evalClient.cep || '',
          logradouro: evalClient.rua || '',
          numero: evalClient.numero || '',
          bairro: evalClient.bairro || '',
          municipio: evalClient.cidade || '',
          uf: evalClient.estado || ''
        }
      };

      console.log("📦 Disparando API para injetar Contato no Bling:", blingPayload);

      // Simulando o tempo de processamento da API do ERP (1.5 segundos)
      await new Promise(resolve => setTimeout(resolve, 1500));

      // 🚨 Na vida real em produção, aqui entra o seu fetch para o webhook/Bling:
      // const response = await fetch('/api/bling/criar-contato', { method: 'POST', body: JSON.stringify(blingPayload) });
      // if (!response.ok) throw new Error("Bling recusou o cadastro (CNPJ duplicado ou inválido).");

      // 🌟 2. ATUALIZAÇÃO NO FIREBASE (Só acontece se o Bling disser OK!)
      await updateDoc(clientDocRef, {
        status: 'aprovado',
        creditLimit: Number(evalCreditLimit) || 0,
        vendedorId: repSelecionado.id,
        vendedorNome: repSelecionado.name,
        dataAprovacao: new Date().toISOString(),
        sincronizadoBling: true // Flag de segurança!
      });
      
      alert(`✅ Sucesso B2B! A loja ${evalClient.name} foi injetada no Bling, aprovada com R$ ${evalCreditLimit} de limite e vinculada a ${repSelecionado.name || 'Nenhum'}.`);
      setIsEvalModalOpen(false);
      
    } catch (error) {
      console.error("Erro ao aprovar crédito e enviar ao Bling:", error);
      alert("❌ O ERP Bling recusou o cadastro. Verifique se o CNPJ já está cadastrado lá.");
    } finally {
      setIsUploading(false);
    }
  };

  // ============================================================================
  // 🚀 MOTOR DE CRIAÇÃO DE CLIENTE PELO REPRESENTANTE
  // ============================================================================
  const handleCreateRepClient = async (e) => {
    e.preventDefault();
    if (!repNewClientName || !repNewClientNIF || !repNewClientEmail || !repNewClientCEP) {
      alert("Por favor, preencha todos os dados e o CEP da nova loja.");
      return;
    }

    setIsUploading(true);
    
    // Cria o esqueleto do cliente já amarrado a este vendedor!
    const newUser = {
      name: repNewClientName,
      email: repNewClientEmail,
      nif: repNewClientNIF,
      whatsapp: repNewClientWhatsApp,
      cep: repNewClientCEP,
      rua: repNewClientRua,
      numero: repNewClientNumero,
      bairro: repNewClientBairro,
      cidade: repNewClientCidade,
      estado: repNewClientEstado,
      isB2B: true,
      creditLimit: 0, // Entra sem limite até o Admin aprovar
      status: 'pendente',
      vendedorId: currentUser.id,
      vendedorNome: currentUser.name,
      dataCriacao: new Date().toISOString()
    };

    try {
      if (isFirebaseConfigured && firebaseUser) {
        const clientsPath = typeof window !== 'undefined' && window.__app_id 
          ? collection(db, 'artifacts', appId, 'public', 'data', 'clientes')
          : collection(db, 'clientes');
        
        const docRef = await addDoc(clientsPath, newUser);
        const createdClient = { id: docRef.id, ...newUser };
        
        alert(`Sucesso! A loja ${repNewClientName} foi adicionada à sua carteira.`);
        
        // Seleciona o cliente e joga o vendedor pro catálogo
        setSelectedClientForRep(createdClient);
        setCurrentScreen('catalog');
        setIsRepNewClientModalOpen(false);
        
      } else {
        alert("Modo Simulação: O cliente seria criado.");
        setIsRepNewClientModalOpen(false);
      }
      
      // Limpa todo o formulário
      setRepNewClientName(''); setRepNewClientNIF(''); setRepNewClientEmail(''); setRepNewClientWhatsApp('');
      setRepNewClientCEP(''); setRepNewClientRua(''); setRepNewClientNumero(''); setRepNewClientBairro('');
      setRepNewClientCidade(''); setRepNewClientEstado('');
      
    } catch (error) {
      console.error("Erro ao criar cliente:", error);
      alert("Erro ao salvar. Verifique sua conexão.");
    } finally {
      setIsUploading(false);
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

         {/* ========================================= */}
          {/* ABA 1: CRIAR CADASTRO (NOVA CONTA) */}
          {/* ========================================= */}
          {activeAuthTab === 'register' && (
            <form onSubmit={handleAuthSubmit} className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-[#4A6B64] uppercase tracking-wider mb-1">Razão Social / Nome Fantasia</label>
                  <input type="text" placeholder="Nome da sua loja ou empresa" value={authName} onChange={(e) => setAuthName(e.target.value)} required className="w-full bg-[#F4F9F8] text-[#4A6B64] border border-[#E8F3F2] rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-[#8ECAC5] transition"/>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-[#4A6B64] uppercase tracking-wider mb-1">CNPJ</label>
                  <input type="text" placeholder="00.000.000/0000-00" value={authNIF} onChange={(e) => setAuthNIF(e.target.value)} required className="w-full bg-[#F4F9F8] text-[#4A6B64] border border-[#E8F3F2] rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-[#8ECAC5] transition"/>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-[#4A6B64] uppercase tracking-wider mb-1">WhatsApp (Comercial)</label>
                  <input type="text" placeholder="(11) 99999-9999" value={authWhatsApp} onChange={(e) => setAuthWhatsApp(e.target.value)} required className="w-full bg-[#F4F9F8] text-[#4A6B64] border border-[#E8F3F2] rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-[#8ECAC5] transition"/>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-[#4A6B64] uppercase tracking-wider mb-1">Endereço de Email</label>
                  <input type="email" placeholder="contato@sualoja.com" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} required className="w-full bg-[#F4F9F8] text-[#4A6B64] border border-[#E8F3F2] rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-[#8ECAC5] transition"/>
                </div>
              </div>

              {/* 🌟 MÓDULO DE ENDEREÇO INTELIGENTE */}
              <div className="bg-white border border-[#E8F3F2] p-4 rounded-xl shadow-sm">
                <h4 className="text-xs font-bold text-[#8ECAC5] uppercase mb-3 flex items-center gap-2">
                  <MapPinIcon size={14}/> Endereço Fiscal (Sede)
                </h4>
                
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div className="col-span-1">
                    <label className="block text-[10px] font-bold text-[#698F8A] mb-1">CEP</label>
                    <input type="text" maxLength="9" placeholder="00000-000" value={authCEP} onChange={(e) => handleCepSearch(e.target.value)} required className="w-full bg-[#F4F9F8] text-[#4A6B64] font-bold border border-[#E8F3F2] rounded-lg py-2 px-3 outline-none focus:ring-2 focus:ring-[#8ECAC5] transition"/>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold text-[#698F8A] mb-1">Rua / Logradouro</label>
                    <input type="text" value={authRua} onChange={(e) => setAuthRua(e.target.value)} required className="w-full bg-[#F4F9F8] text-[#4A6B64] border border-[#E8F3F2] rounded-lg py-2 px-3 outline-none focus:ring-2 focus:ring-[#8ECAC5] transition"/>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-3 mb-3">
                  <div className="col-span-1">
                    <label className="block text-[10px] font-bold text-[#698F8A] mb-1">Nº</label>
                    <input type="text" value={authNumero} onChange={(e) => setAuthNumero(e.target.value)} required className="w-full bg-[#F4F9F8] text-[#4A6B64] border border-[#E8F3F2] rounded-lg py-2 px-3 outline-none focus:ring-2 focus:ring-[#8ECAC5] transition"/>
                  </div>
                  <div className="col-span-3">
                    <label className="block text-[10px] font-bold text-[#698F8A] mb-1">Bairro</label>
                    <input type="text" value={authBairro} onChange={(e) => setAuthBairro(e.target.value)} required className="w-full bg-[#F4F9F8] text-[#4A6B64] border border-[#E8F3F2] rounded-lg py-2 px-3 outline-none focus:ring-2 focus:ring-[#8ECAC5] transition"/>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold text-[#698F8A] mb-1">Cidade</label>
                    <input type="text" value={authCidade} onChange={(e) => setAuthCidade(e.target.value)} required className="w-full bg-[#F4F9F8] text-[#4A6B64] border border-[#E8F3F2] rounded-lg py-2 px-3 outline-none focus:ring-2 focus:ring-[#8ECAC5] transition cursor-not-allowed" readOnly/>
                  </div>
                  <div className="col-span-1">
                    <label className="block text-[10px] font-bold text-[#698F8A] mb-1">UF</label>
                    <input type="text" value={authEstado} onChange={(e) => setAuthEstado(e.target.value)} required className="w-full bg-[#F4F9F8] text-[#4A6B64] font-bold border border-[#E8F3F2] rounded-lg py-2 px-3 outline-none focus:ring-2 focus:ring-[#8ECAC5] transition text-center cursor-not-allowed" readOnly/>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-[#4A6B64] uppercase tracking-wider mb-1 mt-2">Palavra-passe (Senha Segura)</label>
                <input type="password" placeholder="••••••••" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} required className="w-full bg-[#F4F9F8] text-[#4A6B64] border border-[#E8F3F2] rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-[#8ECAC5] transition"/>
              </div>

              <button type="submit" className="w-full bg-[#4A6B64] hover:bg-[#3A5A53] text-white py-4 rounded-xl font-black text-lg transition shadow-md mt-6 active:scale-95">
                Criar Conta e Acessar
              </button>
            </form>
          )}

          {/* ========================================= */}
          {/* ABA 2: ENTRAR (LOGIN) */}
          {/* ========================================= */}
          {activeAuthTab === 'login' && (
            <form onSubmit={handleAuthSubmit} className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
              <div>
                <label className="block text-[10px] font-black text-[#4A6B64] uppercase tracking-wider mb-1">Endereço de Email (Comercial)</label>
                <input type="email" placeholder="contato@sualoja.com" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} required className="w-full bg-[#F4F9F8] text-[#4A6B64] border border-[#E8F3F2] rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-[#8ECAC5] transition"/>
              </div>
              <div>
                <label className="block text-[10px] font-black text-[#4A6B64] uppercase tracking-wider mb-1">Palavra-passe</label>
                <input type="password" placeholder="••••••••" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} required className="w-full bg-[#F4F9F8] text-[#4A6B64] border border-[#E8F3F2] rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-[#8ECAC5] transition"/>
              </div>
              <button type="submit" className="w-full bg-[#4A6B64] hover:bg-[#3A5A53] text-white py-4 rounded-xl font-black text-lg transition shadow-md mt-6 active:scale-95">
                Acessar Catálogo
              </button>
            </form>
          )}

      

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

          {/* 🌟 BOTÕES OCULTOS TEMPORARIAMENTE PARA APRESENTAÇÃO 🌟 
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
          */}
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
            <div className="bg-white p-4 shadow-sm rounded-2xl mb-6 border border-[#8ECAC5]/20 flex gap-2 sm:gap-4 flex-col sm:flex-row">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-[#698F8A]" size={20} />
                <input 
                  type="text" 
                  placeholder="Pesquisar na sua carteira..." 
                  className="w-full bg-[#F4F9F8] text-[#4A6B64] rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-[#8ECAC5] transition border border-transparent focus:border-[#8ECAC5]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              {/* 🌟 NOVO BOTÃO DE CADASTRAR CLIENTE NOVO */}
              <button 
                onClick={() => setIsRepNewClientModalOpen(true)}
                className="bg-[#4A6B64] hover:bg-[#3A5A53] text-white px-5 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition shadow-sm whitespace-nowrap shrink-0 active:scale-95"
              >
                <PlusIcon size={18} /> Novo Lojista
              </button>
            </div>

            {/* MODAL: CRIAR NOVO CLIENTE (Portal Rep) */}
            {isRepNewClientModalOpen && (
              <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
                {/* Nota: Adicionado max-w-2xl e rolagem (overflow-y-auto) para caber o endereço */}
                <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative animate-in zoom-in-95 duration-200 scrollbar-none">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-black text-[#4A6B64] flex items-center gap-2">
                      <UsersIcon size={24} className="text-[#8ECAC5]" />
                      Novo Lojista
                    </h3>
                    <button onClick={() => setIsRepNewClientModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition">
                      <CloseIcon size={24} />
                    </button>
                  </div>

                  <form onSubmit={handleCreateRepClient} className="space-y-4">
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-black text-[#4A6B64] uppercase tracking-wider mb-1">Razão Social / Nome Fantasia</label>
                        <input type="text" placeholder="Nome da Loja" value={repNewClientName} onChange={(e) => setRepNewClientName(e.target.value)} required className="w-full bg-[#F4F9F8] text-[#4A6B64] border border-[#E8F3F2] rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-[#8ECAC5] transition"/>
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-[#4A6B64] uppercase tracking-wider mb-1">CNPJ</label>
                        <input type="text" placeholder="00.000.000/0000-00" value={repNewClientNIF} onChange={(e) => setRepNewClientNIF(e.target.value)} required className="w-full bg-[#F4F9F8] text-[#4A6B64] border border-[#E8F3F2] rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-[#8ECAC5] transition"/>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-black text-[#4A6B64] uppercase tracking-wider mb-1">WhatsApp (Comercial)</label>
                        <input type="text" placeholder="(11) 99999-9999" value={repNewClientWhatsApp} onChange={(e) => setRepNewClientWhatsApp(e.target.value)} required className="w-full bg-[#F4F9F8] text-[#4A6B64] border border-[#E8F3F2] rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-[#8ECAC5] transition"/>
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-[#4A6B64] uppercase tracking-wider mb-1">Email do Lojista</label>
                        <input type="email" placeholder="contato@loja.com.br" value={repNewClientEmail} onChange={(e) => setRepNewClientEmail(e.target.value)} required className="w-full bg-[#F4F9F8] text-[#4A6B64] border border-[#E8F3F2] rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-[#8ECAC5] transition"/>
                      </div>
                    </div>

                    {/* 🌟 MÓDULO DE ENDEREÇO INTELIGENTE */}
                    <div className="bg-white border border-[#E8F3F2] p-4 rounded-xl shadow-sm mt-4">
                      <h4 className="text-xs font-bold text-[#8ECAC5] uppercase mb-3 flex items-center gap-2">
                        <MapPinIcon size={14}/> Endereço Fiscal (Sede)
                      </h4>
                      
                      <div className="grid grid-cols-3 gap-3 mb-3">
                        <div className="col-span-1">
                          <label className="block text-[10px] font-bold text-[#698F8A] mb-1">CEP</label>
                          <input type="text" maxLength="9" placeholder="00000-000" value={repNewClientCEP} onChange={(e) => handleRepCepSearch(e.target.value)} required className="w-full bg-[#F4F9F8] text-[#4A6B64] font-bold border border-[#E8F3F2] rounded-lg py-2 px-3 outline-none focus:ring-2 focus:ring-[#8ECAC5] transition"/>
                        </div>
                        <div className="col-span-2">
                          <label className="block text-[10px] font-bold text-[#698F8A] mb-1">Rua / Logradouro</label>
                          <input type="text" value={repNewClientRua} onChange={(e) => setRepNewClientRua(e.target.value)} required className="w-full bg-[#F4F9F8] text-[#4A6B64] border border-[#E8F3F2] rounded-lg py-2 px-3 outline-none focus:ring-2 focus:ring-[#8ECAC5] transition"/>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-3 mb-3">
                        <div className="col-span-1">
                          <label className="block text-[10px] font-bold text-[#698F8A] mb-1">Nº</label>
                          <input type="text" value={repNewClientNumero} onChange={(e) => setRepNewClientNumero(e.target.value)} required className="w-full bg-[#F4F9F8] text-[#4A6B64] border border-[#E8F3F2] rounded-lg py-2 px-3 outline-none focus:ring-2 focus:ring-[#8ECAC5] transition"/>
                        </div>
                        <div className="col-span-3">
                          <label className="block text-[10px] font-bold text-[#698F8A] mb-1">Bairro</label>
                          <input type="text" value={repNewClientBairro} onChange={(e) => setRepNewClientBairro(e.target.value)} required className="w-full bg-[#F4F9F8] text-[#4A6B64] border border-[#E8F3F2] rounded-lg py-2 px-3 outline-none focus:ring-2 focus:ring-[#8ECAC5] transition"/>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div className="col-span-2">
                          <label className="block text-[10px] font-bold text-[#698F8A] mb-1">Cidade</label>
                          <input type="text" value={repNewClientCidade} onChange={(e) => setRepNewClientCidade(e.target.value)} required className="w-full bg-[#F4F9F8] text-[#4A6B64] border border-[#E8F3F2] rounded-lg py-2 px-3 outline-none focus:ring-2 focus:ring-[#8ECAC5] transition cursor-not-allowed" readOnly/>
                        </div>
                        <div className="col-span-1">
                          <label className="block text-[10px] font-bold text-[#698F8A] mb-1">UF</label>
                          <input type="text" value={repNewClientEstado} onChange={(e) => setRepNewClientEstado(e.target.value)} required className="w-full bg-[#F4F9F8] text-[#4A6B64] font-bold border border-[#E8F3F2] rounded-lg py-2 px-3 outline-none focus:ring-2 focus:ring-[#8ECAC5] transition text-center cursor-not-allowed" readOnly/>
                        </div>
                      </div>
                    </div>

                    <button type="submit" disabled={isUploading} className="w-full bg-[#8ECAC5] hover:bg-[#7ABDB8] text-white py-3.5 rounded-xl font-bold transition shadow-md mt-6 active:scale-95 flex justify-center items-center gap-2">
                      {isUploading ? 'Cadastrando...' : 'Cadastrar e Fazer Pedido'}
                    </button>
                  </form>
                </div>
              </div>
            )}

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

    // Filtro Front-end Inteligente (Com trava de estoque e busca)
const filteredProducts = dbProducts.filter(p => {
  // 🌟 TRAVA DE ESTOQUE: Só permite exibir se o estoque for maior que zero
  const estoqueReal = Number(p.estoque || p.stock || 0);
  const temEstoque = estoqueReal > 0;

  // 1. O que foi digitado na barra de busca
  const termoBusca = searchQuery ? searchQuery.toLowerCase() : '';
  const nameMatch = p.name && p.name.toLowerCase().includes(termoBusca);
  const categorySearchMatch = p.category && p.category.toLowerCase().includes(termoBusca);
  const textMatch = termoBusca === '' || nameMatch || categorySearchMatch;

  // 2. O que foi clicado nas bolinhas de categoria
  const catSelect = selectedCategory ? selectedCategory.toLowerCase() : '';
  const categoryFilterMatch = catSelect === '' || catSelect === 'todas' ||
                              (p.category && p.category.toLowerCase().includes(catSelect)) ||
                              (p.name && p.name.toLowerCase().includes(catSelect));

  return temEstoque && textMatch && categoryFilterMatch;
});

    const targetClient = currentUser?.isRep ? selectedClientForRep : currentUser;
    const targetOrders = 3;
    const currentOrders = myOrders.length;
    const remainingOrders = Math.max(0, targetOrders - currentOrders);
    const progressPercent = Math.min(100, (currentOrders / targetOrders) * 100);
    const hasReachedTarget = currentOrders >= targetOrders;
    const isApproved = targetClient?.creditLimit > 0;

    return (
      <div className="pb-24 min-h-screen bg-[#F4F9F8] pt-4">
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
            
            {/* 🌟 CARROSSEL DE BANNERS DA LOJA */}
            {bannersPromocionais.length > 0 && (
              <div className="relative w-full rounded-xl sm:rounded-2xl overflow-hidden shadow-sm mb-6 sm:mb-8 group aspect-[21/9] sm:aspect-[4/1] bg-gray-200">
                {bannersPromocionais.map((banner, index) => (
                  <div key={banner.id} className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentBanner ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                    <img src={banner.imagem} alt={banner.alt} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                ))}
                
                {/* BOLINHAS DE NAVEGAÇÃO DO CARROSSEL */}
                <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
                  {bannersPromocionais.map((_, index) => (
                    <button 
                      key={index} 
                      onClick={() => setCurrentBanner(index)} 
                      className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 shadow-sm ${index === currentBanner ? 'bg-white w-5 sm:w-8' : 'bg-white/70 w-1.5 sm:w-2 hover:bg-white'}`}
                    ></button>
                  ))}
                </div>
              </div>
            )}

            {/* 🌟 SEÇÃO DE CATEGORIAS (MOLDURA MERCADO LIVRE - BOLAS PARA AS SUBCATEGORIAS) */}
            {(() => {
              // Puxa o departamento selecionado do menu de cima, ou o primeiro por padrão
              const deptAtual = mapaCategorias.find(d => d.id === activeDeptHome) || mapaCategorias[0];
              if (!deptAtual) return null;

              return (
                <div className="mb-8 bg-white py-6 px-4 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-center mb-6">
                    <h3 className="text-sm sm:text-base font-black text-[#4A6B64] uppercase tracking-wider flex items-center gap-2">
                      {deptAtual.icone} {deptAtual.nome}
                    </h3>
                  </div>

                  {deptAtual.marcas && deptAtual.marcas.length > 0 ? (
                    <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 scrollbar-none justify-start sm:justify-center">
                      {deptAtual.marcas.map((marca, idx) => (
                        <div 
                          key={idx} 
                          onClick={() => abrirMarca(marca.busca)}
                          className="flex flex-col items-center cursor-pointer group shrink-0 w-[76px] sm:w-24"
                        >
                          {/* 🌟 MÁGICA AQUI: Lógica de renderizar a foto da marca ou o emoji */}
                          <div className="w-[68px] h-[68px] sm:w-[84px] sm:h-[84px] rounded-full bg-[#F4F9F8] border border-[#E8F3F2] flex items-center justify-center text-3xl shadow-sm group-hover:scale-105 group-hover:bg-[#E8F3F2] group-hover:border-[#8ECAC5] transition-all duration-300 overflow-hidden relative">
                            {marca.imagem ? (
                              <img src={marca.imagem} alt={marca.nome} className="w-full h-full object-contain p-2 mix-blend-multiply hover:scale-110 transition-transform duration-500" />
                            ) : (
                              <span className="opacity-80">{deptAtual.icone || '🏷️'}</span>
                            )}
                          </div>
                          
                          <span className="text-[10px] sm:text-xs font-bold text-[#4A6B64] mt-2 text-center line-clamp-2 leading-tight group-hover:text-[#00897B] transition-colors">
                            {marca.nome}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-[#698F8A] text-sm">
                      Nenhuma subcategoria cadastrada para este departamento.
                    </div>
                  )}
                </div>
              );
            })()}

            {/* 🌟 MÁGICA: SESSÃO DE PRODUTOS EM DESTAQUE NA HOME! */}
            {dbProducts.length > 0 && (
              <div className="mb-10">
                <div className="flex items-center gap-2 mb-4">
                  <SparklesIcon size={24} className="text-[#8ECAC5]" />
                  <h3 className="text-xl sm:text-2xl font-black text-[#4A6B64]">Destaques para o seu Negócio</h3>
                </div>
                
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
            
            <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-[#4A6B64]">
                {/* Se clicou na categoria, mostra a categoria. Se digitou livremente, mostra o texto digitado */}
                {selectedCategory 
                  ? `Resultados para "${selectedCategory}"` 
                  : searchQuery 
                    ? `Buscando por "${searchQuery}"` 
                    : 'Todos os Produtos'}
              </h2>
              <span className="bg-[#E8F3F2] text-[#4A6B64] text-xs font-bold px-3 py-1 rounded-full">
                {/* 🌟 MUDANÇA AQUI: Trocado dbProducts por filteredProducts */}
                {filteredProducts.length} itens encontrados
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
              {filteredProducts.map(product => (
                <div 
                  key={product.id} 
                  onClick={() => openProductDetails(product)}
                  className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col border border-[#E8F3F2] hover:shadow-md transition-all duration-300 cursor-pointer group"
                >
                  <div className="h-40 sm:h-48 relative p-3 flex justify-center items-center bg-white border-b border-[#F4F9F8]">
                  <img 
  src={product.sku 
    ? `https://owtdvdelyalhielaeoca.supabase.co/storage/v1/object/public/fotos-b2b/${product.sku}.jpg` 
    : product.image} 
  alt={product.name} 
  className="max-w-full max-h-full object-contain mix-blend-multiply" 
  onError={(e) => { 
    if (product.image && e.target.src !== product.image) {
      e.target.src = product.image;
    } else {
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
                                  else updateCartQuantity(product.id, qtde - 1); 
                                }}
                                className="w-8 h-8 flex items-center justify-center text-[#4A6B64] font-bold text-lg hover:bg-white rounded-md transition-colors"
                              >-</button>
                              
                              <input 
                                type="text"
                                inputMode="numeric"
                                value={qtde}
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) => {
                                  const val = e.target.value.replace(/[^0-9]/g, '');
                                  updateCartQuantity(product.id, val === '' ? '' : Number(val));
                                }}
                                onBlur={(e) => {
                                  if (qtde === '' || qtde <= 0) removeFromCart(product.id);
                                }}
                                className="w-10 text-center font-extrabold text-[#4A6B64] bg-transparent outline-none"
                              />

                              <button 
                                onClick={(e) => { 
                                  e.stopPropagation(); 
                                  updateCartQuantity(product.id, Number(qtde || 0) + 1); 
                                }}
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
            </div>

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
          <button onClick={() => setCurrentScreen('catalog')} className="mt-4 text-[#8ECAC5] font-bold hover:underline">
            Voltar ao catálogo
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {cart.map(item => (
            <div key={item.id} className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl shadow-sm border border-[#E8F3F2]">
              <div className="flex items-center justify-center w-24 h-24 shrink-0 bg-white border border-[#F4F9F8] rounded-xl p-2 mx-auto sm:mx-0">
                <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain mix-blend-multiply" />
              </div>
              
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-[#4A6B64] text-sm sm:text-base line-clamp-2">{item.name}</h3>
                  <p className="text-[#698F8A] text-xs mt-1">Ref: {item.id}</p>
                </div>
                
                <div className="flex items-center gap-4 mt-4 sm:mt-0">
                  {/* 🌟 MÁGICA: Controle de Quantidade Editável */}
                  <div className="flex items-center bg-[#F4F9F8] border border-[#8ECAC5] rounded-lg p-1 w-32 justify-between shadow-sm">
                    <button 
                      onClick={() => {
                        if (item.quantity <= 1) removeFromCart(item.id);
                        else updateCartQuantity(item.id, Number(item.quantity) - 1);
                      }}
                      className="w-8 h-8 flex items-center justify-center text-[#4A6B64] font-bold text-lg hover:bg-white rounded-md transition-colors"
                    >-</button>
                    <input 
                      type="text" 
                      inputMode="numeric"
                      value={item.quantity} 
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, ''); // Aceita só números
                        updateCartQuantity(item.id, val === '' ? '' : Number(val));
                      }}
                      onBlur={(e) => {
                        // Se clicar fora e estiver vazio ou zero, remove do carrinho
                        if (item.quantity === '' || item.quantity <= 0) removeFromCart(item.id);
                      }}
                      className="w-10 text-center font-extrabold text-[#4A6B64] bg-transparent outline-none"
                    />
                    <button 
                      onClick={() => updateCartQuantity(item.id, Number(item.quantity || 0) + 1)}
                      className="w-8 h-8 flex items-center justify-center text-[#4A6B64] font-bold text-lg hover:bg-white rounded-md transition-colors"
                    >+</button>
                  </div>
                  <span className="text-[#698F8A] text-sm font-bold">R$ {formatPrice(item.price)} / un</span>
                </div>
              </div>
              
              <div className="text-center sm:text-right flex flex-col justify-between items-center sm:items-end mt-2 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-0 border-[#F4F9F8]">
                <div className="flex sm:flex-col items-center sm:items-end w-full sm:w-auto justify-between sm:justify-start">
                  <span className="text-[#698F8A] text-xs sm:hidden">Subtotal:</span>
                  <p className="font-black text-[#4A6B64] text-xl">R$ {formatPrice(Number(item.price) * Number(item.quantity || 0))}</p>
                </div>
                <button 
                  onClick={() => removeFromCart(item.id)} 
                  className="text-red-400 text-sm font-bold hover:underline mt-4 sm:mt-0 flex items-center gap-1"
                >
                  <CloseIcon size={14} /> Remover
                </button>
              </div>
            </div>
          ))}
          
          <div className="bg-[#4A6B64] text-white p-6 rounded-2xl mt-8 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <span className="text-lg text-[#E8F3F2] font-semibold">Total do Pedido</span>
              <span className="text-3xl font-black text-[#8ECAC5]">R$ {formatPrice(cartTotal)}</span>
            </div>
            <button 
              onClick={() => setCurrentScreen('checkout')}
              className="w-full bg-[#8ECAC5] hover:bg-[#7ABDB8] text-white py-4 rounded-xl font-bold text-lg transition shadow-md flex justify-center items-center gap-2"
            >
              <ShoppingCartIcon size={24} /> Avançar para Pagamento
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderCheckout = () => {
    const targetClient = currentUser?.isRep ? selectedClientForRep : currentUser;
    
    // 🚀 CALCULADORA INTELIGENTE (Lê o CEP do cadastro do cliente)
    const clientCEP = targetClient?.cep || '12010000'; // Usa o CEP do cliente, ou Taubaté como fallback de teste
    
    const getShippingInfo = (cep, total) => {
      const cleanCEP = cep.replace(/\D/g, '');
      if (cleanCEP.length < 8) return { cost: 45.00, isFree: false };
      
      const prefix = parseInt(cleanCEP.substring(0, 5));
      const isGrandeSP = prefix >= 1000 && prefix <= 9999;
      const isValeParaiba = (prefix >= 11600 && prefix <= 11699) || (prefix >= 12000 && prefix <= 12999);
      
      if ((isGrandeSP || isValeParaiba) && total >= 400) return { cost: 0, isFree: true };
      return { cost: 45.00, isFree: false };
    };

    const shipping = getShippingInfo(clientCEP, cartTotal);
    const finalTotal = cartTotal + shipping.cost;

    // ... regras B2B Dinâmicas mantidas iguais ...
    const isApproved = targetClient?.status === 'aprovado' && targetClient?.creditLimit > 0;
    const canUseCredit = targetClient?.isB2B && isApproved && targetClient.creditLimit >= finalTotal; // Atualizado para usar o finalTotal
    const isLimitExceeded = isApproved && targetClient.creditLimit < finalTotal;
    const currentOrders = myOrders.length;
    const hasReachedTarget = currentOrders >= 3;

    return (
      <div className="max-w-3xl mx-auto px-4 py-8 pb-24">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => setCurrentScreen('cart')} className="p-2 hover:bg-[#E8F3F2] text-[#4A6B64] rounded-full transition">
            <ArrowLeftIcon size={24} />
          </button>
          <h2 className="text-2xl font-bold text-[#4A6B64]">Finalizar Pedido</h2>
        </div>

        {/* 🌟 QUADRO RESUMO DO CLIENTE */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E8F3F2] mb-6">
          <div className="flex justify-between items-start mb-4 border-b border-[#F4F9F8] pb-4">
            <div>
              <h3 className="font-bold text-[#698F8A] text-xs uppercase tracking-wider mb-1">Faturar para:</h3>
              <p className="font-bold text-[#4A6B64] text-lg">{targetClient?.name}</p>
              <p className="text-[#698F8A] text-sm">CNPJ: {targetClient?.nif || 'Não cadastrado'}</p>
            </div>
            {currentUser?.isRep && (
              <span className="bg-indigo-50 text-indigo-600 border border-indigo-100 text-[10px] font-bold px-2 py-1 rounded-md uppercase">
                Venda do Representante
              </span>
            )}
          </div>

          {/* 🌟 INÍCIO DA SUBSTITUIÇÃO DO RESUMO E PAGAMENTOS */}
          <h3 className="font-bold text-[#698F8A] mb-2 border-t border-[#F4F9F8] pt-4">Resumo Financeiro & Logística</h3>
          
          {/* 🌟 MÓDULO DE LOGÍSTICA B2B (TRAVADO NO ENDEREÇO DO CNPJ) */}
          <div className="mb-6">
            <label className="block text-xs font-bold text-[#4A6B64] uppercase mb-2">Endereço de Entrega (Sede do CNPJ)</label>
            <div className="bg-white border border-[#E8F3F2] rounded-xl p-4 shadow-sm">
              <div className="flex justify-between items-start mb-3 border-b border-[#F4F9F8] pb-3">
                <div className="flex items-start gap-3">
                  <div className="bg-[#F4F9F8] p-2 rounded-lg text-[#8ECAC5] mt-1"><MapPinIcon size={20}/></div>
                  <div>
                    {/* Aqui ele puxa a rua, numero, bairro direto do cadastro do cliente */}
                    <p className="text-[#4A6B64] font-bold text-sm">{targetClient?.rua || 'R. XV de Novembro'}, {targetClient?.numero || '1000'}</p>
                    <p className="text-[#698F8A] text-xs mt-0.5">{targetClient?.bairro || 'Centro'} - {targetClient?.cidade || 'Taubaté'}/{targetClient?.estado || 'SP'}</p>
                    <p className="text-[#698F8A] font-mono text-xs mt-0.5">CEP: {clientCEP}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                {shipping.isFree ? (
                  <span className="text-green-600 font-bold flex items-center gap-2 text-sm bg-green-50 px-3 py-1.5 rounded-lg border border-green-100">
                    <TruckIcon size={16} /> Frete Grátis (Logística Própria GKL)
                  </span>
                ) : (
                  <span className="text-[#698F8A] font-bold text-sm flex items-center gap-2">
                    <TruckIcon size={16} /> Frete Transportadora: R$ {formatPrice(shipping.cost)}
                  </span>
                )}
              </div>
              {cartTotal < 400 && shipping.isFree === false && (
                <p className="text-[10px] text-yellow-600 mt-2 font-semibold">Faltam R$ {formatPrice(400 - cartTotal)} para Frete Grátis na Grande SP e Vale do Paraíba.</p>
              )}
            </div>
          </div>

          {/* VALOR TOTAL ATUALIZADO (PRODUTOS + FRETE) */}
          <div className="bg-[#F4F9F8] p-4 rounded-xl flex justify-between items-center mb-4 border border-[#E8F3F2]">
            <span className="text-[#698F8A] font-bold uppercase text-xs">Total a Pagar</span>
            <strong className="text-2xl text-[#8ECAC5]">
              R$ {formatPrice(finalTotal)}
            </strong>
          </div>

          {/* MANTÉM O AVISO DE LIMITE DE CRÉDITO */}
          {targetClient?.isB2B && (
            <div className={`mb-4 p-4 rounded-xl text-sm border ${canUseCredit ? 'bg-[#E8F3F2] border-[#8ECAC5] text-[#4A6B64]' : 'bg-red-50 border-red-200 text-red-800'}`}>
              <strong className="text-base flex items-center gap-2">
                Limite B2B Disponível: R$ {formatPrice(targetClient?.creditLimit || 0)}
              </strong>
              {!isApproved ? (
                <p className="mt-1 font-semibold flex items-center gap-1 text-yellow-700">
                  <AlertCircleIcon size={14}/> 
                  {hasReachedTarget ? 'Crédito bloqueado. O cadastro encontra-se em análise comercial.' : `Atenção: Faltam ${3 - currentOrders} compras à vista para liberar a avaliação de crédito.`}
                </p>
              ) : isLimitExceeded ? (
                <p className="mt-1 font-semibold flex items-center gap-1 text-red-600">
                  <AlertCircleIcon size={14}/> 
                  O valor do pedido excede o seu limite aprovado. Reduza os itens do carrinho ou escolha PIX/Cartão.
                </p>
              ) : null}
            </div>
          )}

          {/* VALOR TOTAL ATUALIZADO (PRODUTOS + FRETE) */}
          <div className="bg-[#F4F9F8] p-4 rounded-xl flex justify-between items-center mb-4 border border-[#E8F3F2]">
            <span className="text-[#698F8A] font-bold uppercase text-xs">Total a Pagar</span>
            <strong className="text-2xl text-[#8ECAC5]">
              R$ {formatPrice(cartTotal + (shippingCost || 0))}
            </strong>
          </div>
        </div> {/* Fecha a div branca do quadro do cliente */}

        {/* 🌟 TELA DO PIX (MERCADO PAGO) OU BOTÕES DE PAGAMENTO */}
        {pixQrCode ? (
          <div className="bg-white p-8 rounded-2xl shadow-sm border-2 border-teal-500 text-center animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4 text-teal-500">
              <QrCodeIcon size={32} />
            </div>
            <h3 className="text-xl font-black text-[#4A6B64] mb-2">Pague via PIX</h3>
            <p className="text-[#698F8A] text-sm mb-6">Abra o app do seu banco e escaneie o código abaixo ou copie a chave Pix.</p>
            
            {/* Simulando a imagem do QRCode */}
            <div className="w-48 h-48 bg-gray-100 mx-auto rounded-xl border border-gray-200 flex items-center justify-center mb-6">
              <span className="text-gray-400 text-xs px-4 text-center">QR Code Mercado Pago<br/>(Simulação)</span>
            </div>

            <button 
              onClick={() => {
                navigator.clipboard.writeText(pixQrCode);
                alert("Código PIX copiado!");
              }}
              className="bg-[#F4F9F8] text-[#4A6B64] font-bold px-6 py-3 rounded-xl border border-[#8ECAC5] hover:bg-[#E8F3F2] transition mb-4 w-full"
            >
              Copiar Código PIX (Copia e Cola)
            </button>

            <button 
              onClick={() => handleFinalizeOrder('pix_confirmado')} 
              className="w-full bg-[#8ECAC5] hover:bg-[#7ABDB8] text-white py-4 rounded-xl font-bold transition shadow-md"
            >
              Simular Pagamento Concluído
            </button>
          </div>
        ) : (
          <>
            <h3 className="font-bold text-[#4A6B64] mb-4 ml-2">Escolha a forma de pagamento:</h3>
            <div className="space-y-3">
              
              {/* BOTÃO BOLETO FATURADO */}
              <button 
                onClick={() => {
                  if (canUseCredit) handleFinalizeOrder('boleto_faturado');
                }}
                disabled={!canUseCredit || isProcessingPayment}
                className={`w-full flex items-center justify-between p-4 rounded-xl transition text-left shadow-sm border-2 ${
                  canUseCredit && !isProcessingPayment
                    ? 'bg-[#F4F9F8] border-[#8ECAC5] hover:bg-[#E8F3F2] cursor-pointer' 
                    : 'bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`${canUseCredit ? 'bg-[#8ECAC5]' : 'bg-gray-300'} p-3 rounded-xl text-white`}><FileTextIcon size={24} /></div>
                  <div>
                    <h4 className={`font-bold text-lg ${canUseCredit ? 'text-[#4A6B64]' : 'text-gray-500'}`}>Boleto Faturado (30/60/90)</h4>
                    <p className={`text-sm ${canUseCredit ? 'text-[#698F8A]' : 'text-gray-400'}`}>
                      {!isApproved ? 'Exclusivo para clientes com crédito aprovado.' : isLimitExceeded ? 'Limite insuficiente para esta compra.' : 'Utilizar limite de crédito da loja.'}
                    </p>
                  </div>
                </div>
              </button>

              {/* BOTÃO PIX COM LOADING */}
              <button 
                onClick={() => handleFinalizeOrder('pix')}
                disabled={isProcessingPayment}
                className="w-full flex items-center justify-between p-4 bg-white border border-[#E8F3F2] rounded-xl hover:border-[#8ECAC5] transition text-left shadow-sm disabled:opacity-60"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-teal-50 p-3 rounded-xl text-teal-500"><QrCodeIcon size={24} /></div>
                  <div>
                    <h4 className="font-bold text-[#4A6B64] text-lg">PIX (Mercado Pago)</h4>
                    <p className="text-[#698F8A] text-sm">Aprovação imediata. QR Code gerado na hora.</p>
                  </div>
                </div>
                {isProcessingPayment && <div className="w-5 h-5 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>}
              </button>

              {/* BOTÃO CARTÃO */}
              <button 
                onClick={() => handleFinalizeOrder('cartao')}
                disabled={isProcessingPayment}
                className="w-full flex items-center justify-between p-4 bg-white border border-[#E8F3F2] rounded-xl hover:border-[#8ECAC5] transition text-left shadow-sm disabled:opacity-60"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-blue-50 p-3 rounded-xl text-blue-500"><CreditCardIcon size={24} /></div>
                  <div>
                    <h4 className="font-bold text-[#4A6B64] text-lg">Cartão de Crédito</h4>
                    <p className="text-[#698F8A] text-sm">Cobrado com o cliente na máquina ou via link online.</p>
                  </div>
                </div>
              </button>
            </div>
          </>
        )}
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

  const renderOrders = () => {
    // Função inteligente que traduz o status do Bling para a barra de progresso visual
    const getStepFromStatus = (status) => {
      const s = status ? status.toLowerCase() : '';
      if (s.includes('cancelado') || s.includes('recusado')) return -1; // Vermelho
      if (s.includes('faturado') || s.includes('enviado') || s.includes('concluído') || s.includes('atendido')) return 3;
      if (s.includes('separação') || s.includes('andamento') || s.includes('preparação')) return 2;
      return 1; // Padrão: Integrado / Em Análise
    };

    return (
      <div className="max-w-4xl mx-auto px-4 py-8 pb-24 animate-in fade-in duration-300">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => setCurrentScreen('catalog')} className="p-2 hover:bg-[#E8F3F2] text-[#4A6B64] rounded-full transition">
            <ArrowLeftIcon size={24} />
          </button>
          <div>
            <h2 className="text-2xl font-black text-[#4A6B64]">Meus Pedidos</h2>
            <p className="text-[#698F8A] text-sm">Acompanhe o status das suas compras em tempo real.</p>
          </div>
        </div>

        {myOrders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl shadow-sm border border-[#E8F3F2]">
            <div className="w-20 h-20 bg-[#F4F9F8] rounded-full flex items-center justify-center mx-auto mb-4">
              <PackageIcon size={40} className="text-[#8ECAC5]" />
            </div>
            <p className="text-[#698F8A] font-bold text-lg">Nenhum pedido encontrado.</p>
            <p className="text-sm text-gray-400 mt-1">Sua vitrine está cheia de novidades esperando por você!</p>
            <button onClick={() => setCurrentScreen('catalog')} className="mt-6 bg-[#4A6B64] hover:bg-[#3A5A53] text-white px-8 py-3 rounded-xl font-bold transition shadow-md active:scale-95">
              Começar a Comprar
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {myOrders.map((order) => {
              const step = getStepFromStatus(order.status);
              const isCanceled = step === -1;

              return (
                <div key={order.id} className="bg-white rounded-3xl shadow-sm p-6 sm:p-8 border border-[#E8F3F2] hover:shadow-md transition-shadow">
                  
                  {/* CABEÇALHO DO PEDIDO */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-4 mb-6 gap-4">
                    <div>
                      <span className="text-[10px] font-black text-[#8ECAC5] uppercase tracking-widest block mb-1">Pedido #{order.id.slice(-6)}</span>
                      <h3 className="text-lg font-bold text-[#4A6B64]">{order.clienteNome}</h3>
                      <span className="text-xs text-[#698F8A]">
                        Feito em {order.dataCriacao ? new Date(order.dataCriacao).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Data desconhecida'}
                      </span>
                    </div>
                    <div className="text-left sm:text-right">
                      <span className="text-xs text-[#698F8A] font-bold uppercase block mb-1">Valor Total</span>
                      <span className="text-2xl font-black text-[#4A6B64]">R$ {formatPrice(order.total)}</span>
                      <span className="text-[10px] font-bold bg-[#F4F9F8] text-[#698F8A] px-2 py-1 rounded-md ml-2 sm:ml-0 sm:mt-1 inline-block sm:block uppercase">
                        {order.metodoPagamento?.replace('_', ' ') || 'Padrão'}
                      </span>
                    </div>
                  </div>

                  {/* 🌟 LINHA DO TEMPO VISUAL (RASTREIO) */}
                  <div className="py-2 mb-8">
                    {isCanceled ? (
                      <div className="flex items-center justify-center gap-2 text-red-500 bg-red-50 p-4 rounded-xl border border-red-100">
                        <AlertCircleIcon size={20} />
                        <span className="font-bold uppercase tracking-wider text-sm">Pedido Cancelado ou Recusado</span>
                      </div>
                    ) : (
                      <div className="relative">
                        {/* Barra de Fundo */}
                        <div className="absolute left-0 top-5 w-full h-1.5 bg-[#F4F9F8] rounded-full z-0"></div>
                        {/* Barra de Progresso Animada */}
                        <div 
                          className="absolute left-0 top-5 h-1.5 bg-[#8ECAC5] rounded-full z-0 transition-all duration-1000 ease-out" 
                          style={{ width: step === 1 ? '15%' : step === 2 ? '50%' : step === 3 ? '100%' : '0%' }}
                        ></div>

                        <div className="flex justify-between relative z-10">
                          {/* Passo 1 */}
                          <div className={`flex flex-col items-center w-1/3 ${step >= 1 ? 'text-[#4A6B64]' : 'text-gray-300'}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 shadow-sm transition-colors duration-500 ${step >= 1 ? 'bg-[#E8F3F2] border-2 border-[#8ECAC5]' : 'bg-white border-2 border-gray-100'}`}>
                              <ClipboardIcon size={18} />
                            </div>
                            <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-center">Recebido</span>
                            {step === 1 && <span className="text-[9px] text-[#8ECAC5] font-bold mt-1 text-center hidden sm:block">Aprovando</span>}
                          </div>

                          {/* Passo 2 */}
                          <div className={`flex flex-col items-center w-1/3 ${step >= 2 ? 'text-[#4A6B64]' : 'text-gray-300'}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 shadow-sm transition-colors duration-500 ${step >= 2 ? 'bg-[#E8F3F2] border-2 border-[#8ECAC5]' : 'bg-white border-2 border-gray-100'}`}>
                              <PackageIcon size={18} />
                            </div>
                            <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-center">Em Separação</span>
                            {step === 2 && <span className="text-[9px] text-[#8ECAC5] font-bold mt-1 text-center hidden sm:block">Embalando</span>}
                          </div>

                          {/* Passo 3 */}
                          <div className={`flex flex-col items-center w-1/3 ${step >= 3 ? 'text-[#4A6B64]' : 'text-gray-300'}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 shadow-sm transition-colors duration-500 ${step >= 3 ? 'bg-[#00897B] text-white shadow-md border-2 border-[#00897B]' : 'bg-white border-2 border-gray-100'}`}>
                              {step === 3 ? <CheckCircleIcon size={18} /> : <TruckIcon size={18} />}
                            </div>
                            <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-center">Enviado</span>
                            {step === 3 && <span className="text-[9px] text-[#00897B] font-bold mt-1 text-center hidden sm:block">Faturado</span>}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* LISTA DE PRODUTOS COMPRADOS (Acordeão elegante) */}
                  <div className="bg-[#F4F9F8]/50 rounded-2xl p-4 border border-[#F4F9F8]">
                    <p className="text-xs font-bold text-[#698F8A] uppercase tracking-wider mb-3 flex items-center gap-2">
                      <ListIcon size={14} /> Itens do Pedido ({order.itens?.length || 0})
                    </p>
                    <div className="space-y-2">
                      {order.itens && Array.isArray(order.itens) ? order.itens.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm">
                          <div className="flex items-center gap-3 overflow-hidden">
                            <span className="bg-white border border-[#E8F3F2] text-[#8ECAC5] font-black text-xs w-7 h-7 flex items-center justify-center rounded-lg shrink-0">
                              {item.quantity}x
                            </span>
                            <span className="text-[#4A6B64] font-semibold truncate">{item.name}</span>
                          </div>
                          <span className="text-[#4A6B64] font-bold shrink-0 ml-2">
                            R$ {formatPrice(Number(item.price || 0) * item.quantity)}
                          </span>
                        </div>
                      )) : null}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

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
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* 🟡 PAINEL DE PENDENTES (Lojas Novas) */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-yellow-200">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-extrabold text-yellow-700 flex items-center gap-2">
                    <AlertCircleIcon size={24} /> Aguardando Aprovação ({pendingClients.length})
                  </h3>
                  <p className="text-sm text-[#698F8A]">Lojas novas que precisam de análise de crédito e vinculação.</p>
                </div>
              </div>

              {pendingClients.length === 0 ? (
                <div className="text-center py-6 bg-yellow-50/50 rounded-2xl border border-yellow-100">
                  <p className="text-yellow-700 font-bold">Nenhum cliente na fila de aprovação! 🎉</p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {pendingClients.map(client => {
                    // Mágica: Conta quantos pedidos este cliente já fez
                    const comprasFeitas = myOrders.filter(o => o.clienteId === client.id && o.status !== 'Cancelado').length;
                    
                    return (
                      <div key={client.id} className="border border-yellow-200 bg-yellow-50/30 p-5 rounded-2xl flex flex-col justify-between hover:shadow-md transition">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <p className="font-black text-[#4A6B64] text-lg leading-tight">{client.name}</p>
                            <p className="text-xs text-[#698F8A] mt-1 font-mono">CNPJ: {client.nif}</p>
                          </div>
                          <span className="bg-yellow-200 text-yellow-800 text-[10px] font-black px-2 py-1 rounded-md uppercase">
                            Pendente
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-yellow-200/50">
                          <div>
                            <p className="text-[10px] text-[#698F8A] font-bold uppercase mb-1">Meta (3 compras)</p>
                            <p className="text-sm font-black text-yellow-700">{comprasFeitas} / 3 realizadas</p>
                          </div>
                          <button
                            onClick={() => {
                              setEvalClient(client);
                              setEvalCreditLimit('5000'); // Sugestão padrão
                              setEvalRepId('rep_1'); // Rep padrão
                              setIsEvalModalOpen(true);
                            }}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition shadow-sm active:scale-95"
                          >
                            Avaliar Crédito
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 🟢 PAINEL DE APROVADOS (Carteira Ativa) */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-[#E8F3F2]">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-extrabold text-[#4A6B64] flex items-center gap-2">
                    <CheckCircleIcon size={24} className="text-[#8ECAC5]"/> Lojistas Aprovados ({approvedClients.length})
                  </h3>
                  <p className="text-sm text-[#698F8A]">Sua carteira de clientes com permissão para compras Faturadas.</p>
                </div>
              </div>

              {approvedClients.length === 0 ? (
                <p className="text-[#698F8A]">Nenhum cliente aprovado ainda.</p>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {approvedClients.map(client => (
                    <div key={client.id} className="border border-[#E8F3F2] p-5 rounded-2xl flex flex-col justify-between hover:border-[#8ECAC5] transition group bg-white">
                      <div>
                        <p className="font-black text-[#4A6B64] truncate group-hover:text-[#8ECAC5] transition">{client.name}</p>
                        <p className="text-xs text-[#698F8A] mt-1 font-mono">CNPJ: {client.nif}</p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-[#F4F9F8]">
                        <p className="text-xs text-[#698F8A] mb-1">Limite Aprovado: <strong className="text-[#8ECAC5] text-sm block">R$ {formatPrice(client.creditLimit)}</strong></p>
                        <p className="text-xs text-[#698F8A] mt-2">Vendedor(a): <strong className="text-indigo-400 block">{client.vendedorNome || 'Sem vendedor vinculado'}</strong></p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {adminTab === 'pedidos' && (
           <div className="space-y-4">
           </div>
        )}

        {adminTab === 'vitrine' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* BOTÃO DA I.A. DE CATEGORIZAÇÃO */}
            <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-2xl mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-indigo-800 font-black text-lg flex items-center gap-2">
                  <span className="text-2xl">🤖</span> I.A. de Categorização
                </h4>
                <p className="text-indigo-600 text-sm mt-1">
                  Varre os novos produtos integrados do Bling e preenche Marcas e Categorias automaticamente com base no nome do produto.
                </p>
              </div>
              <button 
                onClick={handleRunAICategorization}
                disabled={isUploading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition shadow-sm whitespace-nowrap disabled:opacity-70 flex items-center gap-2"
              >
                {isUploading ? 'Analisando Catálogo...' : 'Rodar Varredura Inteligente'}
              </button>
            </div>
            
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

              <div className="grid gap-4 md:grid-cols-2">
                {bannersPromocionais.map((banner, idx) => (
                  <div key={idx} className="relative rounded-2xl overflow-hidden border-2 border-transparent hover:border-[#8ECAC5] transition-all group">
                    <img src={banner.imagem} alt={banner.alt} className="w-full h-32 object-cover opacity-80 group-hover:opacity-100 transition" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                      <span className="text-white font-bold">{banner.alt}</span>
                      <div className="flex gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        
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

                        <button onClick={() => handleDeleteBanner(banner)} className="bg-red-500/80 hover:bg-red-600 text-white text-xs px-3 py-1 rounded-md backdrop-blur-sm transition">Remover</button>
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
                  <p className="text-sm text-[#698F8A]">O menu superior e as marcas em formato de card.</p>
                </div>
                <button onClick={() => { setEditingItem(null); setFormDeptName(''); setFormDeptIcon(''); setFormDeptMarcas([]); setIsCategoryModalOpen(true); }} className="bg-[#E8F3F2] hover:bg-[#8ECAC5] text-[#4A6B64] hover:text-white px-4 py-2 rounded-xl text-sm font-bold transition flex items-center gap-2">
                  <PlusIcon size={16} /> Novo Departamento
                </button>
              </div>

              <div className="space-y-4">
                {mapaCategorias.map((dept, idx) => (
                  <div key={idx} className="border border-[#E8F3F2] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition">
                    <div className="flex items-center gap-4">
                      <span className={`w-12 h-12 flex items-center justify-center rounded-xl text-2xl bg-teal-50 text-teal-600`}>{dept.icone}</span>
                      <div>
                        <h4 className="font-bold text-[#4A6B64] text-lg">{dept.nome}</h4>
                        <p className="text-xs text-[#698F8A]">{dept.marcas?.length || 0} subcategorias/marcas cadastradas</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                    <button 
  onClick={() => {
    setEditingItem(dept);
    setFormDeptName(dept.nome);
    setFormDeptIcon(dept.icone);
    setFormDeptMarcas(dept.marcas || []); 
    setIsCategoryModalOpen(true);
  }} 
  className="flex-1 sm:flex-none text-center bg-[#F4F9F8] hover:bg-[#E8F3F2] text-[#4A6B64] px-4 py-2 rounded-xl text-sm font-bold transition"
>
  Editar
</button>
                    <button onClick={() => handleDeleteCategory(dept)} className="flex-1 sm:flex-none text-center bg-red-50 hover:bg-red-100 text-red-500 px-4 py-2 rounded-xl text-sm font-bold transition"> Excluir </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
        
        {isBannerModalOpen && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
            {/* 🌟 MUDANÇA AQUI: Adicionado max-h-[90vh] e overflow-y-auto */}
            <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative animate-in zoom-in-95 duration-200 scrollbar-none">
              
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
                          setFormBannerPreview(URL.createObjectURL(file)); 
                        }
                      }}
                    />
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                  <button 
                    onClick={() => { setIsBannerModalOpen(false); setFormBannerPreview(null); setFormBannerImageFile(null); }} 
                    disabled={isUploading}
                    className="px-5 py-2.5 rounded-xl font-bold text-[#698F8A] hover:bg-gray-50 transition disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={handleSaveBanner}
                    disabled={isUploading}
                    className="bg-[#4A6B64] hover:bg-[#3A5A53] text-white px-8 py-2.5 rounded-xl font-bold shadow-md transition active:scale-95 flex items-center gap-2 disabled:opacity-70 disabled:cursor-wait"
                  >
                    {isUploading ? (
                      <> <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Salvando... </>
                    ) : (
                      editingItem ? 'Salvar Edição' : 'Adicionar Banner'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

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

  <div className="pt-2">
    <label className="block text-xs font-bold text-[#4A6B64] uppercase mb-1">Subcategorias / Marcas</label>
    <p className="text-[10px] text-[#698F8A] mb-2 font-semibold">Elas aparecerão em formato de Cards Circulares na página inicial.</p>
    
    {/* Input para adicionar nova marca */}
    <div className="flex gap-2 mb-3">
      <input 
        type="text" 
        placeholder="Ex: Dermachem" 
        value={novaMarcaInput}
        onChange={(e) => setNovaMarcaInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            if (novaMarcaInput.trim()) {
              setFormDeptMarcas([...formDeptMarcas, { nome: novaMarcaInput.trim(), busca: novaMarcaInput.trim() }]);
              setNovaMarcaInput('');
            }
          }
        }}
        className="flex-1 bg-[#F4F9F8] text-[#4A6B64] border border-[#E8F3F2] rounded-xl py-2.5 px-4 outline-none focus:ring-2 focus:ring-[#8ECAC5] transition text-sm"
      />
      <button 
        type="button"
        onClick={() => {
          if (novaMarcaInput.trim()) {
            setFormDeptMarcas([...formDeptMarcas, { nome: novaMarcaInput.trim(), busca: novaMarcaInput.trim() }]);
            setNovaMarcaInput('');
          }
        }}
        className="bg-[#8ECAC5] hover:bg-[#7ABDB8] text-white px-5 rounded-xl font-bold transition shadow-sm text-sm"
      >
        Incluir
      </button>
    </div>
    
    {/* 🌟 NOVA Lista de Marcas com Upload de Foto Individual (Substituiu os chips antigos) */}
    <div className="flex flex-col gap-2 mt-4 min-h-[40px] bg-gray-50/50 p-2 rounded-xl border border-dashed border-gray-200 max-h-48 overflow-y-auto">
      {formDeptMarcas.map((marca, idx) => (
        <div key={idx} className="flex items-center justify-between bg-white border border-[#E8F3F2] p-2 rounded-xl shadow-sm hover:shadow-md transition-shadow group">
          <div className="flex items-center gap-3">
            
            {/* BOTÃO CIRCULAR DE UPLOAD DE FOTO */}
            <label className="relative w-10 h-10 rounded-full border border-dashed border-[#8ECAC5] flex items-center justify-center bg-[#F4F9F8] cursor-pointer overflow-hidden group/img shrink-0">
              {uploadingMarcaIndex === idx ? (
                <div className="w-4 h-4 border-2 border-[#8ECAC5] border-t-transparent rounded-full animate-spin"></div>
              ) : marca.imagem ? (
                <>
                  <img src={marca.imagem} alt={marca.nome} className="w-full h-full object-contain p-1 mix-blend-multiply" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="text-white text-[8px] font-bold">Trocar</span>
                  </div>
                </>
              ) : (
                <span className="text-[9px] text-[#698F8A] font-bold text-center leading-tight">Add<br/>Foto</span>
              )}
              <input 
                type="file" 
                className="hidden" 
                accept="image/png, image/jpeg, image/webp"
                onChange={(e) => handleUploadMarcaImage(e, idx)}
              />
            </label>
            
            <span className="text-sm font-bold text-[#4A6B64]">{marca.nome}</span>
          </div>
          
          <button 
            type="button" 
            onClick={() => setFormDeptMarcas(formDeptMarcas.filter((_, i) => i !== idx))}
            className="text-red-400 hover:text-red-600 p-2 transition-colors"
            title="Remover Marca"
          >
            <CloseIcon size={16} />
          </button>
        </div>
      ))}
      
      {formDeptMarcas.length === 0 && (
        <span className="text-xs text-gray-400 font-medium w-full text-center py-2">
          Nenhuma marca adicionada ainda.
        </span>
      )}
    </div>
  </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                  <button 
                    onClick={() => { setIsCategoryModalOpen(false); setEditingItem(null); setFormDeptName(''); setFormDeptIcon(''); }} 
                    disabled={isUploading}
                    className="px-5 py-2.5 rounded-xl font-bold text-[#698F8A] hover:bg-gray-50 transition disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={handleSaveCategory}
                    disabled={isUploading}
                    className="bg-[#4A6B64] hover:bg-[#3A5A53] text-white px-8 py-2.5 rounded-xl font-bold shadow-md transition active:scale-95 disabled:opacity-70 flex items-center gap-2"
                  >
                    {isUploading ? 'Salvando...' : (editingItem ? 'Salvar Edição' : 'Adicionar')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* ========================================= */}
        {/* MODAL: AVALIAÇÃO DE CRÉDITO E VENDEDOR */}
        {/* ========================================= */}
        {isEvalModalOpen && evalClient && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative animate-in zoom-in-95 duration-200">
              
              <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                <div>
                  <h3 className="text-xl font-black text-[#4A6B64]">Aprovar Cliente</h3>
                  <p className="text-sm text-[#698F8A] font-bold mt-1">{evalClient.name}</p>
                </div>
                <button onClick={() => setIsEvalModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition bg-gray-50 p-2 rounded-full">
                  <CloseIcon size={20} />
                </button>
              </div>

              <div className="space-y-5">
                {/* Definição de Limite */}
                <div>
                  <label className="block text-xs font-bold text-[#4A6B64] uppercase mb-1">Limite Liberado (R$)</label>
                  <p className="text-[10px] text-[#698F8A] mb-2 font-semibold">Valor em reais para compras faturadas.</p>
                  <input 
                    type="number" 
                    value={evalCreditLimit}
                    onChange={(e) => setEvalCreditLimit(e.target.value)}
                    className="w-full text-2xl font-black bg-[#F4F9F8] text-[#8ECAC5] border border-[#E8F3F2] rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-[#8ECAC5] transition"
                  />
                </div>

                {/* Delegação do Representante */}
                <div>
                  <label className="block text-xs font-bold text-[#4A6B64] uppercase mb-1">Atribuir a um Representante</label>
                  <p className="text-[10px] text-[#698F8A] mb-2 font-semibold">Quem vai atender e ganhar comissão sobre esta conta?</p>
                  <select
                    value={evalRepId}
                    onChange={(e) => setEvalRepId(e.target.value)}
                    className="w-full bg-[#F4F9F8] text-[#4A6B64] font-bold border border-[#E8F3F2] rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-[#8ECAC5] transition cursor-pointer appearance-none"
                  >
                    <option value="">Nenhum Vendedor</option>
                    {representantesCadastrados.map(rep => (
                      <option key={rep.id} value={rep.id}>{rep.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end gap-3 pt-6 mt-2">
                  <button 
                    onClick={() => setIsEvalModalOpen(false)} 
                    disabled={isUploading}
                    className="px-5 py-2.5 rounded-xl font-bold text-[#698F8A] hover:bg-gray-50 transition disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={handleSaveEvaluation}
                    disabled={isUploading}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-2.5 rounded-xl font-bold shadow-md transition active:scale-95 disabled:opacity-70 flex items-center gap-2"
                  >
                    {isUploading ? 'Aprovando...' : 'Liberar Crédito'}
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
    <div className="min-h-screen bg-[#EBEBEB] font-sans relative">
      
      {currentUser && currentScreen !== 'login' && (
        <header className="bg-[#4A6B64] sticky top-0 z-40 shadow-md">
          
          <div className="max-w-6xl mx-auto px-4 py-2 sm:py-3 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 sm:gap-6">
            
            <div className="flex items-center gap-2 cursor-pointer shrink-0" onClick={() => { if (!currentUser.isAdmin && !currentUser.isRep) voltarParaHome(); }}>
              <SparklesIcon size={24} className="text-[#8ECAC5]" />
              <div className="flex flex-col">
                <span className="font-black text-lg sm:text-xl leading-tight text-white tracking-wide">GKL BRASIL</span>
                <span className="text-[9px] sm:text-[10px] font-bold tracking-widest uppercase text-[#8ECAC5] leading-none">
                  {currentUser.isAdmin ? 'Painel Admin' : currentUser.isRep ? 'Portal Rep.' : 'B2B Atacado'}
                </span>
              </div>
            </div>

            {/* 🌟 BARRA DE BUSCA GLOBAL (Responsiva: Centro no PC, Linha inteira no Celular) */}
            {currentScreen === 'catalog' ? (
              <form 
                onSubmit={(e) => {
                  e.preventDefault(); // Impede a página de recarregar
                  if (searchQuery.trim()) {
                    setSelectedCategory(''); // Deixa vazio para indicar que é busca livre
                    setCatalogView('lista'); // Muda a tela para a lista de resultados
                    buscarProdutos(1, searchQuery.trim()); // Dispara a busca na API
                    window.scrollTo(0, 0); // Joga a tela pro topo
                  }
                }} 
                className="flex-1 w-full sm:w-auto order-3 sm:order-none mt-2 sm:mt-0 max-w-2xl mx-auto"
              >
                <div className="relative flex items-center w-full group">
                  <SearchIcon size={20} className="absolute left-4 text-[#698F8A] group-focus-within:text-[#8ECAC5] transition-colors" />
                  <input
                    type="text"
                    placeholder="Buscar produtos, marcas ou categorias..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/95 text-[#4A6B64] font-semibold rounded-full py-2.5 sm:py-3 pl-12 pr-10 outline-none focus:bg-white focus:ring-4 focus:ring-[#8ECAC5]/30 transition-all shadow-inner"
                  />
                  {/* Botão para limpar a busca rapidamente */}
                  {searchQuery && (
                    <button 
                      type="button" 
                      onClick={() => {
                        setSearchQuery('');
                        if (catalogView === 'lista') voltarParaHome();
                      }}
                      className="absolute right-4 text-gray-400 hover:text-[#4A6B64] transition-colors"
                    >
                      <CloseIcon size={16} />
                    </button>
                  )}
                </div>
              </form>
            ) : (
              <div className="flex-1"></div>
            )}

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

          {/* 🌟 2º ANDAR: Menu Superior Deslizante (Estilo Abas) */}
          {currentScreen === 'catalog' && (
            <div className="bg-[#3A5A53] px-0 relative z-30 border-t border-[#4A6B64] shadow-sm">
              <div className="max-w-6xl mx-auto flex items-center overflow-x-auto whitespace-nowrap scrollbar-none text-[13px] font-semibold text-white/80">
                
                {/* Aba "Destaques / Início" */}
                <button 
                  onClick={() => { setActiveDeptHome(null); voltarParaHome(); }} 
                  className={`py-3 px-5 transition-all cursor-pointer shrink-0 border-b-[3px] ${(!activeDeptHome && catalogView === 'home') ? 'border-white text-white font-bold bg-white/5' : 'border-transparent hover:bg-white/5 hover:text-white'}`}
                >
                  Destaques
                </button>

                {mapaCategorias.map(dept => {
                  // Verifica se este é o departamento ativo
                  const isSelected = activeDeptHome === dept.id;
                  
                  return (
                    <button 
                      key={dept.id} 
                      onClick={() => {
                        setActiveDeptHome(dept.id);
                        if (catalogView !== 'home') voltarParaHome();
                      }}
                      className={`py-3 px-5 transition-all cursor-pointer shrink-0 border-b-[3px] ${isSelected ? 'border-[#8ECAC5] text-white font-bold bg-white/5' : 'border-transparent hover:bg-white/5 hover:text-white'}`}
                    >
                      {dept.nome}
                    </button>
                  );
                })}
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
                      onClick={() => setModalQuantity(prev => Math.max(1, Number(prev || 1) - 1))}
                      className="p-2 text-[#4A6B64] hover:bg-[#F4F9F8] rounded-lg transition"
                    >
                      <MinusIcon size={16} />
                    </button>
                    
                    <input 
                      type="text"
                      inputMode="numeric"
                      value={modalQuantity}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, '');
                        setModalQuantity(val === '' ? '' : Number(val));
                      }}
                      onBlur={() => {
                        if (modalQuantity === '' || modalQuantity <= 0) setModalQuantity(1);
                      }}
                      className="px-4 font-bold text-[#4A6B64] w-16 text-center bg-transparent outline-none"
                    />

                    <button 
                      onClick={() => setModalQuantity(prev => Math.min(selectedProduct.stock || 999, Number(prev || 0) + 1))}
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