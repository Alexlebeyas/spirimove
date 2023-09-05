import { useContest } from '@/hooks';
import { IContest } from '@/interfaces';
import { createContext } from 'react';

interface Props {
  children: JSX.Element;
}

export const CurrentContestContext = createContext<IContest | undefined>(undefined);

export const AppContainer: React.FC<Props> = ({ children }) => {
  const { contest, isLoading } = useContest();

  return (
    <CurrentContestContext.Provider value={contest}>
      {isLoading ? null : (
        <div className="bg-slate-100 pb-10 pt-24">
          <div className="min-h-[75vh]">{children}</div>
        </div>
      )}
    </CurrentContestContext.Provider>
  );
};
