import { IContest, ILeaderboardStats } from '@/interfaces';
import ApiService from '@/services/ApiService';
import { useEffect, useState } from 'react';

export const useLeaderboard = (contest: IContest | undefined) => {
  const [stats, setStats] = useState<ILeaderboardStats[] | undefined>();
  const isLoading = !!contest && !!stats;

  useEffect(() => {
    const fetchStats = async () => {
      const leaderboardStats = (await ApiService.get(`/all/leaderboard/${contest?.id}`)).data;
      setStats(leaderboardStats);
    };

    // Uses undefined with the idea of having a simple boolean for loading
    setStats(undefined);
    if (contest) {
      fetchStats();
    }
  }, [contest]);

  return { stats, isLoading };
};
