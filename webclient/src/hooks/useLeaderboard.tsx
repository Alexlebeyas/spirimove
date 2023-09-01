import { IContest, ILeaderboardStats } from '@/interfaces';
import ApiService from '@/services/ApiService';
import { useEffect, useState } from 'react';

export const useLeaderboard = (contest: IContest | undefined) => {
  const [stats, setStats] = useState<Array<ILeaderboardStats>>([]);
  const [isLoading, setIsloading] = useState(!!contest);

  useEffect(() => {
    const fetchStats = async () => {
      const leaderboardStats = (await ApiService.get(`/all/leaderboard/${contest?.id}`)).data;
      setStats(leaderboardStats);
      setIsloading(false);
    };

    if (contest) fetchStats();
  }, [contest]);

  return { stats: stats, isLoading };
};
