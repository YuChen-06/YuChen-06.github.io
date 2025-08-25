// 客户端多语言工具
import { detectLanguage, setCurrentLanguage } from '../i18n/config.js';
import { t } from '../i18n/translations.js';

// 初始化多语言系统
export function initI18n() {
  const currentLang = detectLanguage();
  setCurrentLanguage(currentLang);
  updatePageContent(currentLang);

  // 监听语言变更事件
  window.addEventListener('languageChanged', function(event) {
    updatePageContent(event.detail.language);
  });
}

// 更新页面内容
export function updatePageContent(language) {
  // 更新所有带有 data-i18n 属性的元素
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(element => {
    const key = element.getAttribute('data-i18n');
    const translatedText = t(key, language);
    if (translatedText && translatedText !== key) {
      element.textContent = translatedText;
    }
  });

  // 更新带有 data-i18n-attr 属性的元素属性
  const attrElements = document.querySelectorAll('[data-i18n-attr]');
  attrElements.forEach(element => {
    const attrConfig = element.getAttribute('data-i18n-attr');
    try {
      const config = JSON.parse(attrConfig);
      Object.entries(config).forEach(([attr, key]) => {
        const translatedText = t(key, language);
        if (translatedText && translatedText !== key) {
          element.setAttribute(attr, translatedText);
        }
      });
    } catch (e) {
      console.warn('Invalid data-i18n-attr format:', attrConfig);
    }
  });

  // 更新页面标题
  updatePageTitle(language);
  
  // 更新 HTML lang 属性
  document.documentElement.lang = language;
}

// 更新页面标题
export function updatePageTitle(language) {
  const currentPath = window.location.pathname;
  let titleKey = 'pageTitle.home';
  
  if (currentPath.includes('/blog')) {
    titleKey = 'pageTitle.blog';
  } else if (currentPath.includes('/tags')) {
    titleKey = 'pageTitle.tags';
  } else if (currentPath.includes('/about')) {
    titleKey = 'pageTitle.about';
  } else if (currentPath.includes('/search')) {
    titleKey = 'pageTitle.search';
  }
  
  const title = t(titleKey, language);
  const siteName = '我的 Astro 博客';
  document.title = `${title} | ${siteName}`;
}

// 自动初始化（当脚本加载时）
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initI18n);
  } else {
    initI18n();
  }
}
