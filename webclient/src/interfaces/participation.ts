import { IParticipationType } from '@/interfaces';

export interface ReactionsType {
  user__display_name: string;
  reaction: string;
}

export interface ToggleReactionsType {
  participation: number;
  reaction: string;
}

export const ParticipationStatus = {
  InVerification: 'In verification',
  Approved: 'Approved',
  Rejected: 'Rejected',
} as const;

export type ParticipationStatus = typeof ParticipationStatus[keyof typeof ParticipationStatus];

export const ParticipationStatusColorMap = {
  [ParticipationStatus.InVerification]: 'orange',
  [ParticipationStatus.Approved]: 'green',
  [ParticipationStatus.Rejected]: 'red',
} as const;

export interface IParticipation {
  id: number;
  name: string;
  description: string;
  date: string;
  date_created: string;
  image: string;
  user: {
    display_name: string;
    profile_picture: string;
  };
  type: IParticipationType;
  reactions: Array<ReactionsType>;
  is_intensive: boolean;
  is_organizer: boolean;
  status_display: ParticipationStatus;
  points: number;
}

export interface ResponseParticipations {
  count: number;
  next: string;
  previous: string;
  results: Array<IParticipation>;
}