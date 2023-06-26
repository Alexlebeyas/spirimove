import { Language, Languages, defaultLanguage, getCurrentLanguage, setCurrentLanguage } from '@/utils/languages';
import i18next from 'i18next';
import { useState } from 'react';

const LanguageSwitcher = () => {
    const [curLang, setLang] = useState<Language>(getCurrentLanguage());

    const handleClick = (currentLang: Language) => {
        setLang(currentLang);
        i18next.changeLanguage(currentLang.langId, (err: any) => {
            if (err) {
                return console.log('something went wrong loading', err);
            }
        });
        setCurrentLanguage(currentLang);
    };

    const displayLang = Languages.find(l => l.langId != curLang.langId) ?? defaultLanguage;

    return <button onClick={() => handleClick(displayLang)}>{displayLang.langText}</button>;
}

export default LanguageSwitcher;