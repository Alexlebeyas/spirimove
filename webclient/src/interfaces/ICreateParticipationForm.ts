export interface ICreateParticipationForm {
  contestId: string;
  name: string;
  description: string;
  date: string;
  image?: File;
  isIntensive: boolean;
  type: number;
}
