import { useState, useEffect } from 'react';
import { IContest } from '@/interfaces';
import ContestService from '@/services/ContestService';

export const useContest = () => {
  const [contest, setContest] = useState<IContest>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContest = async () => {
      const contest = await ContestService.getCurrent();
      setContest(contest);
      setIsLoading(false);
    };

    fetchContest();
  }, []);

  return { contest: contest, isLoading };
};
