import { useEffect, useState } from 'react';
import ApiService from '@/services/ApiService';
import { useContest } from '.';
import { WinnerInfo, WinnerboardEntries, ContestResult } from '@/interfaces';

const createWinnerObject = (item: ContestResult): WinnerInfo => ({
  price: item.level.price,
  name: item.winner.display_name,
  office: item.winner.office,
  profile_picture: item.winner.profile_picture,
  is_for_office: item.level.is_for_office,
});

const sortByPriceDescending = (a: WinnerInfo, b: WinnerInfo) => b.price - a.price;

const categorizeWinners = (acc: { winners: WinnerInfo[]; perOfficeWinners: WinnerInfo[] }, item: ContestResult) => {
  const winner = createWinnerObject(item);

  if (item.level.is_for_office) {
    acc.perOfficeWinners.push(winner);
  } else {
    acc.winners.push(winner);
  }

  return acc;
};

const transformData = (data: ContestResult[]): WinnerboardEntries[] => {
  if (!data.length) return [];

  const contestName = data[0]?.contest?.name || '';

  const { winners, perOfficeWinners } = data.reduce(categorizeWinners, { winners: [], perOfficeWinners: [] });

  winners.sort(sortByPriceDescending);
  perOfficeWinners.sort(sortByPriceDescending);

  return [
    {
      contest_name: contestName,
      winners,
      perOfficeWinners,
    },
  ];
};

export const useWinnerBoard = () => {
  const [results, setResults] = useState<WinnerboardEntries[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { contest } = useContest();

  useEffect(() => {
    const fetchStats = async () => {
      if (!contest) return;

      setIsLoading(true);
      try {
        const { data } = await ApiService.get(`/draw/results/${contest.id}`);
        setResults(transformData(data));
      } catch (error) {
        console.error('Failed to fetch stats', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [contest]);

  return { results, isLoading };
};

