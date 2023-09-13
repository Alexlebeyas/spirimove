import { PageContainer, ParticipateModal, ParticipationCard } from '@/components';
import { useContest } from '@/hooks';
import { fetchAllParticipations, fetchParticipationsType } from '@/stores/useParticipationStore';
import CircularProgress from '@mui/material/CircularProgress';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AddIcon from '@mui/icons-material/Add';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import 'react-toastify/dist/ReactToastify.css';

const Home = () => {
  const { t } = useTranslation();
  const { isLoading, participations, getParticipations, nextParticipations, next } = fetchAllParticipations();
  const { getParticipationsTypes } = fetchParticipationsType();

  const { contest } = useContest();

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isLoading) {
      getParticipations();
      getParticipationsTypes();
    }
  }, [getParticipations, getParticipationsTypes, isLoading]);

  const fetchNext = async () => {
    nextParticipations(participations, next);
  };

  const [sentryRef] = useInfiniteScroll({
    loading: isLoading,
    hasNextPage: !!next,
    onLoadMore: fetchNext,
    rootMargin: '0px 0px 400px 0px',
  });

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
            {!isLoading && participations?.length !== 0 && participations.map((participation) => (
              <ParticipationCard key={participation.id} participation={participation} />
            ))}
            {(isLoading || next) && (
              <div ref={sentryRef}>
                <CircularProgress color="inherit" />
              </div>
            )}
            {!next && <p>{t('Participation.NoMoreToLoad')}</p>}
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
