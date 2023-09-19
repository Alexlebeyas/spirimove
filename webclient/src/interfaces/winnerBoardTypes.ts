export type ContestResult = {
  contest: {
    id: number;
    name: string;
    nb_element_leaderboard: number;
    start_date: string;
    end_date: string;
  };
  winner: {
    email: string;
    phone: string;
    office: string;
    display_name: string;
    profile_picture?: string;
  };
  level: {
    id: number;
    name: string;
    price: number;
    participation_day: number;
    order: number;
    is_for_office: boolean;
  };
  total_days: number;
};

export type WinnerInfo = {
  price: number;
  name: string;
  office: string;
  profile_picture?: string;
  is_for_office: boolean;
};

export type WinnerboardEntries = {
  contest_name: string;
  winners: WinnerInfo[];
  perOfficeWinners: WinnerInfo[];
};
