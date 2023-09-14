import { PageContainer, ParticipateModal, ParticipationCard } from '@/components';
import { useContest } from '@/hooks';
import { fetchAllParticipations, fetchParticipationsType } from '@/stores/useParticipationStore';
import CircularProgress from '@mui/material/CircularProgress';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import AddIcon from '@mui/icons-material/Add';

import InfiniteScroll from 'react-infinite-scroll-component';

import 'react-toastify/dist/ReactToastify.css';

const Home = () => {
  const { t } = useTranslation();
  const { isLoading, participations, getParticipations, nextParticipations, next } = fetchAllParticipations(
    (state) => state
  );
  const { getParticipationsTypes } = fetchParticipationsType((state) => state);

  const { contest } = useContest();

  const [isOpen, setIsOpen] = useState(false);
  if (isLoading) {
    getParticipations();
    getParticipationsTypes();
  }

  const fetchNext = async () => {
    nextParticipations(participations, next);
  };

  return (
    <PageContainer>
      {contest ? (
        <>
          <div className="flex flex-col items-center justify-center">
            <button
              className="mb-7 w-full rounded-md bg-darkblue-800 py-4 text-base font-bold text-white antialiased hover:bg-blue"
              onClick={() => setIsOpen(true)}
            >
              {<AddIcon className="mr-3" />}
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
              {!isLoading &&
                participations?.length !== 0 &&
                participations?.map((participation) => (
                  <ParticipationCard key={participation.id} participation={participation} />
                ))}
            </InfiniteScroll>
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
