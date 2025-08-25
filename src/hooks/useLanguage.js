import { useState, useEffect } from 'preact/hooks';
import { 
  detectLanguage, 
  setCurrentLanguage, 
  getCurrentLanguage,
  languages 
} from '../i18n/config.js';
import { t } from '../i18n/translations.js';

// 语言切换 Hook
export function useLanguage() {
  const [currentLang, setCurrentLang] = useState(detectLanguage());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 初始化语言
    const initLang = detectLanguage();
    setCurrentLang(initLang);
    setCurrentLanguage(initLang);
    setIsLoading(false);

    // 监听语言变更事件
    const handleLanguageChange = (event) => {
      setCurrentLang(event.detail.language);
    };

    window.addEventListener('languageChanged', handleLanguageChange);

    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange);
    };
  }, []);

  const changeLanguage = (langCode) => {
    if (languages[langCode]) {
      setCurrentLang(langCode);
      setCurrentLanguage(langCode);
      
      // 添加页面过渡效果
      document.body.style.opacity = '0.8';
      setTimeout(() => {
        document.body.style.opacity = '1';
      }, 150);
    }
  };

  const translate = (key, params = {}) => {
    return t(key, currentLang, params);
  };

  return {
    currentLanguage: currentLang,
    availableLanguages: languages,
    changeLanguage,
    translate,
    isLoading
  };
}

// 翻译组件
export function Trans({ i18nKey, params = {}, children, ...props }) {
  const { translate } = useLanguage();
  
  if (children) {
    return <span {...props}>{children}</span>;
  }
  
  return <span {...props}>{translate(i18nKey, params)}</span>;
}

// 语言切换器组件
export function LanguageSwitcher({ className = '', onLanguageChange }) {
  const { currentLanguage, availableLanguages, changeLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageSelect = (langCode) => {
    changeLanguage(langCode);
    setIsOpen(false);
    if (onLanguageChange) {
      onLanguageChange(langCode);
    }
  };

  const currentLangInfo = availableLanguages[currentLanguage];

  return (
    <div className={`language-switcher ${className}`}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="language-button"
        aria-label="Switch language"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="language-icon"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="2" y1="12" x2="22" y2="12"></line>
          <path d="M12 2a15.3 15.3 0 0 1 4 18 15.3 15.3 0 0 1-8 0 15.3 15.3 0 0 1 4-18z"></path>
        </svg>
        <span className="language-text">
          {currentLangInfo?.name}
        </span>
      </button>
      
      {isOpen && (
        <div className="language-dropdown">
          {Object.entries(availableLanguages).map(([code, lang]) => (
            <button
              key={code}
              onClick={() => handleLanguageSelect(code)}
              className={`language-option ${code === currentLanguage ? 'active' : ''}`}
            >
              <span className="language-name">{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
