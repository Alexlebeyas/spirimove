import { ILeaderboardStats } from '@/interfaces';
import { useTranslation } from 'react-i18next';

interface CumulatedProps {
  stats: ILeaderboardStats[];
}

const Cumulated = ({ stats }: CumulatedProps) => {
  const { t } = useTranslation();
  const { totalPts, totalParticipants } = getCumulatedStats(stats);

  return (
    <div className="m-2 flex flex-row ">
      <div className="flex grow justify-stretch">
        <div className="grow p-1">
          <div className="justify-center text-4xl font-semibold">{totalPts}</div>
          <div className="text-xs font-medium leading-[14px] text-gray-500">{t('Leaderboard.Cumulated.Points')}</div>
        </div>
        <div className="grow border-l p-1 pl-7">
          <div className="text-4xl font-semibold">{totalParticipants}</div>
          <div className="text-xs font-medium leading-[14px] text-gray-500">
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
