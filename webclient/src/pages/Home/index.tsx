import { useTranslation } from 'react-i18next';
import { ParticipationCard } from '@/components';
import { useParticipations } from '@/hooks';
import CircularProgress from '@mui/material/CircularProgress';

const Home = () => {
  const { t } = useTranslation();

  const { isLoading, participations } = useParticipations();

  return (
    <div className="flex flex-col items-center justify-center">
      <button className="mb-6 w-full rounded-md bg-gray-800 py-5 text-xl text-white hover:bg-gray-700">
        {t('Home.AddParticipation')}
      </button>
      {isLoading && <CircularProgress color="inherit" />}
      {participations.length !== 0 &&
        participations.map((participation) => (
          <ParticipationCard
            key={participation.id}
            description={participation.description}
            image={participation.image}
            dateCreated={participation.date_created}
            date={participation.date}
            user={participation.user}
          />
        ))}
    </div>
  );
};

export default Home;
