import { ILeaderboardStats } from '@/interfaces/leaderboardStats';
import { LinearProgress, ProfileImage } from '..';

interface Props {
  stats: ILeaderboardStats[];
  renderer: (stat: ILeaderboardStats, idx: number) => JSX.Element;
}

export const LeaderboardTable = ({ stats, renderer }: Props) => {
  return (
    <div className="h-[400px] overflow-y-scroll pr-4">
      {stats.map((stat, idx) => (
        <>{renderer(stat, idx)}</>
      ))}
    </div>
  );
};

export const TotalPointsRenderer = (stat: ILeaderboardStats, idx: number) => {
  return (
    <>
      <div className="mb-3 last:mb-0">
        <div className="mb-2 flex items-center justify-between">
          <div className="mr-1 flex h-[100%] items-center font-bold">
            <div className="mr-6 text-lg">{idx + 1}</div>
            <div className="flex items-center">
              <div className="mr-2">
                <ProfileImage name={stat.user__display_name} size={40} fontSize={18} />
              </div>
              <div>
                <div className="font-semibold">{stat.user__display_name}</div>
                <div className="text-sm font-medium leading-[14px] text-gray-500">{stat.user__office}</div>
              </div>
            </div>
          </div>
          <div className="font-semibold">{stat.total_points} pts</div>
        </div>
      </div>
      <div className="mb-3 h-[1px] w-full bg-slate-200 last:hidden"></div>
    </>
  );
};

export const TotalDaysRenderer = (stat: ILeaderboardStats, idx: number) => {
  return (
    <>
      <div className="mb-3">
        <div className="mb-2 flex items-center">
          <div className="mr-2">
            <ProfileImage name={stat.user__display_name} size={40} fontSize={18} />
          </div>
          <div className="w-full">
            <div className="font-semibold">{stat.user__display_name}</div>
            <div className="flex justify-between">
              <div className="text-sm leading-[14px] text-gray-500">{stat.user__office}</div>
              <div className="text-sm font-semibold">{stat.total_days}d</div>
            </div>
          </div>
        </div>
        <LinearProgress value={Number(10)} max={10} />
      </div>
      <div className="mb-3 h-[1px] w-full bg-slate-200 last:hidden"></div>
    </>
  );
};
