import { useContest } from '@/hooks';
import { daysInterval } from '@/utils/dates';
import { DateTime } from 'luxon';
import { t } from 'i18next';
import { CircularProgress } from '@mui/material';

const RemainingDays = () => {
  const { contest } = useContest();

  if (!contest) return null;

  const today = DateTime.now();

  const currentDay = 1 + daysInterval(DateTime.fromISO(contest.start_date), today);
  const remainingDays = Math.max(0, daysInterval(today, DateTime.fromISO(contest.end_date)));
  const totalDays = remainingDays + currentDay;

  const progressValue = Math.round(50 * (currentDay / totalDays));

  return (
    <>
      <div className="m-2 flex flex-col items-center">
        <div className="relative flex grow flex-col items-center">
          <div className="absolute -bottom-[75px] z-0 flex -rotate-90">
            <CircularProgress size={150} variant="determinate" value={progressValue} />
          </div>
          <div className="z-10 mt-4 grow items-center border-b">
            <div className="text-xs font-medium text-gray-500">Day</div>
            <div className="text-4xl font-semibold">{currentDay}</div>
          </div>
        </div>
        <div className="z-10 text-base font-semibold ">{t('Leaderboard.RemainingDays.Stimulation')}</div>
        <div className="z-10 text-xs font-medium text-gray-500">
          {t('Leaderboard.RemainingDays.ContestEnds', { contest: contest.name, remaining: remainingDays })}
        </div>
      </div>
    </>
  );
};

export default RemainingDays;
