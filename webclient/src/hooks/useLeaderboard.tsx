import { ILeaderboardStats } from '@/interfaces';
import ApiService from '@/services/ApiService';
import { useEffect, useState } from 'react';
import { useContest } from '.';

export const useLeaderboard = () => {
  const [stats, setStats] = useState<ILeaderboardStats[] | undefined>();
  const { contest } = useContest();
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
