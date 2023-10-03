import { useState } from 'react';
import { CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { IParticipation } from '@/interfaces';
import ParticipationService from '@/services/ParticipationService';
import { fetchAllParticipations, fetchMyParticipations } from '@/stores/useParticipationStore';
import { ConfirmBox, ParticipateModal } from '@/components';
import { useContestParticipations } from '@/hooks/useContestParticipations';
import MobileView from './MobileView';
import DesktopView from './DesktopView';
interface SpiriMoveProgressProps {
  refreshStats: () => Promise<void>;
}

export const SpiriMoveProgress = ({ refreshStats }: SpiriMoveProgressProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { isLoading, contestParticipations, contestId, start_date } = useContestParticipations();
  const { getParticipations: getMyParticipations } = fetchMyParticipations();
  const { getParticipations: getAllParticipations } = fetchAllParticipations();

  const [isConfirmDelOpen, setConfirmDelOpen] = useState(false);
  const [participationToHandle, setParticipationToHandle] = useState<IParticipation | null>(null);
  const [isEditParticipationModalOpen, setIsEditParticipationModalOpen] = useState(false);

  const viewProps = {
    participations: contestParticipations,
    setConfirmDelOpen,
    setIsEditParticipationModalOpen,
    setParticipationToHandle,
  };

  const handleDeleteParticipation = async () => {
    if (!participationToHandle) return;

    try {
      await ParticipationService.deleteParticipation(participationToHandle);
      await Promise.all([getMyParticipations(), getAllParticipations()]);
      setParticipationToHandle(null);
      refreshStats();
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
        contestId={contestId}
        startDate={start_date}
        open={isEditParticipationModalOpen}
        setOpen={setIsEditParticipationModalOpen}
        participationToEdit={participationToHandle}
      />
    </div>
  );
};