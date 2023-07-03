import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const NotFound = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="mb-2"> {t('NotFound.Title')}</h1>
      <button className="font-semibold underline" onClick={() => navigate(-1)}>
        {t('NotFound.GoBack')}
      </button>
    </div>
  );
};

export default NotFound;
