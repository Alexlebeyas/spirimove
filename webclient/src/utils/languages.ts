export interface Language {
  langId: string;
  langText: string;
}

const localStorageKey = 'currentLang';
let currentLanguage: Language;

export const defaultLanguage: Language = {
  langId: 'en',
  langText: 'English',
};

export const Languages = [
  {
    langId: 'en',
    langText: 'English',
  },
  {
    langId: 'fr',
    langText: 'Français',
  },
];

export const getLanguageById = function (langId: string): Language | undefined {
  return Languages.find((l) => l.langId === langId);
};

export const getCurrentLanguage = function () {
  if (!currentLanguage) {
    const langId = localStorage.getItem(localStorageKey) ?? Languages[0].langId;
    const value = getLanguageById(langId) ?? Languages[0];
    setCurrentLanguage(value);
  }
  return currentLanguage;
};

export const setCurrentLanguage = function (lang: Language) {
  localStorage.setItem(localStorageKey, lang.langId);
  currentLanguage = lang;
};
