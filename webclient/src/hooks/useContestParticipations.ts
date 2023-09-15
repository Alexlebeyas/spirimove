import { useEffect, useMemo } from 'react';
import { getDates } from '@/utils/dates';
import { IMySpiriMoveProgress } from '@/interfaces/IMySpiriMoveProgress';
import { fetchMyParticipations } from '@/stores/useParticipationStore';
import { useContest } from '@/hooks/useContest';

export const useContestParticipations = () => {
  const { contest } = useContest();
  const { start_date = '', end_date = '', id: contestId = 0 } = contest || {};
  const { isLoading, participations, getParticipations: getMyParticipations } = fetchMyParticipations();

  const contestParticipations: IMySpiriMoveProgress[] = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const datesArray = getDates(start_date, end_date)
      .filter(date => date <= today);
    return datesArray
      .map((date) => {
        const dailyParticipations = participations?.filter((p) => p.date === date);
        return dailyParticipations?.length
          ? dailyParticipations.map((p) => ({ contestDate: date, participation: p }))
          : { contestDate: date };
      })
      .flat();
  }, [start_date, end_date, participations]);

  useEffect(() => {
    getMyParticipations();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    contestId,
    start_date,
    contestParticipations,
    isLoading
  };
}
