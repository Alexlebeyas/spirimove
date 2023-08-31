import { IContest } from '@/interfaces';
import { IMyStats } from '@/interfaces/IMyStats';
import ApiService from '@/services/ApiService';
import { useState, useEffect } from 'react';

export const useMyStats = (contest: IContest | undefined) => {
  const [stats, setStats] = useState<IMyStats>({
    contest__name: '',
    total_points: 0,
    streak: 0,
    level: [21, 25, 33],
  });

  useEffect(() => {
    const getStats = async () => {
      const myStats = (await ApiService.get(`my/stats/${contest?.id}`)).data;

      myStats.level = [21, 25, 33];
      setStats(myStats);
    };

    if (contest) getStats();
  }, [contest]);

  return stats;
};
