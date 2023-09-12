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
  const isOver = remainingDays == 0;
  const progressValue = Math.round(50 * (currentDay / totalDays));

  return (
    <>
      <div className="m-2 flex flex-col items-center">
        <div className="relative flex grow flex-col items-center">
          <div className="absolute -bottom-[87px] z-0 flex -rotate-90 pb-3">
            <CircularProgress
              size={174}
              variant="determinate"
              sx={{ color: '#708EF4' }}
              thickness={2.1}
              value={progressValue}
            />
          </div>
          <div className="z-10 mt-5 grow items-center border-b-2 border-slate-200 pb-3">
            <div className="text-center text-xs font-medium text-slate-600">
              {t('Leaderboard.RemainingDays.CurrentDay')}
            </div>
            <div className="text-4xl font-semibold text-darkblue-800">{currentDay}</div>
          </div>
        </div>
        <div className="z-10 pt-3 text-base font-medium text-darkblue-800 ">
          {t(isOver ? 'Leaderboard.RemainingDays.Congratulations' : 'Leaderboard.RemainingDays.Stimulation')}
        </div>
        <div className="z-10 mt-1 text-xs font-medium text-slate-500">
          {isOver
            ? t('Leaderboard.RemainingDays.ContestFinished', { contest: contest.name })
            : t('Leaderboard.RemainingDays.ContestEnding', { contest: contest.name, remaining: remainingDays })}
        </div>
      </div>
    </>
  );
};

export default RemainingDays;
