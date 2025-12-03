
import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  ShoppingBag, 
  Menu, 
  X, 
  Heart, 
  Share2, 
  Disc, 
  MessageCircle, 
  ChevronDown,
  Music,
  Play,
  ArrowRight,
  Sun,
  Moon,
  Mail,
  Send,
  Headphones,
  Mic2,
  Speaker,
  Gift,
  Music2,
  Radio,
  Linkedin,
  Instagram,
  QrCode,
  Globe,
  Waves,
  ChevronUp,
  Eye
} from 'lucide-react';
import { 
  PRODUCTS, 
  WHATSAPP_NUMBER, 
  TELEGRAM_LINK, 
  EMAIL_ADDRESS, 
  IMAGES, 
  HERO_VIDEO_URL, 
  FREE_MUSIC_VIDEO_URL,
  RARITY_VIDEO_URL,
  ABOUT_VIDEO_URL,
  CONTACT_VIDEO_URL,
  GENRES_VIDEO_URL,
  OWNER_VIDEO_URL
} from './constants';
import { Product, ChatMessage, FilterType } from './types';
import { generateChatResponse } from './services/geminiService';
import { translations, Language } from './translations';

// --- Types ---
type Page = 'home' | 'shop' | 'genres' | 'rarities' | 'about' | 'contact' | 'free-music' | 'share-me';

// --- Helper for deep key access ---
function getTranslation(lang: Language, path: string): string {
  const keys = path.split('.');
  let current: any = translations[lang];
  for (const k of keys) {
    if (current[k] === undefined) return path;
    current = current[k];
  }
  return current as string;
}

// --- Components ---

// 0. Flash Transition
const FlashTransition: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[100] bg-white pointer-events-none animate-flash"></div>
  );
};

// Marketing Strategy Bubble
const SocialProofBubble: React.FC<{ t: (k: string) => string }> = ({ t }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentMsgKey, setCurrentMsgKey] = useState('marketing.msg1');
  const [iconType, setIconType] = useState<'view' | 'buy'>('view');

  useEffect(() => {
    // Defines different messages to rotate so it doesn't seem fake
    const messages = [
      { key: 'marketing.msg1', type: 'view' },
      { key: 'marketing.msg2', type: 'buy' },
      { key: 'marketing.msg3', type: 'buy' },
      { key: 'marketing.msg4', type: 'view' },
    ];

    // Timer logic: Every 90 seconds (90000ms), show message for 5 seconds
    const cycle = setInterval(() => {
      const randomMsg = messages[Math.floor(Math.random() * messages.length)];
      setCurrentMsgKey(randomMsg.key);
      setIconType(randomMsg.type as any);
      setIsVisible(true);
      
      setTimeout(() => {
        setIsVisible(false);
      }, 5000);
    }, 90000); 

    // Optional: Also run a quick one shortly after load to engage user immediately
    const initialTimer = setTimeout(() => {
      const randomMsg = messages[0]; // Start with first msg
      setCurrentMsgKey(randomMsg.key);
      setIconType(randomMsg.type as any);
      setIsVisible(true);
      setTimeout(() => setIsVisible(false), 5000);
    }, 15000);

    return () => {
      clearInterval(cycle);
      clearTimeout(initialTimer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 animate-in slide-in-from-bottom-10 fade-in duration-700">
       <div className="glass-panel px-6 py-4 rounded-full flex items-center gap-4 border border-gold-dark/30 shadow-[0_0_20px_rgba(197,160,89,0.2)] bg-black/60 backdrop-blur-xl">
          <div className="p-2 bg-gold-light/10 rounded-full text-gold-light relative">
             {iconType === 'view' ? <Eye size={18} /> : <ShoppingBag size={18} />}
             <span className="absolute top-0 right-0 w-2 h-2 bg-vivid-green rounded-full animate-ping"></span>
          </div>
          <div>
             <p className="text-white text-xs font-bold font-sans tracking-wide">{t(currentMsgKey)}</p>
             <p className="text-[10px] text-stone-400 uppercase tracking-widest">{t('marketing.just_now')}</p>
          </div>
       </div>
    </div>
  );
};

// Reusable Parallax Video Section
const ParallaxSection: React.FC<{
  videoUrl: string;
  children?: React.ReactNode;
  height?: string;
  objectFit?: 'cover' | 'contain';
}> = ({ videoUrl, children, height = "h-[50vh]", objectFit = 'cover' }) => {
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setOffsetY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`relative ${height} overflow-hidden flex items-center justify-center bg-black w-full`}>
      <div
        className="absolute inset-0 w-full h-[120%] -top-[10%] pointer-events-none"
        style={{ transform: `translateY(${offsetY * 0.5}px)` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent z-10"></div>
        <video
           autoPlay 
           muted 
           loop 
           playsInline
           className={`w-full h-full object-${objectFit} opacity-80 bg-black`}
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      </div>

      <div className="relative z-20 text-center w-full max-w-7xl px-4 flex flex-col items-center justify-center h-full">
         {children}
      </div>
    </div>
  );
};

// Search Overlay
const SearchOverlay: React.FC<{ isOpen: boolean; onClose: () => void; onSelect: (p: Product) => void; t: (k: string) => string }> = ({ isOpen, onClose, onSelect, t }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const results = PRODUCTS.filter(p => 
    p.album.toLowerCase().includes(query.toLowerCase()) || 
    p.artist.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex flex-col p-6 animate-in fade-in duration-300">
      <div className="flex justify-end mb-8">
        <button onClick={onClose} className="p-2 text-stone-400 hover:text-white rounded-full border border-stone-800 hover:border-white transition-all">
          <X size={24} />
        </button>
      </div>
      <div className="max-w-4xl mx-auto w-full">
        <input 
          ref={inputRef}
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('common.search_placeholder')}
          className="w-full bg-transparent text-4xl sm:text-6xl font-serif text-white placeholder-stone-700 border-b border-stone-800 pb-4 focus:outline-none focus:border-gold-light transition-colors mb-12"
        />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 overflow-y-auto max-h-[60vh]">
          {query && results.map(p => (
            <div key={p.id} onClick={() => { onSelect(p); onClose(); }} className="flex items-center gap-4 group cursor-pointer p-4 rounded-lg hover:bg-white/5 transition">
              <img src={p.coverImage} className="w-16 h-16 object-cover rounded shadow-lg group-hover:scale-105 transition" alt={p.album} />
              <div>
                <h4 className="text-white text-lg font-serif group-hover:text-gold-light">{p.album}</h4>
                <p className="text-stone-500 text-sm uppercase tracking-widest">{p.artist}</p>
              </div>
            </div>
          ))}
          {query && results.length === 0 && (
            <p className="text-stone-500 text-xl font-light">{t('common.no_results')} "{query}"</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Sidebar Navigation
const Sidebar: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  setPage: (page: Page) => void; 
  currentPage: Page;
  toggleTheme: () => void;
  isDarkMode: boolean;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (k: string) => string;
}> = ({ isOpen, onClose, setPage, currentPage, toggleTheme, isDarkMode, language, setLanguage, t }) => {

  const navItems: { labelKey: string; page: Page }[] = [
    { labelKey: 'nav.shop', page: 'shop' },
    { labelKey: 'nav.genres', page: 'genres' },
    { labelKey: 'nav.rarities', page: 'rarities' },
    { labelKey: 'nav.free_music', page: 'free-music' },
    { labelKey: 'nav.about', page: 'about' },
    { labelKey: 'nav.contact', page: 'contact' },
    { labelKey: 'nav.share_me', page: 'share-me' },
  ];

  if (!isOpen) return null;

  return (
    <>
      <div className="sidebar-backdrop" onClick={onClose}></div>
      <div className="sidebar-panel animate-in slide-in-from-left duration-500">
        
        {/* Header - Chrome Vinyl & Close */}
        <div className="flex flex-col items-center pt-8 pb-6 border-b border-stone-800 relative z-20 bg-inherit">
          <div className="absolute top-4 right-4">
             <button onClick={onClose} className="text-stone-400 hover:text-gold-light transition">
               <X size={24} />
             </button>
          </div>

          <div className="w-24 h-24 rounded-full chrome-vinyl animate-spin-subtle shadow-xl flex items-center justify-center mb-4">
              <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center border border-[#bf953f]">
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-[#bf953f] to-[#aa771c] opacity-80 animate-pulse"></div>
              </div>
          </div>
          
          <div className="text-center">
            <h2 className="font-serif font-black text-xl tracking-[0.15em] text-gold-chrome uppercase leading-none mb-1">Tehran</h2>
            <span className="font-sans font-bold text-[10px] tracking-[0.4em] text-stone-500 uppercase">Records</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-6 px-6 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.page}
              onClick={() => { setPage(item.page); onClose(); }}
              className={`w-full text-left py-3 px-4 text-sm font-bold uppercase tracking-widest rounded-lg transition-all duration-300 flex items-center justify-between group ${
                currentPage === item.page 
                ? 'bg-gold-dark/10 text-gold-light border-l-2 border-gold-light' 
                : 'text-stone-400 hover:text-white hover:bg-white/5 border-l-2 border-transparent'
              }`}
            >
              <span>{t(item.labelKey)}</span>
              <span className={`w-1.5 h-1.5 rounded-full ${currentPage === item.page ? 'bg-gold-light' : 'bg-transparent group-hover:bg-stone-600'} transition-colors`}></span>
            </button>
          ))}
        </nav>

        {/* Bottom Section - Theme & Language */}
        <div className="p-6 border-t border-stone-800 bg-inherit z-20 relative space-y-4">
          
          {/* Theme Toggle */}
          <div className="flex items-center justify-between px-2">
             <span className="text-xs font-bold uppercase tracking-widest text-stone-500">{t('common.theme')}</span>
             <button 
                onClick={toggleTheme} 
                className="flex items-center gap-2 bg-stone-800/50 p-1 rounded-full border border-stone-700"
             >
                <div className={`p-1.5 rounded-full transition-all ${isDarkMode ? 'bg-transparent text-stone-500' : 'bg-gold-light text-black shadow-lg'}`}>
                   <Sun size={14} />
                </div>
                <div className={`p-1.5 rounded-full transition-all ${isDarkMode ? 'bg-black text-gold-light shadow-lg border border-gold-dark/50' : 'bg-transparent text-stone-500'}`}>
                   <Moon size={14} />
                </div>
             </button>
          </div>

          {/* Language Toggle */}
          <div className="flex items-center justify-between px-2">
             <span className="text-xs font-bold uppercase tracking-widest text-stone-500">{t('common.language')}</span>
             <div className="flex gap-1">
                {(['en', 'fa', 'es'] as Language[]).map(lang => (
                   <button 
                     key={lang}
                     onClick={() => setLanguage(lang)}
                     className={`px-2 py-1 text-[10px] font-bold uppercase rounded border ${
                       language === lang 
                       ? 'bg-gold-light text-black border-gold-light' 
                       : 'bg-transparent text-stone-500 border-stone-800 hover:border-stone-600'
                     }`}
                   >
                     {lang}
                   </button>
                ))}
             </div>
          </div>
        </div>

      </div>
    </>
  );
};


interface HeaderProps {
  cartCount: number;
  currentPage: Page;
  setPage: (page: Page) => void;
  toggleTheme: () => void;
  isDarkMode: boolean;
  openSearch: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (k: string) => string;
}

// 1. Header
const Header: React.FC<HeaderProps> = ({ cartCount, currentPage, setPage, toggleTheme, isDarkMode, openSearch, language, setLanguage, t }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        setPage={setPage} 
        currentPage={currentPage}
        toggleTheme={toggleTheme}
        isDarkMode={isDarkMode}
        language={language}
        setLanguage={setLanguage}
        t={t}
      />

      <header className="sticky top-0 z-40 glass-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Left: Menu Trigger */}
            <div className="flex items-center gap-4">
              <button onClick={() => setIsSidebarOpen(true)} className="text-stone-400 hover:text-gold-light p-2 transition-transform hover:scale-105">
                <Menu size={28} strokeWidth={1.5} />
              </button>
              
              {/* Desktop Language Toggle */}
              <div className="hidden md:flex items-center gap-1">
                  {(['en', 'fa', 'es'] as Language[]).map(lang => (
                      <button 
                        key={lang} 
                        onClick={() => setLanguage(lang)}
                        className={`text-[10px] font-bold uppercase px-2 py-1 rounded transition-colors ${
                          language === lang 
                          ? 'bg-gold-light text-black' 
                          : 'text-stone-500 hover:text-stone-300'
                        }`}
                      >
                        {lang}
                      </button>
                  ))}
              </div>
            </div>

            {/* Center: Logo */}
            <div 
              className="flex-shrink-0 flex items-center justify-center cursor-pointer"
              onClick={() => setPage('home')}
            >
               <div className="flex items-center gap-3 group">
                  {/* Gold Disk Logo */}
                  <div className="relative w-10 h-10 rounded-full gold-record shadow-[0_0_15px_rgba(170,119,28,0.4)] animate-spin-slow group-hover:animate-spin border border-[#fcf6ba]/30 overflow-hidden hidden sm:block">
                      <div className="absolute inset-0 logo-scan-line"></div>
                      <div className="absolute inset-0 rounded-full gold-record-shine"></div>
                      <div className="absolute inset-[35%] bg-black rounded-full border border-[#bf953f] z-10"></div>
                  </div>
                  
                  {/* Text */}
                  <div className="flex flex-col items-center sm:items-start">
                    <span className="font-serif font-black text-xl sm:text-2xl tracking-[0.15em] text-gold-chrome uppercase leading-none scan-text">
                      Tehran
                    </span>
                    <span className="font-sans font-bold text-[10px] sm:text-xs tracking-[0.4em] text-gold-light/80 uppercase ml-1 animate-pulse-slow">
                      Records
                    </span>
                  </div>
               </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button onClick={openSearch} className="p-2 text-stone-400 hover:text-gold-light transition hover:drop-shadow-[0_0_5px_rgba(255,215,0,0.5)]">
                <Search size={22} strokeWidth={1.5} />
              </button>
              <button 
                onClick={() => window.open(`https://wa.me/${WHATSAPP_NUMBER}`, '_blank')}
                className="p-2 text-stone-400 hover:text-gold-light transition relative hover:drop-shadow-[0_0_5px_rgba(255,215,0,0.5)]"
              >
                <ShoppingBag size={22} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

// 2. Hero Section
const Hero: React.FC<{ setPage: (page: Page) => void; t: (k: string) => string }> = ({ setPage, t }) => {
  const [offsetY, setOffsetY] = useState(0);
  
  // Parallax Scroll Effect
  useEffect(() => {
    const handleScroll = () => {
        setOffsetY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative h-[80vh] overflow-hidden flex items-center justify-center bg-black">
      {/* Sharp Parallax Video Container */}
      <div 
        className="absolute inset-0 w-full h-[120%] -top-[10%] pointer-events-none"
        style={{ transform: `translateY(${offsetY * 0.5}px)` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent z-10 dark:from-black light:from-cream/20"></div>
        <video 
           autoPlay 
           muted 
           loop 
           playsInline
           className="w-full h-full object-cover opacity-90"
           poster={IMAGES.showroom}
        >
          <source src={HERO_VIDEO_URL} type="video/mp4" />
        </video>
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-4 text-center flex flex-col items-center">
        <div className="mb-8 relative group">
           <div className="w-32 h-32 mx-auto rounded-full gold-record p-1 shadow-[0_0_50px_rgba(197,160,89,0.4)] animate-spin-slow">
              <div className="w-full h-full rounded-full bg-black/80 flex items-center justify-center relative backdrop-blur-sm">
                 <div className="absolute w-1/3 h-1/3 bg-gradient-to-br from-[#bf953f] to-[#aa771c] rounded-full flex items-center justify-center border border-white/20">
                    <span className="text-[10px] font-bold text-black font-serif">TR</span>
                 </div>
              </div>
           </div>
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-8xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-stone-200 to-stone-500 mb-6 tracking-tighter drop-shadow-2xl">
          <span className="text-gold-chrome block mb-2 scan-text">{t('hero.find_music')}</span>
          <span className="text-3xl sm:text-4xl md:text-5xl font-sans font-light tracking-[0.5em] text-white uppercase block mt-4 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
            {t('hero.spin_city')}
          </span>
        </h1>
        
        <p className="mt-8 text-xl sm:text-2xl text-stone-300 max-w-3xl font-sans font-light leading-relaxed text-glow bg-black/30 backdrop-blur-sm p-4 rounded-xl border border-white/5">
          {t('hero.description')}
        </p>

        <div className="mt-12 flex flex-col sm:flex-row gap-6 animate-float">
          <button 
            onClick={() => setPage('shop')}
            className="px-10 py-4 bg-gradient-to-r from-[#bf953f] to-[#aa771c] text-black font-bold text-lg uppercase tracking-widest hover:scale-105 transition-transform shadow-[0_0_20px_rgba(191,149,63,0.5)] border border-white/20"
          >
            {t('hero.explore')}
          </button>
          <button 
            onClick={() => setPage('genres')}
            className="px-10 py-4 border border-white/30 bg-black/40 backdrop-blur-md text-white font-bold text-lg uppercase tracking-widest hover:bg-white hover:text-black transition-all"
          >
            {t('hero.visit')}
          </button>
        </div>
      </div>
    </div>
  );
};

interface ProductCardProps {
  product: Product;
  onSelect: (p: Product) => void;
  t: (k: string) => string;
}

// 3. Product Card
const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect, t }) => {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=Hi Tehran Records, I'm interested in ${product.artist} - ${product.album}`;

  return (
    <div className="group relative glass-panel transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(197,160,89,0.2)]">
      <div className="relative aspect-square overflow-hidden cursor-pointer p-4 pb-0" onClick={() => onSelect(product)}>
        <div className="relative w-full h-full shadow-2xl">
            <img 
              src={product.coverImage} 
              alt={product.album} 
              className="w-full h-full object-cover z-10 relative shadow-md"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full border border-white/50 flex items-center justify-center backdrop-blur-sm">
                    <ArrowRight className="text-white" />
                </div>
            </div>
        </div>
        
        <div className="absolute top-6 left-6 flex flex-col gap-2 z-20">
           <span className="bg-black/80 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest">{product.condition}</span>
           {product.rarity !== 'Common' && (
             <span className="bg-gradient-to-r from-[#bf953f] to-[#aa771c] text-black text-[10px] font-bold px-3 py-1 uppercase tracking-widest shadow-lg">{product.rarity}</span>
           )}
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1 pr-2">
            <h3 className="text-xl font-bold font-serif leading-tight cursor-pointer hover:text-gold-light transition-colors text-white dark:text-white" onClick={() => onSelect(product)}>
              {product.album}
            </h3>
            <p className="text-sm text-stone-400 font-sans uppercase tracking-widest mt-1 group-hover:text-gold-light/70 transition-colors">{product.artist}</p>
          </div>
          <div className="text-right">
             <p className="text-xl font-bold text-gold-chrome">${product.price}</p>
             {product.originalPrice && product.price < product.originalPrice && (
                <p className="text-xs text-stone-500 line-through">${product.originalPrice}</p>
             )}
          </div>
        </div>

        <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/10">
           <div className="flex gap-3">
              <button className="text-stone-400 hover:text-red-500 transition hover:scale-110"><Heart size={20} /></button>
              <button className="text-stone-400 hover:text-blue-400 transition hover:scale-110"><Share2 size={20} /></button>
           </div>
           <a 
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-vivid-green hover:text-white font-bold text-xs uppercase tracking-widest transition-colors px-4 py-2 border border-vivid-green/30 hover:bg-vivid-green rounded-sm"
           >
             <MessageCircle size={16} />
             <span>{t('common.buy_now')}</span>
           </a>
        </div>
      </div>
    </div>
  );
};

// 4. Product Modal
const ProductModal: React.FC<{ product: Product; onClose: () => void; t: (k: string) => string }> = ({ product, onClose, t }) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative w-full max-w-6xl max-h-[95vh] overflow-y-auto bg-black border border-gold-dark/30 shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col md:flex-row animate-float">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 text-white/50 hover:text-white z-50 transition border border-white/10 rounded-full hover:bg-white/10">
          <X size={24} />
        </button>

        <div className="w-full md:w-1/2 bg-[#050505] p-10 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="relative w-full max-w-md aspect-square shadow-[0_0_40px_rgba(197,160,89,0.15)] group">
             <div className="absolute top-2 right-2 bottom-2 left-2 rounded-full gold-record animate-spin-slow opacity-80 group-hover:translate-x-12 transition-transform duration-1000 ease-in-out"></div>
            <img src={product.coverImage} alt={product.album} className="w-full h-full object-cover relative z-10 shadow-2xl" />
          </div>
        </div>

        <div className="w-full md:w-1/2 p-10 md:p-14 flex flex-col bg-gradient-to-br from-[#111] to-black">
          <div className="mb-2 flex items-center gap-3">
             <span className="h-[1px] w-12 bg-gold-dark"></span>
             <span className="text-gold-light uppercase tracking-[0.3em] text-xs">{t('common.featured')}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-2 leading-none">{product.album}</h2>
          <h3 className="text-2xl text-stone-400 mb-8 font-sans font-light tracking-widest uppercase">{product.artist}</h3>

          <div className="grid grid-cols-3 gap-4 mb-8 border-y border-white/10 py-6">
             <div className="text-center border-r border-white/10">
                <span className="block text-gold-chrome text-xl font-bold mb-1">${product.price}</span>
                <span className="text-xs text-stone-500 uppercase tracking-widest">{t('common.price')}</span>
             </div>
             <div className="text-center border-r border-white/10">
                <span className="block text-white text-lg font-bold mb-1">{product.condition}</span>
                <span className="text-xs text-stone-500 uppercase tracking-widest">{t('common.condition')}</span>
             </div>
             <div className="text-center">
                <span className="block text-white text-lg font-bold mb-1">{product.year}</span>
                <span className="text-xs text-stone-500 uppercase tracking-widest">{t('common.year')}</span>
             </div>
          </div>

          <div className="space-y-6 mb-10 font-sans text-stone-300 leading-relaxed text-lg font-light">
            <p>{product.description}</p>
            <div className="flex flex-wrap gap-2">
               <span className="px-3 py-1 border border-white/20 rounded-full text-xs text-stone-400 uppercase tracking-wider">{product.genre}</span>
               <span className="px-3 py-1 border border-white/20 rounded-full text-xs text-stone-400 uppercase tracking-wider">{product.format}</span>
               <span className="px-3 py-1 border border-gold-dark/30 rounded-full text-xs text-gold-light uppercase tracking-wider">{product.rarity}</span>
            </div>
          </div>

          <div className="mt-auto space-y-4">
             <a 
               href={`https://wa.me/${WHATSAPP_NUMBER}?text=I want to buy ${product.artist} - ${product.album}`}
               target="_blank"
               rel="noopener noreferrer"
               className="w-full py-5 bg-vivid-green hover:bg-green-500 text-black font-bold text-lg uppercase tracking-[0.2em] text-center block transition-all shadow-[0_0_20px_rgba(0,214,70,0.3)] hover:shadow-[0_0_30px_rgba(0,214,70,0.5)]"
             >
               {t('common.inquire_whatsapp')}
             </a>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Pages Components ---

const ShopPage: React.FC<{ onSelect: (p: Product) => void; t: (k: string) => string }> = ({ onSelect, t }) => (
  <div className="max-w-7xl mx-auto px-4 py-20 animate-in fade-in duration-700">
    <div className="text-center mb-16">
      <h2 className="text-5xl font-serif font-bold text-gold-chrome mb-4">{t('common.collection')}</h2>
      <p className="text-stone-400 uppercase tracking-widest">{t('common.curated')}</p>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {PRODUCTS.map(product => (
        <ProductCard key={product.id} product={product} onSelect={onSelect} t={t} />
      ))}
    </div>
  </div>
);

const GenresPage: React.FC<{ onSelectGenre: (g: string) => void; t: (k: string) => string }> = ({ onSelectGenre, t }) => {
  const genresList = [
    { 
      name: FilterType.ROCK, 
      img: IMAGES.genres.rock, 
      icon: <Disc size={32} />,
      subgenres: ["Classic Rock", "Psychedelic Rock", "Progressive Rock", "Art Rock", "Hard Rock", "Proto-Punk", "Garage Rock", "Surf Rock", "Krautrock", "Southern Rock", "Blues Rock"]
    },
    { 
      name: FilterType.JAZZ, 
      img: IMAGES.genres.jazz, 
      icon: <Music size={32} />,
      subgenres: ["Bebop", "Hard Bop", "Cool Jazz", "Modal Jazz", "Free Jazz", "Jazz Fusion", "Smooth Jazz", "Swing", "Latin Jazz"]
    },
    { 
      name: "Soul / R&B", 
      img: IMAGES.genres.soul, 
      icon: <Heart size={32} />,
      subgenres: ["Classic Soul", "Motown", "Northern Soul", "Stax Soul", "Neo-Soul", "Funk", "Boogie", "Disco"]
    },
    { 
      name: "Blues", 
      img: IMAGES.genres.blues, 
      icon: <Waves size={32} />,
      subgenres: ["Chicago Blues", "Delta Blues", "Electric Blues", "Country Blues"]
    },
    { 
      name: "Reggae & Dub", 
      img: IMAGES.genres.reggae, 
      icon: <Speaker size={32} />,
      subgenres: ["Roots Reggae", "Rocksteady", "Lovers Rock", "Dub Reggae", "Dancehall Classics"]
    },
    { 
      name: FilterType.HIP_HOP, 
      img: IMAGES.genres.hiphop, 
      icon: <Mic2 size={32} />,
      subgenres: ["Golden Age Hip Hop", "Old School Hip Hop", "Boom Bap", "Underground Hip Hop", "Instrumental Hip Hop", "Trip-Hop", "Turntablism"]
    },
    { 
      name: "Electronic", 
      img: IMAGES.genres.electronic, 
      icon: <Radio size={32} />,
      subgenres: ["House", "Deep House", "Chicago House", "Detroit Techno", "Acid House", "Garage House", "Minimal Techno", "Breakbeat", "Downtempo", "Ambient", "IDM", "Electro (80s)"]
    },
    { 
      name: FilterType.POP, 
      img: IMAGES.genres.pop, 
      icon: <Speaker size={32} />,
      subgenres: ["Dream Pop", "Synthpop", "New Wave", "Italo Disco", "City Pop", "Baroque Pop", "Soft Rock", "Yacht Rock"]
    },
    { 
      name: "World / Cultural", 
      img: IMAGES.genres.world, 
      icon: <Globe size={32} />,
      subgenres: ["Persian Funk", "Persian Pop 70s", "Turkish Psych", "Ethiopian Jazz", "Afrobeat", "Highlife", "Brazilian Bossa Nova", "Samba", "MPB", "Tango", "Flamenco", "Latin Soul", "Cumbia Classics"]
    },
    { 
      name: FilterType.SOUNDTRACKS, 
      img: IMAGES.genres.soundtracks, 
      icon: <Play size={32} />,
      subgenres: ["Film Scores (70s–90s)", "Horror Soundtracks", "Italian Giallo Soundtracks", "Blaxploitation Soundtracks", "Anime Vinyl Soundtracks", "Game OST Classics"]
    },
    { 
      name: "Experimental", 
      img: IMAGES.genres.experimental, 
      icon: <Headphones size={32} />,
      subgenres: ["Avant-Garde", "Post-Rock", "Shoegaze", "Noise Rock", "No Wave", "Minimalism"]
    },
    {
      name: FilterType.METAL,
      img: IMAGES.genres.metal,
      icon: <Disc size={32} />,
      subgenres: ["Heavy Metal", "Thrash Metal", "Death Metal", "Black Metal", "Doom Metal"]
    }
  ];

  return (
    <div>
      <ParallaxSection videoUrl={GENRES_VIDEO_URL} height="h-[60vh]">
         <h1 className="text-6xl md:text-8xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-gold-light via-white to-gold-dark mb-4 drop-shadow-2xl text-center">
            {t('genres.title')}
         </h1>
         <p className="text-xl text-stone-200 tracking-[0.2em] font-light uppercase bg-black/30 backdrop-blur-sm p-3 rounded">
            {t('genres.sub')}
         </p>
      </ParallaxSection>

      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {genresList.map((g) => (
            <div 
              key={g.name} 
              className="group relative overflow-hidden rounded-xl border border-white/10 bg-stone-900/50 flex flex-col h-full shadow-2xl transition-all duration-500 hover:shadow-[0_0_30px_rgba(197,160,89,0.15)]"
            >
              {/* Card Header / Image */}
              <div 
                className="relative h-64 overflow-hidden cursor-pointer"
                onClick={() => onSelectGenre(g.name)}
              >
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110" style={{ backgroundImage: `url(${g.img})` }}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent group-hover:via-black/20 transition-all duration-500"></div>
                
                <div className="absolute bottom-0 left-0 p-6 w-full flex items-center justify-between">
                   <div>
                     <h3 className="text-3xl font-serif font-bold text-white uppercase tracking-widest leading-none drop-shadow-md">{g.name}</h3>
                     <div className="h-1 w-12 bg-gold-light mt-2 group-hover:w-full transition-all duration-700 ease-out"></div>
                   </div>
                   <div className="text-gold-light opacity-80 group-hover:scale-110 transition-transform duration-300 bg-black/50 p-2 rounded-full border border-gold-dark/30">
                     {g.icon}
                   </div>
                </div>
              </div>

              {/* Subgenres List */}
              <div className="p-6 flex-1 bg-black/40 backdrop-blur-sm border-t border-white/5">
                 <div className="flex flex-wrap gap-2">
                    {g.subgenres.map(sub => (
                       <button 
                         key={sub}
                         onClick={() => onSelectGenre(sub)}
                         className="px-3 py-1.5 text-xs text-stone-400 font-bold uppercase tracking-wider border border-white/10 rounded-full hover:border-gold-light hover:text-gold-light hover:bg-gold-light/10 transition-all duration-300"
                       >
                         {sub}
                       </button>
                    ))}
                 </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const RaritiesPage: React.FC<{ onSelect: (p: Product) => void; t: (k: string) => string }> = ({ onSelect, t }) => {
  const rares = PRODUCTS.filter(p => p.rarity !== 'Common');
  return (
    <div>
      <ParallaxSection videoUrl={RARITY_VIDEO_URL} height="h-[60vh]">
         <h2 className="text-6xl font-serif font-black text-white mb-4 drop-shadow-xl border-b-4 border-gold-dark inline-block pb-2">{t('rarities.title')}</h2>
         <p className="text-xl text-stone-200 tracking-[0.3em] uppercase font-bold bg-black/40 p-2 rounded backdrop-blur-sm">{t('rarities.sub')}</p>
      </ParallaxSection>
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
           {rares.map(p => (
             <ProductCard key={p.id} product={p} onSelect={onSelect} t={t} />
           ))}
        </div>
      </div>
    </div>
  );
};

const FreeMusicPage: React.FC<{ t: (k: string) => string }> = ({ t }) => {
  return (
    <div className="min-h-screen">
       {/* Hero Section for Free Music */}
       <ParallaxSection videoUrl={FREE_MUSIC_VIDEO_URL} height="h-[60vh]">
          <h1 className="text-5xl md:text-7xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-telegram via-white to-telegram mb-4 drop-shadow-2xl animate-pulse-slow">
            {t('free_music.title')}
          </h1>
          <p className="text-xl text-stone-200 tracking-[0.2em] font-light uppercase bg-black/30 backdrop-blur-sm p-3 rounded">
            {t('free_music.sub')}
          </p>
       </ParallaxSection>

       {/* Content Section */}
       <div className="max-w-5xl mx-auto px-4 py-20">
          <div className="glass-panel p-10 md:p-16 rounded-3xl border-telegram/20 relative overflow-hidden">
             {/* Dynamic Gift Boxes Animation */}
             <div className="flex justify-center gap-20 mb-16 relative">
                 {[1, 2, 3].map((i) => (
                    <div key={i} className="relative group">
                       <Gift 
                         size={80} 
                         className="text-gold-light drop-shadow-[0_0_15px_rgba(252,246,186,0.6)] animate-float"
                         strokeWidth={1}
                       />
                       {/* Floating Music Notes */}
                       <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none">
                          <Music2 size={24} className="text-vivid-green absolute animate-float-up" style={{ animationDelay: `${i * 0.5}s`, left: '-10px' }} />
                          <Music size={20} className="text-telegram absolute animate-float-up" style={{ animationDelay: `${i * 0.5 + 0.5}s`, left: '10px' }} />
                          <Radio size={16} className="text-white absolute animate-float-up" style={{ animationDelay: `${i * 0.5 + 1.0}s`, top: '-10px' }} />
                       </div>
                    </div>
                 ))}
             </div>

             <div className="text-center space-y-8 relative z-10">
                <h2 className="text-4xl font-serif font-bold text-white">{t('free_music.gift')}</h2>
                <div className="space-y-6 text-lg text-stone-300 font-light leading-relaxed max-w-3xl mx-auto">
                   <p>
                     {t('free_music.p1')}
                   </p>
                   <p>
                     {t('free_music.p2')}
                   </p>
                   <div className="flex flex-wrap justify-center gap-4 text-sm font-bold uppercase tracking-widest text-stone-400 py-4">
                      <span className="px-4 py-2 border border-white/10 rounded-full flex items-center gap-2"><Disc size={16} className="text-gold-light" /> 320kbps MP3</span>
                      <span className="px-4 py-2 border border-white/10 rounded-full flex items-center gap-2"><Disc size={16} className="text-gold-light" /> WAV Format</span>
                      <span className="px-4 py-2 border border-white/10 rounded-full flex items-center gap-2"><Disc size={16} className="text-gold-light" /> Highest Quality</span>
                   </div>
                   <p>
                     {t('free_music.search')}
                   </p>
                </div>

                <div className="pt-8">
                   <a 
                     href={TELEGRAM_LINK} 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="inline-flex items-center justify-center gap-4 px-12 py-6 bg-telegram text-white font-bold text-xl uppercase tracking-widest rounded-full shadow-[0_0_30px_rgba(34,158,217,0.4)] hover:shadow-[0_0_50px_rgba(34,158,217,0.8)] hover:scale-105 transition-all duration-300 group"
                   >
                     <Send size={32} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                     <span>{t('free_music.download_btn')}</span>
                   </a>
                   <p className="mt-4 text-xs text-stone-500 uppercase tracking-widest">{t('free_music.opens_telegram')}</p>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};

const AboutPage: React.FC<{ t: (k: string) => string }> = ({ t }) => (
  <div>
    <ParallaxSection videoUrl={ABOUT_VIDEO_URL} height="h-[60vh]">
       <h2 className="text-6xl font-serif font-black text-white drop-shadow-2xl">{t('about.title')}</h2>
       <div className="mt-4 h-1 w-24 bg-gold-dark mx-auto"></div>
    </ParallaxSection>
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
         <div className="space-y-8 animate-in slide-in-from-left-10 duration-700">
            <h2 className="text-5xl md:text-6xl font-serif font-black leading-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-300 to-gray-500 drop-shadow-[0_2px_10px_rgba(255,255,255,0.3)] relative">
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-12 animate-scan opacity-50 pointer-events-none"></span>
                {t('about.chrome_title')}
            </h2>
            <div className="h-1 w-20 bg-gold-dark"></div>
            <p className="text-lg text-stone-300 leading-relaxed font-light">
              {t('about.p1')}
            </p>
            <p className="text-lg text-stone-300 leading-relaxed font-light">
              {t('about.p2')}
            </p>
         </div>
         <div className="relative animate-in slide-in-from-right-10 duration-700">
            <div className="absolute -inset-4 border-2 border-gold-dark/30 rounded-xl"></div>
            <video autoPlay muted loop playsInline className="rounded-xl shadow-2xl relative z-10 w-full object-cover">
               <source src={OWNER_VIDEO_URL} type="video/mp4" />
            </video>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
         <div className="p-8 glass-panel rounded-xl">
            <Disc size={48} className="mx-auto text-gold-light mb-6 animate-spin-slow" />
            <h3 className="text-xl font-serif font-bold text-white mb-4">{t('about.card1_title')}</h3>
            <p className="text-stone-400">{t('about.card1_desc')}</p>
         </div>
         <div className="p-8 glass-panel rounded-xl">
            <Speaker size={48} className="mx-auto text-gold-light mb-6" />
            <h3 className="text-xl font-serif font-bold text-white mb-4">{t('about.card2_title')}</h3>
            <p className="text-stone-400">{t('about.card2_desc')}</p>
         </div>
         <div className="p-8 glass-panel rounded-xl">
            <MessageCircle size={48} className="mx-auto text-gold-light mb-6" />
            <h3 className="text-xl font-serif font-bold text-white mb-4">{t('about.card3_title')}</h3>
            <p className="text-stone-400">{t('about.card3_desc')}</p>
         </div>
      </div>
    </div>
  </div>
);

const ContactPage: React.FC<{ t: (k: string) => string }> = ({ t }) => (
  <div>
    <ParallaxSection videoUrl={CONTACT_VIDEO_URL} height="h-[60vh]">
      <h2 className="text-6xl font-serif font-bold text-center text-white drop-shadow-2xl">{t('contact.title')}</h2>
    </ParallaxSection>
    <div className="max-w-4xl mx-auto px-4 py-20">
      <div className="glass-panel p-10 rounded-2xl border border-gold-dark/20 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-gold-light/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
         
         {/* Dynamic Moving Music Icons - High Definition */}
         <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
             <Music size={120} className="absolute -top-10 -left-10 text-white/5 animate-float shadow-lg" />
             <Disc size={150} className="absolute top-20 -right-20 text-gold-light/5 animate-spin-slow shadow-lg" />
             <Headphones size={80} className="absolute bottom-10 left-10 text-white/5 animate-float" style={{animationDelay: '1s'}} />
             <Mic2 size={60} className="absolute bottom-20 right-20 text-white/5 animate-pulse-slow" style={{animationDelay: '2s'}} />
             <Music2 size={40} className="absolute top-1/2 left-1/2 text-gold-light/10 animate-float" style={{animationDelay: '1.5s'}} />
             <Waves size={100} className="absolute top-10 right-1/3 text-white/5 animate-pulse-slow" />
             <Speaker size={90} className="absolute top-1/4 left-1/4 text-white/5 animate-float" style={{animationDelay: '0.5s'}} />
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
            <div className="space-y-8">
               <div>
                  <h3 className="text-2xl font-serif text-gold-light mb-2">{t('contact.visit')}</h3>
                  <p className="text-stone-300">{t('contact.address')}<br/>{t('contact.city')}</p>
               </div>
               <div>
                  <h3 className="text-2xl font-serif text-gold-light mb-2">{t('contact.management')}</h3>
                  <p className="text-stone-300">
                    <span className="font-bold text-white">{t('contact.owner_name')}</span><br/>
                    {t('contact.owner_role')}
                  </p>
               </div>
               <div>
                  <h3 className="text-2xl font-serif text-gold-light mb-2">{t('contact.hours')}</h3>
                  <p className="text-stone-300">{t('contact.time')}<br/>{t('contact.fri')}</p>
               </div>
               <div>
                  <h3 className="text-2xl font-serif text-gold-light mb-2">{t('contact.direct')}</h3>
                  <p className="text-stone-300 flex items-center gap-2"><Mail size={16}/> {EMAIL_ADDRESS}</p>
               </div>
            </div>
            
            <div className="flex flex-col gap-4 justify-center">
               <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-3 py-4 bg-vivid-green hover:bg-green-500 text-black font-bold uppercase tracking-widest rounded transition-all shadow-lg hover:shadow-green-500/30">
                  <MessageCircle size={20} /> {t('contact.whatsapp')}
               </a>
               <a href={TELEGRAM_LINK} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-3 py-4 bg-[#229ED9] hover:bg-[#1a8bc4] text-white font-bold uppercase tracking-widest rounded transition-all shadow-lg hover:shadow-blue-500/30">
                  <Send size={20} /> {t('contact.telegram')}
               </a>
               <a href={`mailto:${EMAIL_ADDRESS}`} className="flex items-center justify-center gap-3 py-4 bg-white/10 hover:bg-white/20 text-white font-bold uppercase tracking-widest rounded transition-all backdrop-blur-md">
                  <Mail size={20} /> {t('contact.email_us')}
               </a>
            </div>
         </div>
      </div>
    </div>
  </div>
);

// New Share Me Page Component

interface SocialButtonProps {
  href: string;
  icon: React.ReactNode;
  color: string;
  label: string;
}

const SocialButton: React.FC<SocialButtonProps> = ({ href, icon, color, label }) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    className={`flex flex-col items-center gap-2 text-stone-500 ${color} transition-all hover:scale-110 group`}
  >
    <div className="p-4 rounded-full border border-stone-800 bg-black/40 group-hover:bg-white/5 transition-colors">
      {icon}
    </div>
    <span className="text-[10px] uppercase tracking-wider font-bold opacity-0 group-hover:opacity-100 transition-opacity">{label}</span>
  </a>
);

const ShareMePage: React.FC<{ t: (k: string) => string }> = ({ t }) => {
  return (
    <div className="min-h-screen pt-20 flex flex-col items-center justify-center px-4 animate-in fade-in duration-700">
      <div className="max-w-2xl w-full glass-panel p-8 md:p-12 rounded-3xl border border-gold-dark/20 text-center relative overflow-hidden">
         {/* Decorative Background */}
         <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-gold-light/5 to-transparent pointer-events-none"></div>

         <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4 relative z-10">{t('share.title')} <span className="text-gold-chrome">{t('share.vibe')}</span></h2>
         <p className="text-stone-400 uppercase tracking-widest text-sm mb-12 relative z-10">{t('share.invite')}</p>

         <div className="bg-white p-6 rounded-xl inline-block shadow-2xl mb-12 transform hover:scale-105 transition-transform duration-500 relative z-10 group">
            <img
              src="https://wafisohswxqutsttotkb.supabase.co/storage/v1/object/public/Tek/QR%20CODE.png"
              alt="Scan to Visit"
              className="w-64 h-64 object-contain"
            />
            <p className="text-black text-[10px] font-bold uppercase tracking-[0.2em] mt-4 text-center">{t('share.scan')}</p>
         </div>

         <div className="flex flex-wrap justify-center gap-6 relative z-10">
            <SocialButton href="https://t.me/share/url?url=https://tehranrecords.vercel.app" icon={<Send size={24} />} color="hover:text-[#229ED9]" label="Telegram" />
            <SocialButton href="https://api.whatsapp.com/send?text=https://tehranrecords.vercel.app" icon={<MessageCircle size={24} />} color="hover:text-[#25D366]" label="WhatsApp" />
            <SocialButton href="mailto:?subject=Tehran Records&body=https://tehranrecords.vercel.app" icon={<Mail size={24} />} color="hover:text-white" label="Email" />
            <SocialButton href="https://www.instagram.com/?url=https://tehranrecords.vercel.app" icon={<Instagram size={24} />} color="hover:text-[#E1306C]" label="Instagram" />
            <SocialButton href="https://www.linkedin.com/sharing/share-offsite/?url=https://tehranrecords.vercel.app" icon={<Linkedin size={24} />} color="hover:text-[#0077b5]" label="LinkedIn" />
         </div>
      </div>
    </div>
  );
};

const OwnerTributeSection: React.FC<{ t: (k: string) => string }> = ({ t }) => {
  return (
    <div className="w-full bg-black relative z-10">
      {/* Section 1: Led Zeppelin / Rarities - Split View */}
      <div className="max-w-7xl mx-auto px-4 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center border-t border-white/5">
         {/* Text Side */}
         <div className="space-y-8 order-2 lg:order-1">
            <h2 className="text-4xl md:text-6xl font-serif font-black leading-tight text-white">
              {t('owner.golden_vault')}
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-gold-dark to-transparent"></div>
            <p className="text-lg text-stone-300 font-light leading-relaxed">
               {t('owner.p1')}
            </p>
            <p className="text-lg text-stone-300 font-light leading-relaxed">
               {t('owner.p2')}
            </p>
            <p className="text-lg text-stone-300 font-light leading-relaxed">
               {t('owner.p3')}
            </p>
         </div>
         {/* Video Side */}
         <div className="relative rounded-xl overflow-hidden shadow-[0_0_50px_rgba(170,119,28,0.15)] border border-gold-dark/30 group order-1 lg:order-2 h-[500px] bg-black">
            <div className="absolute inset-0 bg-black/10 z-10 group-hover:bg-transparent transition-colors duration-500 pointer-events-none"></div>
            <video autoPlay muted loop playsInline className="w-full h-full object-contain">
                <source src={RARITY_VIDEO_URL} type="video/mp4" />
            </video>
         </div>
      </div>

      {/* Section 2: Mr. Rahman Parallax */}
      <ParallaxSection videoUrl={OWNER_VIDEO_URL} height="h-[90vh]" objectFit="contain">
          <div className="max-w-6xl mx-auto text-center px-4 relative z-20">
            <h2 className="text-6xl md:text-9xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-b from-[#bf953f] via-[#fcf6ba] to-[#aa771c] mb-6 drop-shadow-[0_0_30px_rgba(197,160,89,0.5)] leading-tight tracking-tighter animate-in fade-in zoom-in duration-1000">
                {t('owner.owner_title')}
            </h2>
            <div className="flex justify-center mb-12">
               <div className="h-1 w-32 bg-gold-light shadow-[0_0_20px_rgba(252,246,186,0.8)]"></div>
            </div>
            
            <p className="text-xl md:text-3xl text-white font-serif italic leading-relaxed mb-8 drop-shadow-lg max-w-4xl mx-auto">
               {t('owner.quote')}
            </p>

            <div className="glass-panel p-8 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 inline-block">
               <span className="text-gold-light uppercase tracking-[0.3em] font-bold text-sm">{t('owner.role')}</span>
            </div>
          </div>
      </ParallaxSection>
    </div>
  );
};

const TurntableChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Greetings! I'm Spin, your virtual digging assistant. Looking for rare gold?", timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsThinking(true);

    const responseText = await generateChatResponse(messages, input);
    
    const modelMsg: ChatMessage = { role: 'model', text: responseText, timestamp: Date.now() };
    setMessages(prev => [...prev, modelMsg]);
    setIsThinking(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-[350px] sm:w-[400px] bg-[#1a1a1a] rounded-t-xl rounded-bl-xl shadow-[0_0_40px_rgba(0,0,0,0.8)] border border-gold-dark/40 overflow-hidden flex flex-col h-[550px] animate-float backdrop-blur-xl">
          <div className="bg-gradient-to-r from-black to-[#1a1a1a] p-4 flex items-center justify-between border-b border-gold-dark/20">
            <div className="flex items-center gap-3">
               <div className={`w-10 h-10 rounded-full gold-record flex items-center justify-center ${isThinking ? 'animate-spin' : ''}`}>
                  <div className="w-4 h-4 bg-black rounded-full border border-gold-light"></div>
               </div>
               <div>
                  <span className="text-gold-light font-serif font-bold text-sm block tracking-widest">SPIN ASSISTANT</span>
                  <span className="text-vivid-green text-[10px] uppercase tracking-widest block">
                     {isThinking ? 'Reading grooves...' : 'Ready to play'}
                  </span>
               </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-stone-500 hover:text-white transition">
              <ChevronDown size={20} />
            </button>
          </div>

          <div className="flex-1 bg-black/60 p-4 overflow-y-auto space-y-4 relative">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none"></div>
             {messages.map((msg, idx) => (
               <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                 <div className={`max-w-[85%] rounded-lg px-5 py-3 text-sm font-medium leading-relaxed ${
                   msg.role === 'user' 
                     ? 'bg-vivid-green text-black rounded-tr-none shadow-lg shadow-green-900/20' 
                     : 'bg-[#2a2a2a] text-stone-200 rounded-tl-none border border-white/5 shadow-lg'
                 }`}>
                   {msg.text}
                 </div>
               </div>
             ))}
             <div ref={messagesEndRef} />
          </div>

          <div className="bg-[#111] p-4 border-t border-gold-dark/20">
            <div className="flex gap-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about our gold collection..."
                className="flex-1 bg-black text-gold-light text-sm rounded-none border border-stone-800 px-4 py-3 focus:outline-none focus:border-gold-light focus:ring-1 focus:ring-gold-light placeholder-stone-600 transition-all"
              />
              <button 
                onClick={handleSend}
                disabled={isThinking}
                className="bg-gold-dark text-black px-4 rounded-none hover:bg-gold-light disabled:opacity-50 transition"
              >
                <Play size={18} fill="currentColor" />
              </button>
            </div>
          </div>
        </div>
      )}

      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="group flex items-center justify-center w-20 h-20 rounded-full bg-black shadow-[0_0_30px_rgba(197,160,89,0.3)] border-4 border-[#1a1a1a] hover:scale-110 transition-all duration-300 relative"
        >
          <div className="absolute inset-0 rounded-full border-2 border-gold-light animate-ping opacity-20"></div>
          <div className="w-16 h-16 rounded-full gold-record flex items-center justify-center animate-spin-slow group-hover:animate-spin">
            <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center">
               <div className="w-2 h-2 bg-gold-light rounded-full"></div>
            </div>
          </div>
        </button>
      )}
    </div>
  );
};

const SocialButtonSmall: React.FC<{href: string, icon: React.ReactNode}> = ({href, icon}) => (
  <a href={href} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full border border-stone-800 flex items-center justify-center text-stone-500 hover:text-gold-light hover:border-gold-light transition-all bg-black">
    {icon}
  </a>
);

// New Footer Component with collapsible sitemap
const Footer: React.FC<{ setPage: (page: Page) => void; t: (k: string) => string }> = ({ setPage, t }) => {
  // Set default to true as per "startup page" request
  const [isSitemapOpen, setIsSitemapOpen] = useState(true);

  // Consolidated links from Sidebar + Extra
  const links = {
    collections: ['nav.shop', 'nav.genres', 'nav.rarities', 'nav.free_music'],
    experience: ['nav.about', 'nav.contact', 'nav.share_me'],
    legal: ['footer.privacy', 'footer.cookies', 'footer.accessibility']
  };

  const mapPage = (key: string): Page => {
    switch(key) {
      case 'nav.shop': return 'shop';
      case 'nav.genres': return 'genres';
      case 'nav.rarities': return 'rarities';
      case 'nav.free_music': return 'free-music';
      case 'nav.about': return 'about';
      case 'nav.contact': return 'contact';
      case 'nav.share_me': return 'share-me';
      default: return 'home';
    }
  }

  return (
    <footer className="relative bg-black border-t border-gold-dark/40 z-30">
       <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30"></div>
       
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-12 pb-8">
          
          {/* Top Row: Logo & Toggle */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
             
             {/* Animated Gold Chrome Logo */}
             <div className="flex items-center gap-6 group cursor-pointer" onClick={() => setPage('home')}>
                <div className="relative w-24 h-24 rounded-full gold-record shadow-[0_0_40px_rgba(170,119,28,0.6)] animate-spin-slow group-hover:animate-spin border-2 border-[#fcf6ba]/50 flex items-center justify-center overflow-hidden">
                    {/* Inner Shine */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/60 to-transparent rotate-45 animate-pulse-slow"></div>
                    {/* Center Hole */}
                    <div className="w-8 h-8 bg-black rounded-full border border-gold-light/60 z-10 relative"></div>
                </div>
                
                <div className="flex flex-col relative overflow-hidden p-2">
                    {/* High Def Line Scan */}
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/80 to-transparent skew-x-[-20deg] translate-x-[-150%] animate-scan pointer-events-none mix-blend-overlay"></div>
                    
                    <h3 className="text-4xl md:text-5xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-b from-[#bf953f] via-[#fcf6ba] to-[#aa771c] tracking-tight leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                       TEHRAN
                    </h3>
                    <span className="text-sm font-sans font-bold text-gold-light uppercase tracking-[0.6em] ml-1 text-glow">
                       RECORDS
                    </span>
                </div>
             </div>

             {/* Toggle Button */}
             <button
               onClick={() => setIsSitemapOpen(!isSitemapOpen)}
               className="flex items-center gap-3 px-8 py-3 bg-white/5 hover:bg-white/10 border border-gold-dark/30 rounded-full transition-all duration-300 backdrop-blur-sm group hover:border-gold-light"
             >
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-stone-300 group-hover:text-gold-light">
                  {isSitemapOpen ? t('footer.close_sitemap') : t('footer.open_sitemap')}
                </span>
                <ChevronUp 
                  size={16} 
                  className={`text-gold-light transition-transform duration-500 ${isSitemapOpen ? 'rotate-0' : 'rotate-180'}`} 
                />
             </button>
          </div>

          {/* Collapsible Content */}
          <div className={`overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${isSitemapOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 py-8 border-t border-white/10">
                
                {/* Column 1 */}
                <div className="space-y-6">
                   <h4 className="text-gold-light font-serif font-bold text-xl mb-4 border-b border-gold-dark/30 pb-2 inline-block">{t('footer.collections')}</h4>
                   <ul className="space-y-3">
                      {links.collections.map(item => (
                         <li key={item}>
                            <button onClick={() => setPage(mapPage(item))} className="text-stone-400 hover:text-gold-light text-sm uppercase tracking-widest font-medium transition-colors flex items-center gap-2 group">
                               <span className="w-1.5 h-1.5 bg-stone-700 rounded-full group-hover:bg-gold-light transition-colors"></span>
                               {t(item)}
                            </button>
                         </li>
                      ))}
                   </ul>
                </div>

                {/* Column 2 */}
                <div className="space-y-6">
                   <h4 className="text-gold-light font-serif font-bold text-xl mb-4 border-b border-gold-dark/30 pb-2 inline-block">{t('footer.experience')}</h4>
                   <ul className="space-y-3">
                      {links.experience.map(item => (
                         <li key={item}>
                             <button onClick={() => setPage(mapPage(item))} className="text-stone-400 hover:text-gold-light text-sm uppercase tracking-widest font-medium transition-colors flex items-center gap-2 group">
                               <span className="w-1.5 h-1.5 bg-stone-700 rounded-full group-hover:bg-gold-light transition-colors"></span>
                               {t(item)}
                            </button>
                         </li>
                      ))}
                   </ul>
                </div>

                {/* Column 3: Contact */}
                <div className="space-y-6">
                   <h4 className="text-gold-light font-serif font-bold text-xl mb-4 border-b border-gold-dark/30 pb-2 inline-block">{t('footer.connect')}</h4>
                   <div className="text-stone-400 font-light text-sm space-y-4">
                      <p className="leading-relaxed">
                        <strong className="text-white block mb-1">{t('footer.hq')}</strong>
                        {t('contact.address')}<br/>{t('contact.city')}
                      </p>
                      <p className="leading-relaxed">
                        <strong className="text-white block mb-1">{t('footer.management')}</strong>
                        {t('contact.owner_name')}
                      </p>
                      <div className="flex gap-4 pt-4">
                         <SocialButtonSmall href={TELEGRAM_LINK} icon={<Send size={16} />} />
                         <SocialButtonSmall href={`https://wa.me/${WHATSAPP_NUMBER}`} icon={<MessageCircle size={16} />} />
                         <SocialButtonSmall href={`mailto:${EMAIL_ADDRESS}`} icon={<Mail size={16} />} />
                         <SocialButtonSmall href="#" icon={<Instagram size={16} />} />
                      </div>
                   </div>
                </div>

                {/* Column 4: Branding */}
                <div className="space-y-6 flex flex-col justify-between h-full">
                   <div>
                      <h4 className="text-gold-light font-serif font-bold text-xl mb-4 border-b border-gold-dark/30 pb-2 inline-block">{t('footer.legal')}</h4>
                      <ul className="space-y-2 mb-8">
                          {links.legal.map(item => (
                             <li key={item} className="text-stone-500 hover:text-stone-300 text-xs uppercase tracking-widest cursor-pointer">{t(item)}</li>
                          ))}
                      </ul>
                   </div>
                   <div className="text-[10px] text-stone-600 font-mono border-t border-white/5 pt-4">
                      <p>TEHRAN RECORDS © 2025</p>
                      <p>{t('footer.rights')}</p>
                   </div>
                </div>
             </div>
          </div>
          
          {/* Footer Bottom Strip (Always Visible) */}
          <div className="border-t border-white/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] text-stone-500 uppercase tracking-[0.2em] font-bold">
              <p>{t('footer.designed_by')}</p>
              <div className="flex gap-8 mt-4 md:mt-0">
                 <span>{t('footer.privacy')}</span>
                 <span>{t('footer.cookies')}</span>
                 <span>{t('footer.accessibility')}</span>
              </div>
          </div>
       </div>
    </footer>
  );
};

// 6. Main App Structure
const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>('en');

  // Theme Toggle Effect
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
    }
  }, [isDarkMode]);

  // Language Direction Effect
  useEffect(() => {
    document.documentElement.dir = language === 'fa' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  // Handle Genre selection from Genres Page
  const handleGenreSelect = (genreName: string) => {
    setSelectedGenre(genreName);
    setCurrentPage('home'); 
    setTimeout(() => {
        document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const t = (path: string) => getTranslation(language, path);

  const renderPage = () => {
    switch(currentPage) {
      case 'shop':
        return <ShopPage onSelect={setSelectedProduct} t={t} />;
      case 'genres':
        return <GenresPage onSelectGenre={handleGenreSelect} t={t} />;
      case 'rarities':
        return <RaritiesPage onSelect={setSelectedProduct} t={t} />;
      case 'free-music':
        return <FreeMusicPage t={t} />;
      case 'about':
        return <AboutPage t={t} />;
      case 'contact':
        return <ContactPage t={t} />;
      case 'share-me':
        return <ShareMePage t={t} />;
      case 'home':
      default:
        return (
          <>
            <Hero setPage={setCurrentPage} t={t} />
            <div id="catalog-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
              <div className="mb-12 flex items-end justify-between border-b border-white/10 pb-6">
                <div>
                   <h2 className="text-3xl font-serif text-white dark:text-white mb-2">{t('common.collection')}</h2>
                   <p className="text-stone-400 font-light text-sm tracking-widest uppercase">{t('common.curated')}</p>
                </div>
                
                {/* Minimal Filters for Home */}
                <div className="hidden md:flex gap-2">
                   <button onClick={() => setSelectedGenre(null)} className={`px-4 py-2 text-xs font-bold uppercase tracking-widest border ${!selectedGenre ? 'bg-gold-light text-black border-gold-light' : 'bg-transparent text-stone-400 border-stone-800'}`}>{t('common.all')}</button>
                   {selectedGenre && <button className="px-4 py-2 text-xs font-bold uppercase tracking-widest bg-gold-light text-black border-gold-light">{selectedGenre}</button>}
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12">
                {PRODUCTS.filter(p => !selectedGenre || p.genre === selectedGenre).map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onSelect={setSelectedProduct} 
                    t={t}
                  />
                ))}
              </div>
            </div>
            {/* Owner Tribute Section */}
            <OwnerTributeSection t={t} />
          </>
        );
    }
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-500`}>
      <FlashTransition />
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} onSelect={setSelectedProduct} t={t} />
      
      <div className="parallax-bg"></div>
      <div className="parallax-overlay"></div>

      <Header 
        cartCount={0} 
        currentPage={currentPage}
        setPage={setCurrentPage}
        toggleTheme={() => setIsDarkMode(!isDarkMode)}
        isDarkMode={isDarkMode}
        openSearch={() => setIsSearchOpen(true)}
        language={language}
        setLanguage={setLanguage}
        t={t}
      />
      
      <main className="flex-grow relative z-10">
        {renderPage()}
      </main>

      <Footer setPage={setCurrentPage} t={t} />
      
      <SocialProofBubble t={t} />

      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
          t={t}
        />
      )}
      
      <TurntableChat />
    </div>
  );
};

export default App;
