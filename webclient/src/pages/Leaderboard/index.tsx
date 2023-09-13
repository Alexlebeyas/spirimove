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
      <div className="items-center justify-center overflow-x-auto pl-4 sm:pl-0 md:flex md:flex-col">
        <ul className="mb-6 flex flex-nowrap text-center font-medium text-darkblue-800 antialiased ">
          {getOffices().map((office) => (
            <li className="mx-0" key={office.id}>
              <button
                className={`inline-block border-darkblue-800 px-5 pb-1.5 ${
                  office.id === officeFilter.id ? 'border-b-4 font-bold' : 'hover:text-slate-500'
                }`}
                onClick={() => setOfficeFilter(office)}
              >
                {t(office.titleKey)}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col antialiased lg:flex-row">
        {/* Leaderboard */}
        <div className="mb-5 w-full lg:mr-5 lg:w-2/3">
          <div className="h-auto rounded-md bg-white px-4 py-5 shadow-md sm:px-5">
            <h3 className="mb-3 text-xl font-bold text-darkblue-800 lg:text-lg">Leaderboard</h3>
            {/* Stat selection */}
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-lightgrey py-0">
                <button
                  className={
                    'rounded-full px-5 py-1 text-sm font-medium text-darkblue-800 sm:text-xs ' +
                    (sortingMode == 'pts' ? 'bg-darkblue-800 text-white' : 'hover:text-slate-500')
                  }
                  onClick={() => setSortingMode('pts')}
                >
                  {t('Leaderboard.PointsMode')}
                </button>
                <button
                  className={
                    'rounded-full px-5 py-1 text-sm font-medium text-darkblue-800 sm:text-xs ' +
                    (sortingMode == 'days' ? 'bg-darkblue-800 text-white' : 'hover:text-slate-500')
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
        <div className="w-full lg:w-1/3">
          {/* Cumulated stats */}
          <div className="mb-5 w-full rounded-md bg-white px-4 py-5 shadow-md sm:px-5">
            <h3 className="mb-3 text-xl font-bold text-darkblue-800 lg:text-lg">{t('Leaderboard.Cumulated.Title')}</h3>
            {filteredStats && <Cumulated stats={filteredStats} />}
          </div>
          {/* Spirimove progress */}
          <div className="mb-5 w-full rounded-md bg-white px-4 py-5 shadow-md sm:px-5">
            <h3 className="mb-3 text-xl font-bold text-darkblue-800 lg:text-lg">
              {t('Leaderboard.RemainingDays.Title')}
            </h3>
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
