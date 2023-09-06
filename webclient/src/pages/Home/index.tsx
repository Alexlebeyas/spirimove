import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageContainer, ParticipationCard, ParticipateModal } from '@/components';
import CircularProgress from '@mui/material/CircularProgress';
import useContestStore from '@/stores/useContestStore';
import { fetchAllParticipations, fetchParticipationsType } from '@/stores/useParticipationStore';
import InfiniteScroll from 'react-infinite-scroll-component';

import 'react-toastify/dist/ReactToastify.css';


const Home = () => {
  const { t } = useTranslation();
  const { isLoading, participations, getParticipations, nextParticipations, next } = fetchAllParticipations((state) => state);
  const { getParticipationsTypes } = fetchParticipationsType((state) => state);

  const contest = useContestStore((state) => state.contest);

  const [isOpen, setIsOpen] = useState(false);
  if(isLoading){
    getParticipations();
    getParticipationsTypes();
  }

  const fetchNext = async () => {
    nextParticipations(participations, next);
  }

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
        <InfiniteScroll
          dataLength={participations.length}
          next={fetchNext}
          hasMore={!!next}
          loader={<CircularProgress color="inherit" />}
          endMessage={<p>{t('Participation.NoMoreToLoad')}</p>}
        >
          {!isLoading && participations?.length !== 0 &&
            participations?.map((participation) => (
              <ParticipationCard
                key={participation.id}
                participation={participation}
              />
            ))}
          </InfiniteScroll>
      </div>
      <ParticipateModal contestId={contest.id} startDate={contest.start_date} open={isOpen} setOpen={setIsOpen} />
    </PageContainer>
  );
};

export default Home;
