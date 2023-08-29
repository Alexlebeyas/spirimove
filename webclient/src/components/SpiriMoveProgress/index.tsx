import { SpiriMoveProgressRow } from '@/components/SpiriMoveProgressRow';
import { IMySpiriMoveProgress } from '@/interfaces/IMySpiriMoveProgress';
import { getDates } from '@/utils/dates';
import { useTranslation } from 'react-i18next';
import './index.css';
import { CircularProgress } from '@mui/material';
import { IContest } from '@/interfaces';
import { ConfirmBox, ParticipateModal } from '@/components'
import { useState } from 'react';
import { IParticipation } from '@/interfaces';
import ParticipationService from '@/services/ParticipationService';
import { fetchMyParticipations, fetchAllParticipations } from '@/stores/useParticipationStore';



interface Props {
  contest: IContest;
}

export const SpiriMoveProgress: React.FC<Props> = ({ contest }) => {
  const { t } = useTranslation();
  const {isLoading, participations, getParticipations} = fetchMyParticipations((state) => state);

  const [isConfirmDelOpen, setConfirmDelOpen] = useState(false);
  const [participationToHandle, setParticipationToHandle] = useState({} as IParticipation);
  const [isEditParticipationModalOpen, setIsEditParticipationModalOpen] = useState(false);

  const updateMyParticipations = fetchMyParticipations((state) => state.getParticipations);
  const updateAllParticipations = fetchAllParticipations((state) => state.getParticipations);
  
  const handleDeleteParticipation = () => {
    ParticipationService.deleteParticipation(participationToHandle).then(()=>{
      updateMyParticipations();
      updateAllParticipations();
    });
    setParticipationToHandle({} as IParticipation);
  };

  if (isLoading) {
    getParticipations();
    return (
      <div className="flex items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  const datesArray = getDates(contest.start_date, contest.end_date);

  const contestParticipations: IMySpiriMoveProgress[] = [];

  datesArray.forEach((currentDate) => {
    const currentDayParticipations = participations?.filter((p) => p.date === currentDate);
    if (currentDayParticipations?.length === 0) {
      contestParticipations.push({ contestDate: currentDate});
    } else {
      currentDayParticipations?.forEach((participation) => {
        contestParticipations.push({ contestDate: currentDate, participation  });
      });
    }
  });

  return (
    <div className="flex items-center justify-center">
      <div className="container">
        <table className="flex-no-wrap my-5 flex w-full flex-row overflow-hidden rounded-lg sm:bg-white sm:shadow-lg">
          <thead className="text-white">
            {contestParticipations && (
              <tr className="flex-no wrap mb-2 flex flex-col rounded-l-lg bg-gray-800 sm:mb-0 sm:table-row sm:rounded-none">
                <th className="p-3 text-left">{t('ContestCalendar.Date')}</th>
                <th className="p-3 text-left">{t('ContestCalendar.ParticipationType')}</th>
                <th className="p-3 text-left">{t('ContestCalendar.Description')}</th>
                <th className="p-3 text-left">{t('ContestCalendar.Intensity')}</th>
                <th className="p-3 text-left">{t('ContestCalendar.Approved')}</th>
                <th className="p-3 text-left">{t('Common.Actions')}</th>
              </tr>
            )}
          </thead>
          <tbody className="flex-1 sm:flex-none">
            {contestParticipations.map((currentParticipation, index) => (
              <SpiriMoveProgressRow
                key={index}
                currentDate={currentParticipation.contestDate}
                participation={currentParticipation.participation}
                setConfirmDeleteOpen={setConfirmDelOpen}
                setIsEditParticipationModalOpen={setIsEditParticipationModalOpen}
                setParticipationToHandle={setParticipationToHandle}
              />
            ))}
          </tbody>
        </table>
      </div>
      <ConfirmBox open={isConfirmDelOpen} setOpen={setConfirmDelOpen} handleDeleteParticipation={handleDeleteParticipation} participation={participationToHandle}/>
      <ParticipateModal contestId={contest.id} startDate={contest.start_date} open={isEditParticipationModalOpen} setOpen={setIsEditParticipationModalOpen} participationToEdit={participationToHandle} />
    </div>
  );
};
