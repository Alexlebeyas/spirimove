import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useLocation } from 'react-router-dom';
import useInfiniteScroll from 'react-infinite-scroll-hook';

import { PageContainer, ParticipateModal, ParticipationCard } from '@/components';
import { useContest } from '@/hooks';
import { fetchAllParticipations, fetchParticipationsType } from '@/stores/useParticipationStore';
import 'react-toastify/dist/ReactToastify.css';

const Home = () => {
  const { t } = useTranslation();

  const { isLoading: isLoadingParticipationsType, getParticipationsTypes } = fetchParticipationsType();

  const {
    isLoading: isLoadingParticipations,
    participations,
    getParticipations,
    nextParticipations,
    next,
  } = fetchAllParticipations();
  const location = useLocation();

  const { contest } = useContest();

  const [isOpen, setIsOpen] = useState(false);

  const fetchNext = async () => {
    nextParticipations(participations, next);
  };

  const [sentryRef] = useInfiniteScroll({
    loading: isLoadingParticipations,
    hasNextPage: !!next,
    onLoadMore: fetchNext,
    rootMargin: '0px 0px 400px 0px',
  });

  useEffect(() => {
    if (isLoadingParticipationsType) {
      getParticipationsTypes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingParticipationsType]);

  useEffect(() => {
    getParticipations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const AddNewActivityButton = () => (
    <button
      className="mb-7 w-full rounded-md bg-darkblue-800 py-4 text-base font-bold text-white antialiased hover:bg-blue"
      onClick={() => setIsOpen(true)}
    >
      <AddIcon className="mr-3" />
      {t('Home.AddNewActivity')}
    </button>
  );

  const ContestOverView = () => (
    <div className="mb-2 flex flex-col items-center justify-center">
      <h4 className="mb-3 text-xl text-darkblue-800 sm:text-2xl">{t('Home.ContestStatusOver')}</h4>
      {contest?.show_winners && <Link
        to="/leaderboard"
        className="mb-7 flex items-center justify-center rounded-md bg-yellow px-6 py-4 text-base font-bold text-darkblue-800 antialiased hover:bg-blue hover:text-white"
      >
        {t('Home.ViewResults')} <ArrowForwardIcon className="ml-2" />
      </Link>}
    </div>
  );

  const renderContestStatusComponent = () => {
    if (!contest?.is_open) {
      return <ContestOverView />;
    }
    return <AddNewActivityButton />;
  }

  return (
    <PageContainer>
      {contest ? (
        <>
          <div className="flex flex-col items-center justify-center">
            {renderContestStatusComponent()}

            {isLoadingParticipations && <CircularProgress color="inherit" />}
            {!isLoadingParticipations &&
              participations?.length !== 0 &&
              participations.map((participation) => (
                <ParticipationCard key={participation.id} participation={participation} />
              ))}
            {(isLoadingParticipations || next) && (
              <div ref={sentryRef}>
                <CircularProgress color="inherit" />
              </div>
            )}
            {!next && <p>{t('Participation.NoMoreToLoad')}</p>}
          </div>
          <ParticipateModal contestId={contest.id} endDate={contest.end_date} startDate={contest.start_date} open={isOpen} setOpen={setIsOpen} />
        </>
      ) : (
        <></>
      )}
    </PageContainer>
  );
};

export default Home;
