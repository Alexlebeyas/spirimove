import { ILeaderboardStats } from '@/interfaces';
import { Office } from '@/interfaces/Office';
import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';

interface CumulatedProps {
  stats: ILeaderboardStats[];
  officeFilter: Office;
}

const Cumulated = ({ stats, officeFilter }: CumulatedProps) => {
  const { t } = useTranslation();
  const { total_pts, total_participants } = getCumulatedStats(stats, officeFilter, t);

  return (
    <>
      <div className="m-2 flex flex-row ">
        <div className="flex grow justify-stretch">
          <div className="grow p-1">
            <div className="justify-center text-4xl font-semibold">{total_pts}</div>
            <div className="text-xs font-medium leading-[14px] text-gray-500">Pts</div>
          </div>
          <div className="grow border-l p-1 pl-7">
            <div className="text-4xl font-semibold">{total_participants}</div>
            <div className="text-xs font-medium leading-[14px] text-gray-500">Participants</div>
          </div>
        </div>
      </div>
    </>
  );
};

interface CumulatedStats {
  total_pts: number;
  total_participants: number;
}

function getCumulatedStats(
  stats: ILeaderboardStats[],
  office: Office,
  translateF: TFunction<'translation', undefined>
): CumulatedStats {
  return stats
    .filter((stat) => office.isGlobal || stat.user__office === translateF(office.titleKey))
    .map((stat) => ({ total_pts: Number(stat.total_points), total_participants: 1 }))
    .reduce(
      (a, b) => ({
        total_pts: a.total_pts + b.total_pts,
        total_participants: a.total_participants + b.total_participants,
      }),
      { total_pts: 0, total_participants: 0 }
    );
}

export default Cumulated;
