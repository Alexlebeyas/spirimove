import { IParticipation } from '@/interfaces';
import { IMySpiriMoveProgress } from '@/interfaces/IMySpiriMoveProgress';

export interface ViewProps {
    participations: IMySpiriMoveProgress[];
    setConfirmDelOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setIsEditParticipationModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setParticipationToHandle: React.Dispatch<React.SetStateAction<IParticipation | null>>;
  }