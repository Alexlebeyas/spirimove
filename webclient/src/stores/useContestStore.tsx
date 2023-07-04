import { IContest } from '@/interfaces';
import ContestService from '@/services/ContestService';
import { create } from 'zustand';
import { DateTime } from 'luxon';

interface ContestState {
  contest: IContest;
  numberDaysFromStart: number;
  fetchConstest: () => Promise<void>;
}

const useContestStore = create<ContestState>((set) => ({
  contest: {
    id: 0,
    name: '',
    start_date: '',
    end_date: '',
  },
  numberDaysFromStart: 0,
  fetchConstest: async () => {
    const currentContest = await ContestService.getCurrent();
    const numberDaysFromStart = DateTime.now()
      .diff(DateTime.fromFormat(currentContest.start_date, 'y-M-d'), ['days', 'minute'])
      .toObject().days;
    set({ contest: currentContest, numberDaysFromStart });
  },
}));

export default useContestStore;
