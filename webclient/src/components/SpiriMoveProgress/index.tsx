import { SpiriMoveProgressRow } from '@/components/SpiriMoveProgressRow';
import { IMySpiriMoveProgress } from '@/interfaces/IMySpiriMoveProgress';
import { getDates } from '@/utils/dates';
import { ParticipationType } from '@/utils/participationTypes';
import { useTranslation } from 'react-i18next';
import './index.css';
import { CircularProgress } from '@mui/material';
import { useMyParticipations } from '@/hooks/useMyParticipations';
import { IContest } from '@/interfaces';

interface Props {
  contest: IContest;
}

export const SpiriMoveProgress: React.FC<Props> = ({ contest }) => {
  const { t } = useTranslation();
  const { participations, isLoading } = useMyParticipations();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  console.log(contest);

  const datesArray = getDates(contest.start_date, contest.end_date);

  const contestParticipations: IMySpiriMoveProgress[] = [];

  console.log(participations);

  datesArray.forEach((currentDate) => {
    const currentDayParticipations = participations.filter((p) => p.date === currentDate);
    if (currentDayParticipations.length === 0) {
      contestParticipations.push({ contestDate: currentDate, participation: undefined });
    } else {
      const normal = currentDayParticipations.find((p) => p.type === null || p.type.id === ParticipationType.Normal);
      const popups = currentDayParticipations.find((p) => p.type !== null && p.type.id === ParticipationType.Popup);
      const groups = currentDayParticipations.find((p) => p.type !== null && p.type.id === ParticipationType.Group);

      if (normal) {
        contestParticipations.push({ contestDate: currentDate, participation: normal });
      }
      if (popups) {
        contestParticipations.push({ contestDate: currentDate, participation: popups });
      }
      if (groups) {
        contestParticipations.push({ contestDate: currentDate, participation: groups });
      }
    }
  });

  return (
    <div className="flex items-center justify-center">
      <div className="container">
        <table className="flex-no-wrap my-5 flex w-full flex-row overflow-hidden rounded-lg sm:bg-white sm:shadow-lg">
          <thead className="text-white">
            {contestParticipations.map(() => (
              <tr className="flex-no wrap mb-2 flex flex-col rounded-l-lg bg-gray-800 sm:mb-0 sm:table-row sm:rounded-none">
                <th className="p-3 text-left">{t('ContestCalendar.Date')}</th>
                <th className="p-3 text-left">{t('ContestCalendar.ParticipationType')}</th>
                <th className="p-3 text-left">{t('ContestCalendar.Description')}</th>
                <th className="p-3 text-left">{t('ContestCalendar.Intensity')}</th>
                <th className="p-3 text-left">{t('ContestCalendar.Approved')}</th>
              </tr>
            ))}
          </thead>
          <tbody className="flex-1 sm:flex-none">
            {contestParticipations.map((currentParticipation) => (
              <SpiriMoveProgressRow
                key={currentParticipation.contestDate + currentParticipation.participation?.type}
                currentDate={currentParticipation.contestDate}
                participation={currentParticipation.participation}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
