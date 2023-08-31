import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageContainer, ParticipationCard, ParticipateModal } from '@/components';
import CircularProgress from '@mui/material/CircularProgress';
import { fetchAllParticipations, fetchParticipationsType } from '@/stores/useParticipationStore';

import 'react-toastify/dist/ReactToastify.css';
import { useContest } from '@/hooks/useContest';

const Home = () => {
  const { t } = useTranslation();
  const { isLoading, participations, getParticipations } = fetchAllParticipations((state) => state);
  const { getParticipationsTypes } = fetchParticipationsType((state) => state);

  const { contest } = useContest();

  const [isOpen, setIsOpen] = useState(false);
  if (isLoading) {
    getParticipations();
    getParticipationsTypes();
  }

  return (
    <PageContainer>
      {contest ? (
        <>
          <div className="flex flex-col items-center justify-center">
            <button
              className="mb-6 w-full rounded-md bg-gray-800 py-5 text-xl text-white hover:bg-gray-700"
              onClick={() => setIsOpen(true)}
            >
              {t('Home.AddParticipation')}
            </button>
            {isLoading && <CircularProgress color="inherit" />}
            {!isLoading &&
              participations?.length !== 0 &&
              participations?.map((participation) => (
                <ParticipationCard key={participation.id} participation={participation} />
              ))}
          </div>
          <ParticipateModal contestId={contest.id} startDate={contest.start_date} open={isOpen} setOpen={setIsOpen} />
        </>
      ) : (
        <></>
      )}
    </PageContainer>
  );
};

export default Home;
