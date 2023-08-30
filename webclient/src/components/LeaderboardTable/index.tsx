import { ILeaderboardStats } from '@/interfaces/leaderboardStats';
import { LinearProgress, ProfileImage } from '..';

interface Props {
  stats: ILeaderboardStats[];
  renderer: (stat: ILeaderboardStats, idx: number) => JSX.Element;
}

export const LeaderboardTable = ({ stats, renderer }: Props) => {
  return (
    <>
      {/* First entries */}
      <div className="h-[300px] divide-y overflow-y-auto border-b">
        {stats.map((stat, idx) => (
          <>{renderer(stat, idx)}</>
        ))}
      </div>
      {/* Load more */}
      <div className="mt-3 flex justify-center">
        <div className="py-2">
          <button className="mx-1 inline-flex items-center px-4 py-1 text-base font-medium">
            View More
            <svg className="ml-2 h-3.5 w-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23 23">
              <path stroke="currentColor" stroke-width="2" d="M11 11v-11h1v11h11v1h-11v11h-1v-11h-11v-1h11z" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
};

export const TotalPointsRenderer = (stat: ILeaderboardStats, idx: number) => {
  return (
    <>
      <div className="flex items-center p-3 ">
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
          <div className="flex-none text-sm font-semibold">{stat.total_points} pts</div>
        </div>
      </div>
    </>
  );
};

export const TotalDaysRenderer = (stat: ILeaderboardStats, idx: number) => {
  return (
    <>
      <div className="flex items-center p-3 ">
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
            <div className="flex-none text-sm font-semibold">{stat.total_days} days</div>
          </div>
          <div className="grow pt-2">
            <LinearProgress value={Number(10)} max={10} />
          </div>
        </div>
      </div>
    </>
  );
};
