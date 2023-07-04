import { create } from 'zustand';
import { IParticipation } from '@/interfaces';
import ApiService from '@/services/ApiService';

interface ParticipationState {
  participations: Array<IParticipation>;
  isLoading: boolean;
  fetchParticipations: () => Promise<void>;
  refreshParticipations: () => Promise<void>;
}

const useParticipationStore = create<ParticipationState>((set) => ({
  participations: [],
  isLoading: true,
  fetchParticipations: async () => {
    const participations: Array<IParticipation> = (await ApiService.get('/all/participations')).data;

    set({ participations, isLoading: false });
  },
  refreshParticipations: async () => {
    set({ isLoading: true, participations: [] });

    setTimeout(async () => {
      const participations: Array<IParticipation> = (await ApiService.get('/all/participations')).data;

      set({ participations, isLoading: false });
    }, 500);
  },
}));

export default useParticipationStore;
