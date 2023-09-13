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
      <div className="block rounded-lg border border-gray-200 bg-white p-6 shadow ">
        <h5 className="mb-2 text-xl font-bold text-darkblue-800 lg:text-lg">
          {t('MySpiriMove.Stats.Title', { name: stats.contest_name })}
        </h5>
        <p className="font-normal text-gray-700">{t('MySpiriMove.Stats.Points', { points: stats.nb_point })}</p>
        <p className="font-normal text-gray-700">{t('MySpiriMove.Stats.Days', { days: stats.nb_days })}</p>
        <p className="font-normal text-gray-700">{streakText}</p>
        <p className="font-normal text-gray-700">{t('MySpiriMove.Stats.RewardLevel', { rewardLevel: rewardLevel })}</p>
      </div>
    </div>
  );
};

export default MyContestScore;
