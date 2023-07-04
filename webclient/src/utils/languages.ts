const localStorageKey = 'currentLang';
let currentLanguage: string;

export const LANGUAGES = {
  EN: {
    name: 'en',
    key: 'English',
  },
  FR: {
    name: 'fr',
    key: 'French',
  },
};

export const getCurrentLanguage = function () {
  if (!currentLanguage) {
    const language = localStorage.getItem(localStorageKey) ?? LANGUAGES.EN.name;
    setCurrentLanguage(language);
  }
  return currentLanguage;
};

export const setCurrentLanguage = function (lang: string) {
  localStorage.setItem(localStorageKey, lang);
  currentLanguage = lang;
};
