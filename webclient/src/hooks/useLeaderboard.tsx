import { IContest, ILeaderboardStats } from '@/interfaces';
import { useEffect, useState } from 'react';

export const useLeaderboard = (contest: IContest | undefined) => {
  const [stats, setStats] = useState<Array<ILeaderboardStats>>([]);
  const [isLoading, setIsloading] = useState(!!contest);

  useEffect(() => {
    const fetchStats = async () => {
      // const leaderboardStats = (await ApiService.get(`/all/leaderboard/${contest.id}`)).data;
      const leaderboardStats = [
        {
          user__display_name: 'Spirian A',
          user__profile_picture: '',
          user__office: 'Montreal',
          contest__name: 'Spirimove',
          total_points: '2',
          total_days: '1',
        },
        {
          user__display_name: 'Spirian B',
          user__profile_picture: '',
          user__office: 'Brossard',
          contest__name: 'Spirimove',
          total_points: '5',
          total_days: '3',
        },
        {
          user__display_name: 'Spirian C',
          user__profile_picture: '',
          user__office: 'Gatineau',
          contest__name: 'Spirimove',
          total_points: '2',
          total_days: '2',
        },
        {
          user__display_name: 'Spirian D',
          user__profile_picture: '',
          user__office: 'Montreal',
          contest__name: 'Spirimove',
          total_points: '10',
          total_days: '7',
        },
      ];

      setStats(leaderboardStats);
      setIsloading(false);
    };

    if (contest) fetchStats();
  }, [contest]);

  return { stats: stats, isLoading };
};
