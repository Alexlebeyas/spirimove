import { IParticipationType } from '@/interfaces';

export interface ReactionsType {
  user__display_name: string;
  reaction: string;
}

export interface ToggleReactionsType {
  participation: number;
  reaction: string;
}

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
  status_display: 'In verification' | 'Approved' | 'Rejected';
}
