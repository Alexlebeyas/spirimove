import { PageContainer } from '@/components';
import { LeaderboardTable, SortingMode } from '@/components/LeaderboardTable';
import { useLeaderboard } from '@/hooks';
import useContestStore from '@/stores/useContestStore';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';


const OFFICES = [
  {
    id: 0,
    title: 'Global',
    filter: undefined,
  },
  {
    id: 1,
    title: 'Montréal',
    filter: 'Montreal',
  },
  {
    id: 2,
    title: 'Gatineau',
    filter: 'Gatineau',
  },
  {
    id: 3,
    title: 'Toronto',
    filter: 'Toronto',
  },
];

const Leaderboard = () => {
  const { t } = useTranslation();
  const { contest, numberDaysFromStart } = useContestStore((state) => state);
  const { stats, isLoading } = useLeaderboard(contest);

  const [sortingMode, setSortingMode] = useState<SortingMode>('pts');
  const [officeFilter, setOfficeFilter] = useState<string>();

  return (
    <PageContainer>
      <div className="flex flex-col items-center justify-center">
        {/* Office filters */}
        <ul className="mb-4 flex flex-nowrap text-center text-sm font-medium">
          {OFFICES.map((office) => (
            <li className="mr-2" key={office.id}>
              <button
                className={`inline-block rounded-t-lg border-gray-900 p-4 ${
                  office.filter == officeFilter ? 'border-b-4' : ''
                }`}
                onClick={() => setOfficeFilter(office.filter)}
              >
                {office.title}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="mb-3 flex flex-col">
        <div className="mr-3 w-full lg:w-2/3">
          <div className="mb-2 max-h-[511px] rounded-md bg-white p-4 shadow-md">
            <h3 className="mb-2 text-lg font-bold">Leaderboard</h3>
            {/* Stat selection */}
            <div className="mb-2 flex justify-center">
              <div className="rounded-3xl bg-slate-100 py-0">
                <button
                  className={
                    'mx-1 rounded-3xl px-4 py-1 text-xs font-medium ' +
                    (sortingMode == 'pts' ? 'bg-gray-700 text-slate-200' : '')
                  }
                  onClick={() => setSortingMode('pts')}
                >
                  Points
                </button>
                <button
                  className={
                    'mx-1 rounded-3xl px-4 py-1 text-xs font-medium ' +
                    (sortingMode == 'days' ? 'bg-gray-700 text-slate-200' : '')
                  }
                  onClick={() => setSortingMode('days')}
                >
                  Consecutive days
                </button>
              </div>
            </div>
            {/* Table */}
            <LeaderboardTable stats={stats} mode={sortingMode} officeFilter={officeFilter}></LeaderboardTable>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default Leaderboard;
