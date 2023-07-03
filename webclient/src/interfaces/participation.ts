import { IUser } from '@/interfaces';

export interface IParticipation {
  id: number;
  description: string;
  date: string;
  image: string;
  is_intensive: boolean;
  date_created: string;
  last_modified: string;
  type: number;
  contest: number;
  user: IUser;
}
