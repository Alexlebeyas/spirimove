import { useTranslation } from 'react-i18next';

const Home = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center">
      <h1>{t('Home.Title')}</h1>
      <h2>{t('Home.Message')}</h2>
    </div>
  );
};

export default Home;
