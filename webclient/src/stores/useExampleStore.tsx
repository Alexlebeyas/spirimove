import { create } from 'zustand';

interface BearState {
  bears: number;
  increasePopulation: (by: number) => void;
}

const useBearStore = create<BearState>((set) => ({
  bears: 0,
  increasePopulation: (by: number) => set((state) => ({ bears: state.bears + by })),
}));

export default useBearStore;
