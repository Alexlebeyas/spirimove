import React, { useEffect, useState, useMemo } from 'react';
import { getDates } from '@/utils/dates';
import { CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { IContest, IParticipation } from '@/interfaces';
import { IMySpiriMoveProgress } from '@/interfaces/IMySpiriMoveProgress';
import ParticipationService from '@/services/ParticipationService';
import { fetchMyParticipations, fetchAllParticipations } from '@/stores/useParticipationStore';
import { ConfirmBox, ParticipateModal } from '@/components';
import MobileView from './MobileView';
import DesktopView from './DesktopView';
interface Props {
  contest: IContest;
}

export const SpiriMoveProgress: React.FC<Props> = ({ contest }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { isLoading, participations, getParticipations: getMyParticipations } = fetchMyParticipations();
  const { getParticipations: getAllParticipations } = fetchAllParticipations();

  const [isConfirmDelOpen, setConfirmDelOpen] = useState(false);
  const [participationToHandle, setParticipationToHandle] = useState<IParticipation | null>(null);
  const [isEditParticipationModalOpen, setIsEditParticipationModalOpen] = useState(false);

  const contestParticipations: IMySpiriMoveProgress[] = useMemo(() => {
    const datesArray = getDates(contest.start_date, contest.end_date);
    return datesArray
      .map((date) => {
        const dailyParticipations = participations?.filter((p) => p.date === date);
        return dailyParticipations?.length
          ? dailyParticipations.map((p) => ({ contestDate: date, participation: p }))
          : { contestDate: date };
      })
      .flat();
  }, [contest.start_date, contest.end_date, participations]);

  const viewProps = {
    participations: contestParticipations,
    setConfirmDelOpen,
    setIsEditParticipationModalOpen,
    setParticipationToHandle,
  };

  useEffect(() => {
    if (isLoading) {
      getMyParticipations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const handleDeleteParticipation = async () => {
    if (!participationToHandle) return;

    try {
      await ParticipationService.deleteParticipation(participationToHandle);
      await Promise.all([getMyParticipations(), getAllParticipations()]);
      setParticipationToHandle(null);
    } catch (error) {
      console.error('There was an error deleting the participation:', error); // TODO: use an error notification service
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center">
      {isMobile ? <MobileView {...viewProps} /> : <DesktopView {...viewProps} />}
      <ConfirmBox
        open={isConfirmDelOpen}
        setOpen={setConfirmDelOpen}
        handleDeleteParticipation={handleDeleteParticipation}
        participation={participationToHandle}
      />
      <ParticipateModal
        contestId={contest.id}
        startDate={contest.start_date}
        open={isEditParticipationModalOpen}
        setOpen={setIsEditParticipationModalOpen}
        participationToEdit={participationToHandle}
      />
    </div>
  );
};
