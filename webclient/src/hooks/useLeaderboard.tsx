import { useState, useEffect } from 'react';
import { IContest, ILeaderboardStats } from '@/interfaces';
import ApiService from '@/services/ApiService';

export const useLeaderboard = (contest: IContest) => {
  const [data, setStats] = useState<Array<ILeaderboardStats>>([]);
  const [isLoading, setIsloading] = useState(true);

  const getAllSortedByDays = () => {
    return data.sort((a, b) => Number(b.total_days) - Number(a.total_days));
  };

  const getTopFromOffice = (office: string, top: number) => {
    return data
      .filter((stat) => stat.user__office === office)
      .sort((a, b) => Number(b.total_points) - Number(a.total_points))
      .slice(0, top);
  };

  useEffect(() => {
    const fetchStats = async () => {
      const leaderboardStats = (await ApiService.get(`/all/leaderboard/${contest.id}`)).data;
      setStats(leaderboardStats);
      setIsloading(false);
    };

    fetchStats();
  }, [contest.id]);

  return { data: data, getAllSortedByDays, getTopFromOffice, isLoading };
};
