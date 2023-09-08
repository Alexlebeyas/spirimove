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

  const rewardLevel = levels.filter(({ participation_day }) => participation_day < stats.nb_days).length;

  const streakText = stats.streak > 1 ? t('MySpiriMove.Stats.Streak', { streak: stats.streak }) : '';

  return (
    <div className="mb-6 w-full overflow-hidden rounded-md bg-white shadow-md">
      <a
        href="#"
        className="block rounded-lg border border-gray-200 bg-white p-6 shadow hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
      >
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {t('MySpiriMove.Stats.Title', { name: stats.contest_name })}
        </h5>
        <p className="font-normal text-gray-700 dark:text-gray-400">
          {t('MySpiriMove.Stats.Points', { points: stats.nb_point })}
        </p>
        <p className="font-normal text-gray-700 dark:text-gray-400">
          {t('MySpiriMove.Stats.Days', { days: stats.nb_days })}
        </p>
        <p className="font-normal text-gray-700 dark:text-gray-400">{streakText}</p>
        <p className="font-normal text-gray-700 dark:text-gray-400">
          {t('MySpiriMove.Stats.RewardLevel', { rewardLevel: rewardLevel })}
        </p>
      </a>
    </div>
  );
};

export default MyContestScore;
