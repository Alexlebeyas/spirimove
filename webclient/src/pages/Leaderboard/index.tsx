import { PageContainer, ProfileImage } from '@/components';
import { LeaderboardTable, TotalDaysRenderer, TotalPointsRenderer } from '@/components/LeaderboardTable';
import { OFFICES } from '@/constants';
import { useLeaderboard } from '@/hooks';
import useContestStore from '@/stores/useContestStore';
import { useTranslation } from 'react-i18next';

const Leaderboard = () => {
  const { t } = useTranslation();
  const { contest, numberDaysFromStart } = useContestStore((state) => state);
  const { stats, getAllSortedByDays, getTopFromOffice } = useLeaderboard(contest);

  const filters = [
    {
      title: 'Global',
      selected: true,
    },
    {
      title: 'Montréal',
    },
    {
      title: 'Gatineau',
    },
    {
      title: 'Toronto',
    },
  ];
  return (
    <PageContainer>
      <div className="flex flex-col items-center justify-center">
        {/* Office filters */}
        <ul className="mb-4 flex flex-nowrap text-center text-sm font-medium">
          {filters.map((filter) => (
            <li className="mr-2">
              <button
                className={`inline-block rounded-t-lg border-gray-900 p-4 ${
                  filter.selected ?? false ? 'border-b-4' : ''
                }`}
                // type="button"
                // role="tab"
                // aria-selected={filter.selected ?? false}
              >
                {filter.title}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="mb-3 flex flex-col">
        <div className="mr-3 w-full lg:w-2/3">
          <div className="mb-3 max-h-[500px] overflow-hidden rounded-md bg-white p-4 shadow-md">
            <h3 className="mb-3 text-lg font-bold">Leaderboard</h3>
            {/* Stat selection */}
            <div className="mb-4 flex justify-center">
              <div className="rounded-3xl bg-slate-100 py-0">
                <button className="mx-1 rounded-3xl bg-gray-700 px-4 py-1 text-xs font-medium text-slate-200">
                  Points
                </button>
                <button className="mx-1 rounded-3xl px-4 py-1 text-xs font-medium ">Consecutive days</button>
              </div>
            </div>
            {/* Table */}
            <LeaderboardTable stats={stats} renderer={TotalPointsRenderer}></LeaderboardTable>
          </div>
          <div className="max-h-[500px] rounded-md bg-white p-4">
            <h3 className="mb-5">Participation days</h3>
            <LeaderboardTable stats={getAllSortedByDays()} renderer={TotalDaysRenderer}></LeaderboardTable>
          </div>
        </div>
        {/* <div className="flex w-full flex-col lg:w-1/3">
          {OFFICES.map((office) => (
            <div className="mb-3 w-full rounded-md bg-white p-4 shadow-md last:mr-0">
            <h3 className="mb-5">{t(`Office.${office}`)}</h3>
            {getTopFromOffice(office, 3).map((data, idx) => (
              <>
              <div className="mb-3 last:mb-0">
              <div className="mr-1 flex h-[100%] items-center justify-between">
              <div className="mr-6 text-lg font-bold">{idx + 1}</div>
              <div className="flex w-full items-center">
              <div className="mr-2">
              <ProfileImage name={data.user__display_name} size={40} fontSize={18} />
              </div>
              <div>
              <div className="font-semibold">{data.user__display_name}</div>
              <div className="text-sm font-medium leading-[14px] text-gray-500">{data.total_points}pts</div>
              </div>
              </div>
              </div>
              </div>
              <div className="mb-3 h-[1px] w-full bg-slate-200 last:hidden"></div>
              </>
              ))}
              </div>
              ))}
            </div> */}
      </div>
    </PageContainer>
  );
};

export default Leaderboard;
