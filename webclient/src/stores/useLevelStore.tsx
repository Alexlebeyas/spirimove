import LevelService from '@/services/LevelService';
import { create } from 'zustand';

interface Level {
  id: number;
  name: string;
  price: string;
  participation_day: number;
  order: number;
}

interface LevelState {
  levels: Array<Level>;
  fetchLevel: () => Promise<void>;
}

const useLevelStore = create<LevelState>((set) => ({
  levels:[],
  fetchLevel: async () => {
    const currentLevels = await LevelService.getCurrent();
    set({ levels: currentLevels});
  },
}));

export default useLevelStore;
