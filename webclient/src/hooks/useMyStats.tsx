import { useState, useEffect, useCallback } from 'react';
import { IMyStats } from '@/interfaces/IMyStats';
import { IContest } from '@/interfaces/contest';
import ApiService from '@/services/ApiService';

const INITIAL_STATS: IMyStats = {
  contest_name: '',
  nb_point: 0,
  nb_days: 0,
  streak: 0,
};

export const useMyStats = (contest: IContest | undefined) => {
  const [stats, setStats] = useState<IMyStats>(INITIAL_STATS);

  const getStats = useCallback(async () => {
    if (!contest) return;
    try {
      const myStatsRes = await ApiService.get(`my/stats/${contest.id}`);
      const data = myStatsRes.data;
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }, [contest]);

  useEffect(() => {
    getStats();
  }, [getStats]);

  return { stats, refreshStats: getStats };
};
