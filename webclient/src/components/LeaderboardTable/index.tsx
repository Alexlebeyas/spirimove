import { useContest } from '@/hooks';
import { ILeaderboardStats } from '@/interfaces/leaderboardStats';
import useUserStore from '@/stores/useUserStore';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LinearProgress, ProfileImage } from '..';

interface Props {
  stats: ILeaderboardStats[];
  mode: SortingMode;
}

export type SortingMode = 'pts' | 'days';

export const LeaderboardTable = ({ stats, mode }: Props) => {
  const [topEntries, setTopEntries] = useState(5);
  const { t } = useTranslation();

  const sortedStats = filterAndSort(stats, mode, topEntries);
  const { contest } = useContest();
  const currentUser = useUserStore((state) => state.user);

  if (!contest) return null; // no contest

  const maxConsecutive = Number(sortedStats[0]?.total_days);

  return (
    <>
      {/* First entries */}
      <div className="h-auto divide-y divide-slate-200 overflow-y-auto border-b">
        {sortedStats.map((stat, idx) => {
          switch (mode) {
            case 'pts':
              return (
                <TotalPointsRenderer
                  key={stat.user__display_name}
                  stat={stat}
                  idx={idx}
                  currentUser={currentUser.display_name}
                />
              );
            case 'days':
              return (
                <TotalDaysRenderer
                  key={stat.user__display_name}
                  stat={stat}
                  idx={idx}
                  max={maxConsecutive}
                  currentUser={currentUser.display_name}
                />
              );
          }
        })}
      </div>
      {/* Load more button */}
      <div className="mt-3 flex justify-center">
        <div className="py-2">
          <button
            className="inline-flex items-center px-4 py-1 text-base font-bold text-darkblue-800 lg:hover:text-blue"
            onClick={() => setTopEntries((top) => top + 5)}
          >
            {t('Leaderboard.ViewMore')}
            <svg className="ml-2 h-3 w-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23 23">
              <path stroke="currentColor" strokeWidth="2" d="M11 11v-11h1v11h11v1h-11v11h-1v-11h-11v-1h11z" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
};

function filterAndSort(stats: ILeaderboardStats[], mode: SortingMode, top: number): ILeaderboardStats[] {
  const compareFn = {
    pts: (a: ILeaderboardStats, b: ILeaderboardStats) => Number(b.total_points) - Number(a.total_points),
    days: (a: ILeaderboardStats, b: ILeaderboardStats) => Number(b.total_days) - Number(a.total_days),
  }[mode];

  return stats.sort(compareFn).slice(0, top);
}

interface TotalPointsProps {
  stat: ILeaderboardStats;
  idx: number;
  currentUser: string;
}
const TotalPointsRenderer = ({ stat, idx, currentUser }: TotalPointsProps) => {
  const { t } = useTranslation();

  return (
    <>
      <div
        id={stat.user__display_name}
        className={
          'flex items-center px-1 py-3 sm:px-3' + (stat.user__display_name === currentUser ? ' bg-gray-50' : '')
        }
      >
        <div className="mr-3 flex-none text-sm text-slate-600 sm:mr-4">{idx + 1}</div>
        <div className="flex grow items-center">
          <div className="flex grow items-center">
            <div className="mr-3">
            <ProfileImage name={stat.user__display_name} image={stat.user__profile_picture} size={32} fontSize={14} />
            </div>
            <div>
              <div className="text-[15px] font-medium text-darkblue-800 sm:text-sm">{stat.user__display_name}</div>
              <div className="text-[13px] font-medium text-slate-500  sm:text-xs">{stat.user__office}</div>
            </div>
          </div>
          <div className="flex-none text-sm font-bold text-darkblue-800">
            {t('Leaderboard.PointsDisplay', { nb: stat.total_points })}
          </div>
        </div>
      </div>
    </>
  );
};

interface TotalDaysProps {
  stat: ILeaderboardStats;
  idx: number;
  max: number;
  currentUser: string;
}
const TotalDaysRenderer = ({ stat, idx, max, currentUser }: TotalDaysProps) => {
  const { t } = useTranslation();

  return (
    <>
      <div
        id={stat.user__display_name}
        className={
          'flex items-center px-1 py-3 sm:px-3' + (stat.user__display_name === currentUser ? ' bg-slate-50' : '')
        }
      >
        <div className="mr-3 flex-none text-sm text-slate-600 sm:mr-4">{idx + 1}</div>
        <div className="grow">
          <div className="flex grow items-center">
            <div className="flex grow items-center">
              <div className="mr-3">
                <ProfileImage name={stat.user__display_name} size={32} fontSize={14} />
              </div>
              <div>
                <div className="text-[15px] font-medium text-darkblue-800 sm:text-sm">{stat.user__display_name}</div>
                <div className="text-[13px] font-medium leading-[14px] text-slate-500 sm:text-xs">
                  {stat.user__office}
                </div>
              </div>
            </div>
            <div className="flex-none text-sm font-bold text-darkblue-800">
              {t('Leaderboard.DaysDisplay', { nb: stat.total_days })}
            </div>
          </div>
          <div className="grow pt-2">
            <LinearProgress value={Number(stat.total_days)} max={max} />
          </div>
        </div>
      </div>
    </>
  );
};
