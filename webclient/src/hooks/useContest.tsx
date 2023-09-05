import { CurrentContestContext, ICurrentContestContext } from '@/providers/Contest';
import { useContext } from 'react';

export const useContest = (): ICurrentContestContext => {
  const context = useContext(CurrentContestContext);
  return context;
};
