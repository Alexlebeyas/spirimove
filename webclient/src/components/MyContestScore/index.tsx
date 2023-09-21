import { useEffect } from 'react';
import { useContest } from '@/hooks';
import { useMyStats } from '@/hooks/useMyStats';
import { CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import useLevelStore from '@/stores/useLevelStore';

const MyContestScore = () => {
  const { contest } = useContest();
  const { t } = useTranslation();
  const stats = useMyStats(contest);
  const { levels, fetchLevel } = useLevelStore((state) => state);

  useEffect(() => {
    fetchLevel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!stats) {
    return (
      <div className="flex items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  const rewardLevel = levels.filter(({ participation_day }) => participation_day <= stats.nb_days).length;

  return (
    <div className="mx-4 mb-6 max-w-full rounded-md bg-white shadow-md sm:mx-0 sm:max-w-[350px]">
      <div className="p-5 antialiased">
        <h6 className="text-xl font-bold text-darkblue-800 lg:text-lg">{t('MySpiriMove.Stats.Title')}</h6>
        <div className="items-left flex h-full flex-col justify-center">
          <div className="m-4 flex items-center">
            <h3 className="border-r-2 border-slate-200 text-4xl font-semibold text-darkblue-800">
              {stats.nb_point}{' '}
              <span className="mr-7 text-[13px] font-medium leading-[14px] sm:text-xs">
                {t('MySpiriMove.Stats.Points')}
              </span>
            </h3>

            <h3 className="ml-7 text-4xl font-semibold text-darkblue-800">
              {stats.nb_days}{' '}
              <span className="text-[13px] font-medium leading-[14px] sm:text-xs">{t('MySpiriMove.Stats.Days')}</span>
            </h3>
          </div>
          <p className="ml-4 text-sm font-medium text-darkblue-800 sm:text-xs">
            {t('MySpiriMove.Stats.RewardLevel', { count: rewardLevel })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MyContestScore;
