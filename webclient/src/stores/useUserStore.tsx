import { create } from 'zustand';
import { IUser } from '@/interfaces';
import UserService from '@/services/UserService';

interface UserState {
  user: IUser;
  fetchUser: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const useUserStore = create<UserState>((set) => ({
  user: {
    email: '',
    phone: '',
    office: '',
    display_name: '',
    profile_picture: '',
  },
  fetchUser: async () => {
    const user = await UserService.getMy();
    set({ user });
  },
  refreshUser: async () => {
    const user = await UserService.getMy();
    set({ user });
  },
}));

export default useUserStore;
