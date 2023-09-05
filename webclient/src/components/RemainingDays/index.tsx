import { useContest } from '@/hooks';
import { daysInterval } from '@/utils/dates';
import { DateTime } from 'luxon';
import { t } from 'i18next';

const RemainingDays = () => {
  const { contest } = useContest();

  if (!contest) return null;

  const currentDay = 1 + daysInterval(DateTime.fromISO(contest.start_date), DateTime.now());
  const remaining = daysInterval(DateTime.now(), DateTime.fromISO(contest.end_date));

  return (
    <>
      <div className="m-2 flex flex-col items-center">
        <div className="grow items-center border-b p-1">
          <div className="text-xs font-medium text-gray-500">Day</div>
          <div className="text-4xl font-semibold">{currentDay}</div>
        </div>
        <div className="text-base font-semibold ">{t('Leaderboard.RemainingDays.Stimulation')}</div>
        <div className="text-xs font-medium text-gray-500">
          {t('Leaderboard.RemainingDays.ContestEnds', { contest: contest.name, remaining: remaining })}
        </div>
      </div>
    </>
  );
};

export default RemainingDays;
