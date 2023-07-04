import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageContainer, ParticipationCard, ParticipateModal } from '@/components';
import CircularProgress from '@mui/material/CircularProgress';
import useContestStore from '@/stores/useContestStore';
import useParticipationStore from '@/stores/useParticipationStore';

const Home = () => {
  const { t } = useTranslation();

  const contest = useContestStore((state) => state.contest);
  const { isLoading, participations } = useParticipationStore((state) => state);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <PageContainer>
      <div className="flex flex-col items-center justify-center">
        <button
          className="mb-6 w-full rounded-md bg-gray-800 py-5 text-xl text-white hover:bg-gray-700"
          onClick={() => setIsOpen(true)}
        >
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
      <ParticipateModal contestId={contest.id} startDate={contest.start_date} open={isOpen} setOpen={setIsOpen} />
    </PageContainer>
  );
};

export default Home;
