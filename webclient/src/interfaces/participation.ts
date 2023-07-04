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
  type: {
    id: number;
    description: string;
    from_date: string;
    to_date: string;
    name: string;
  };
  is_intensive: boolean;
  is_approved: boolean;
}
