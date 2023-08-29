import { IParticipation } from '@/interfaces';
import ApiService from '@/services/ApiService';
import { IParticipationType } from '@/interfaces';
import { create } from 'zustand';

interface ParticipationState {
  isLoading: boolean;
  participations: Array<IParticipation>;
  getParticipations: () => Promise<void>;
}

interface ParticipationTypeState {
  isLoading: boolean;
  participationsTypes: Array<IParticipationType>;
  getParticipationsTypes: () => Promise<void>;
}

export const fetchMyParticipations  = create<ParticipationState>((set) => ({
  isLoading: true,
  participations: [] as Array<IParticipation>,
  getParticipations: async () => {
    const participations: Array<IParticipation> = (await ApiService.get('/my/participations')).data;
    set({ isLoading: false, participations });
  },
}));

export const fetchAllParticipations  = create<ParticipationState>((set) => ({
  isLoading: true,
  participations: [] ,
  getParticipations: async () => {
    const participations: Array<IParticipation> = (await ApiService.get('/all/participations')).data;
    set({ isLoading: false, participations });
  },
}));

export const fetchParticipationsType  = create<ParticipationTypeState>((set) => ({
  isLoading: true,
  participationsTypes: [] as Array<IParticipationType>,
  getParticipationsTypes: async () => {
    const participationsTypes: Array<IParticipationType> = (await ApiService.get('/all/participations_type')).data;
    set({ isLoading: false, participationsTypes });
  },
}));