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
    <div className="mb-6 w-full overflow-hidden rounded-md bg-white shadow-md">
      <div className="block rounded-lg border border-gray-200 bg-white p-6 shadow hover:bg-gray-100 dark:border-gray-700">
        <h6 className="mb-2 text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
          {stats.contest_name}
        </h6>
        <div className="flex items-center m-4">
          <h3 className="font-medium tracking-tight text-gray-900">
            {stats.nb_point} <span className="text-sm font-normal mr-6">{t('MySpiriMove.Stats.Points')}</span>
          </h3>
          <span className="text-gray-300 align-middle inline-block transform scale-y-150">|</span>
          <h3 className="font-medium tracking-tight text-gray-900 dark:text-white ml-6">
            {stats.nb_days} <span className="text-sm font-normal">{t('MySpiriMove.Stats.Days')}</span>
          </h3>
        </div>
        <p className="ml-4 text-sm font-normal text-gray-900">
          {t('MySpiriMove.Stats.RewardLevel', { rewardLevel: rewardLevel })}
        </p>
      </div>
    </div>
  );
};

export default MyContestScore;
