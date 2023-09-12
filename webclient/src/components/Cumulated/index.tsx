import { ILeaderboardStats } from '@/interfaces';
import { useTranslation } from 'react-i18next';

interface CumulatedProps {
  stats: ILeaderboardStats[];
}

const Cumulated = ({ stats }: CumulatedProps) => {
  const { t } = useTranslation();
  const { totalPts, totalParticipants } = getCumulatedStats(stats);

  return (
    <div className="mx-5 my-2 flex flex-row sm:mx-2">
      <div className="flex divide-x-2 divide-slate-200">
        <div className="mr-6 p-1">
          <div className="justify-center text-4xl font-semibold text-darkblue-800">{totalPts}</div>
          <div className="pt-0.5 text-[13px] font-medium leading-[14px] text-darkblue-800 sm:text-xs">
            {t('Leaderboard.Cumulated.Points')}
          </div>
        </div>
        <div className="p-1 pl-6">
          <div className="text-4xl font-semibold text-darkblue-800">{totalParticipants}</div>
          <div className="pt-0.5 text-[13px] font-medium leading-[14px] text-darkblue-800 sm:text-xs">
            {t('Leaderboard.Cumulated.Participants')}
          </div>
        </div>
      </div>
    </div>
  );
};

interface CumulatedStats {
  totalPts: number;
  totalParticipants: number;
}

function getCumulatedStats(stats: ILeaderboardStats[]): CumulatedStats {
  return stats
    .map((stat) => ({ totalPts: Number(stat.total_points), totalParticipants: 1 }))
    .reduce(
      (a, b) => ({
        totalPts: a.totalPts + b.totalPts,
        totalParticipants: a.totalParticipants + b.totalParticipants,
      }),
      { totalPts: 0, totalParticipants: 0 }
    );
}

export default Cumulated;
