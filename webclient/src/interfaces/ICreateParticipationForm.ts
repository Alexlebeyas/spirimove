export interface ICreateParticipationForm {
  contestId: number;
  name: string;
  description: string;
  date: string;
  image?: File;
  isIntensive: boolean;
  type: number;
}
