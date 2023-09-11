import { PageContainer } from '@/components';
import Cumulated from '@/components/Cumulated';
import { LeaderboardTable, SortingMode } from '@/components/LeaderboardTable';
import RemainingDays from '@/components/RemainingDays';
import { useLeaderboard } from '@/hooks';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Office } from '../../interfaces/Office';

const GlobalOffice: Office = { id: 0, titleKey: 'Office.Global', isGlobal: true };

const Leaderboard = () => {
  const { t } = useTranslation();

  const { stats } = useLeaderboard();

  const [sortingMode, setSortingMode] = useState<SortingMode>('pts');
  const [officeFilter, setOfficeFilter] = useState<Office>(GlobalOffice);

  const filteredStats = stats?.filter(
    (stat) => officeFilter.isGlobal || 'Office.' + stat.user__office === officeFilter.titleKey
  );

  return (
    <PageContainer>
      {/* Office filters */}
      <div className="flex flex-col items-center justify-center">
        <ul className="mb-4 flex flex-nowrap text-center text-sm font-medium">
          {getOffices().map((office) => (
            <li className="mr-2" key={office.id}>
              <button
                className={`inline-block rounded-t-lg border-gray-900 p-4 ${
                  office.id === officeFilter.id ? 'border-b-4' : ''
                }`}
                onClick={() => setOfficeFilter(office)}
              >
                {t(office.titleKey)}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="mb-3 flex flex-col lg:flex-row">
        {/* Leaderboard */}
        <div className="mr-3 w-full lg:w-2/3">
          <div className="mb-2 max-h-[540px] rounded-md bg-white p-4 shadow-md">
            <h3 className="mb-2 text-lg font-bold">Leaderboard</h3>
            {/* Stat selection */}
            <div className="mb-2 flex justify-center">
              <div className="rounded-full bg-slate-100 py-0">
                <button
                  className={
                    'mx-1 rounded-full px-4 py-1 text-xs font-medium ' +
                    (sortingMode == 'pts' ? 'bg-gray-700 text-slate-200' : '')
                  }
                  onClick={() => setSortingMode('pts')}
                >
                  {t('Leaderboard.PointsMode')}
                </button>
                <button
                  className={
                    'mx-1 rounded-full px-4 py-1 text-xs font-medium ' +
                    (sortingMode == 'days' ? 'bg-gray-700 text-slate-200' : '')
                  }
                  onClick={() => setSortingMode('days')}
                >
                  {t('Leaderboard.ConsecutiveDaysMode')}
                </button>
              </div>
            </div>
            {/* Table */}
            {filteredStats && <LeaderboardTable stats={filteredStats} mode={sortingMode} />}
          </div>
        </div>
        <div className="mr-3 w-full lg:w-1/3">
          {/* Cumulated stats */}
          <div className="mb-2 w-full rounded-md bg-white p-4 shadow-md">
            <h3 className="mb-3 text-lg font-bold">{t('Leaderboard.Cumulated.Title')}</h3>
            {filteredStats && <Cumulated stats={filteredStats} />}
          </div>
          {/* Spirimove progress */}
          <div className="mb-2 w-full rounded-md bg-white p-4 shadow-md">
            <h3 className="mb-3 text-lg font-bold">{t('Leaderboard.RemainingDays.Title')}</h3>
            <RemainingDays />
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

function getOffices(): Office[] {
  const MontrealOffice: Office = { id: 1, titleKey: 'Office.Montreal', isGlobal: false };
  const GatineauOffice: Office = { id: 2, titleKey: 'Office.Gatineau', isGlobal: false };
  const TorontoOffice: Office = { id: 3, titleKey: 'Office.Toronto', isGlobal: false };

  return [GlobalOffice, MontrealOffice, GatineauOffice, TorontoOffice];
}

export default Leaderboard;
