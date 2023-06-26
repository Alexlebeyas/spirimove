import { useIsAuthenticated } from "@azure/msal-react";
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from "@/components/LanguageSwitcher";

const Home = () => {
  const { t } = useTranslation();

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-[#e0303b]">
      <h1>{t('Home.Title')}</h1>
      <h2>{t('Home.Message')}</h2>
      <LanguageSwitcher />
    </div>
  );
};

export default Home;
