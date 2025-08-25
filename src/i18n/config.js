// 多语言配置文件
export const languages = {
  'zh-cn': {
    code: 'zh-cn',
    name: '简体中文'
  },
  'zh-tw': {
    code: 'zh-tw',
    name: '繁體中文'
  },
  'en': {
    code: 'en',
    name: 'English'
  }
};

export const defaultLanguage = 'zh-cn';

// 语言检测函数
export function detectLanguage() {
  // 1. 检查 localStorage
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('preferred-language');
    if (stored && languages[stored]) {
      return stored;
    }
    
    // 2. 检查浏览器语言
    const browserLang = navigator.language.toLowerCase();
    
    // 精确匹配
    if (languages[browserLang]) {
      return browserLang;
    }
    
    // 部分匹配（如 zh-CN 匹配 zh-cn）
    const langCode = browserLang.split('-')[0];
    for (const [key, lang] of Object.entries(languages)) {
      if (key.startsWith(langCode)) {
        return key;
      }
    }
  }
  
  // 3. 返回默认语言
  return defaultLanguage;
}

// 保存语言偏好
export function saveLanguagePreference(langCode) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('preferred-language', langCode);
  }
}

// 获取当前语言
export function getCurrentLanguage() {
  if (typeof window !== 'undefined') {
    return window.__currentLanguage || detectLanguage();
  }
  return defaultLanguage;
}

// 设置当前语言
export function setCurrentLanguage(langCode) {
  if (typeof window !== 'undefined') {
    window.__currentLanguage = langCode;
    saveLanguagePreference(langCode);
    
    // 触发语言变更事件
    window.dispatchEvent(new CustomEvent('languageChanged', {
      detail: { language: langCode }
    }));
  }
}
