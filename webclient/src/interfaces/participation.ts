import { IParticipationType } from '@/interfaces';

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
  is_intensive: boolean;
  status_display: 'In verification' | 'Approved' | 'Rejected';
}
