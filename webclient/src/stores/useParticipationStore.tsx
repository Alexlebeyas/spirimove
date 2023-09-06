import { create } from 'zustand';
import { IParticipation, ResponseParticipations } from '@/interfaces';
import ApiService from '@/services/ApiService';
import { IParticipationType } from '@/interfaces';

interface PaginateParticipationState {
  isLoading: boolean;
  count: number;
  next: string;
  previous: string;
  participations: Array<IParticipation>;
  getParticipations: () => Promise<void>;
  nextParticipations: (currParticipations:Array<IParticipation>, nextPage:string) => Promise<void>;
  updateParticipations: (participations:Array<IParticipation>, participation: IParticipation, index: number) => Promise<void>;
}


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

export const fetchAllParticipations  = create<PaginateParticipationState>((set) => ({
  isLoading: true,
  participations: [] ,
  count: 0 ,
  next: '' ,
  previous: '' ,
  getParticipations: async () => {
    const response: ResponseParticipations = (await ApiService.get('/all/participations')).data;
    set({ 
      isLoading: false, 
      count: response.count, 
      next: response.next?response.next.split("?")[1]:'', 
      previous: response.previous?response.previous.split("?")[1]:'',
      participations: response.results
     });
  },
  nextParticipations: async (currParticipations, nextPage) => {
    const response: ResponseParticipations = (await ApiService.get(`/all/participations/?${nextPage}`)).data;
    set({ 
      isLoading: false, 
      count: response.count, 
      next: response.next?response.next.split("?")[1]:'',
      previous: response.previous?response.previous.split("?")[1]:'',
      participations: currParticipations.concat(response.results),
     });
  },
  updateParticipations: async (participations, participation, index) => {
    participations[index].reactions=participation.reactions;
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
