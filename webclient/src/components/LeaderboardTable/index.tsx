import { useContest } from '@/hooks';
import { Office } from '@/interfaces/Office';
import { ILeaderboardStats } from '@/interfaces/leaderboardStats';
import useUserStore from '@/stores/useUserStore';
import { daysInterval } from '@/utils/dates';
import { DateTime } from 'luxon';
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

  const currentDaysInContest = daysInterval(DateTime.fromISO(contest.start_date), DateTime.fromISO(contest.end_date));

  return (
    <>
      {/* First entries */}
      <div className="h-[365px] divide-y overflow-y-auto border-b">
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
                  max={currentDaysInContest}
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
            className="mx-1 inline-flex items-center px-4 py-1 text-base font-medium"
            onClick={() => setTopEntries((top) => top + 5)}
          >
            {t('Leaderboard.ViewMore')}
            <svg className="ml-2 h-3.5 w-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23 23">
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
        className={'flex items-center p-3' + (stat.user__display_name === currentUser ? ' bg-gray-50' : '')}
      >
        <div className="mr-4 flex-none text-sm text-gray-500">{idx + 1}</div>
        <div className="flex grow items-center">
          <div className="flex grow items-center">
            <div className="mr-2">
              <ProfileImage name={stat.user__display_name} size={32} fontSize={14} />
            </div>
            <div>
              <div className="text-sm font-semibold">{stat.user__display_name}</div>
              <div className="text-xs font-medium leading-[14px] text-gray-500">{stat.user__office}</div>
            </div>
          </div>
          <div className="flex-none text-sm font-semibold">
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
        className={'flex items-center p-3' + (stat.user__display_name === currentUser ? ' bg-gray-50' : '')}
      >
        <div className="mr-4 flex-none text-sm text-gray-500">{idx + 1}</div>
        <div className="grow">
          <div className="flex grow items-center">
            <div className="flex grow items-center">
              <div className="mr-2">
                <ProfileImage name={stat.user__display_name} size={32} fontSize={14} />
              </div>
              <div>
                <div className="text-sm font-semibold">{stat.user__display_name}</div>
                <div className="text-xs font-medium leading-[14px] text-gray-500">{stat.user__office}</div>
              </div>
            </div>
            <div className="flex-none text-sm font-semibold">
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
