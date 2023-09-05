import { IContest } from '@/interfaces';
import ContestService from '@/services/ContestService';
import { createContext, useCallback, useMemo, useState } from 'react';

export interface ICurrentContestContext {
  contest: IContest | undefined;
  fetchCurrent: () => void;
}

interface Props {
  children: JSX.Element | Array<JSX.Element>;
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
const CurrentContestContext = createContext<ICurrentContestContext>({ contest: undefined, fetchCurrent: () => {} });

const CurrentContestProvider: React.FC<Props> = ({ children }) => {
  const [contest, setContest] = useState<IContest | undefined>(undefined);

  const fetchCurrent = useCallback(async () => {
    const contest = await ContestService.getCurrent();
    setContest(contest);
  }, []);

  const contextValue = useMemo(
    () => ({
      contest,
      fetchCurrent,
    }),
    [contest, fetchCurrent]
  );

  return <CurrentContestContext.Provider value={contextValue}>{children}</CurrentContestContext.Provider>;
};

export { CurrentContestContext, CurrentContestProvider };
