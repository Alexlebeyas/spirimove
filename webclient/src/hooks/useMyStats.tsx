import { IMyStats } from '@/interfaces/IMyStats';
import { IContest } from '@/interfaces/contest';
import ApiService from '@/services/ApiService';
import { useState, useEffect } from 'react';

export const useMyStats = (contest: IContest | undefined) => {
  const [stats, setStats] = useState<IMyStats>({
    contest_name: '',
    nb_point: 0,
    nb_days: 0,
    streak: 0,
  });

  useEffect(() => {
    const getStats = async () => {
      const myStats = (await ApiService.get(`my/stats/${contest?.id}`)).data;

    setStats(myStats);
  };

    if (contest) getStats();
  }, [contest]);

  return stats;
};
