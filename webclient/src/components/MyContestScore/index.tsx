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
    <div className="mb-6 w-full max-w-[350px] overflow-hidden rounded-md bg-white shadow-md">
      <div className="block rounded-lg border border-gray-200 bg-white p-6 shadow">
        <h6 className="text-xl font-semibold tracking-tight text-gray-900">
          {t('MySpiriMove.Stats.Title')}
        </h6>
        <div className="flex flex-col justify-center items-left h-full">
          <div className="flex items-center m-4">
            <h3 className="font-medium tracking-tight text-gray-900">
              {stats.nb_point} <span className="text-sm font-normal mr-7">{t('MySpiriMove.Stats.Points')}</span>
            </h3>
            <span className="text-gray-300 align-middle inline-block transform scale-y-150">|</span>
            <h3 className="font-medium tracking-tight text-gray-900 ml-7">
              {stats.nb_days} <span className="text-sm font-normal">{t('MySpiriMove.Stats.Days')}</span>
            </h3>
          </div>
          <p className="ml-4 text-sm font-normal text-gray-900">
            {t('MySpiriMove.Stats.RewardLevel', { count: rewardLevel })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MyContestScore;
