import { IMyStats } from '@/interfaces/IMyStats';
import ApiService from '@/services/ApiService';
import { useState, useEffect } from 'react';

export const useMyStats = (contestId: string) => {
  const [stats, setStats] = useState<IMyStats>({
    contest__name: '',
    total_points: 0,
    streak: 0,
    level: [21, 25, 33],
  });

  const getStats = async () => {
    const myStats = (await ApiService.get(`my/stats/${contestId}`)).data;

    myStats.level = [21, 25, 33];
    setStats(myStats);
  };

  useEffect(() => {
    getStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contestId]);

  return stats;
};
