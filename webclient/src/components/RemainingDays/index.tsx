import { useContest } from '@/hooks';
import { daysInterval } from '@/utils/dates';
import { DateTime } from 'luxon';

const RemainingDays = () => {
  const { contest, isLoading } = useContest();

  if (isLoading) return <></>;

  if (!contest) return <></>;

  const currentDay = 1 + daysInterval(DateTime.fromISO(contest.start_date), DateTime.now());
  const remaining = daysInterval(DateTime.now(), DateTime.fromISO(contest.end_date));

  return (
    <>
      <div className="m-2 flex flex-col items-center">
        <div className="grow items-center border-b p-1">
          <div className="text-xs font-medium text-gray-500">Day</div>
          <div className="text-4xl font-semibold">{currentDay}</div>
        </div>
        <div className="text-base font-semibold ">Don't give up!</div>
        <div className="text-xs font-medium text-gray-500">
          {contest.name} ends in {remaining} days.
        </div>
      </div>
    </>
  );
};

export default RemainingDays;
