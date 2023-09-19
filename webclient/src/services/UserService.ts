import { IUser } from '@/interfaces';
import ApiService from '@/services/ApiService';

class UserService {
  async getMy(): Promise<IUser> {
    return (await ApiService.get('/my/profile')).data[0];
  }

  async updateProfileImage(image: File) {
    const formData = new FormData();

    formData.append('profile_picture', image);

    return await ApiService.put('/update/profile/', formData);
  }

  async deleteProfileImage() {
    const formData = new FormData();

    formData.append('profile_picture', '');

    return await ApiService.put('/update/profile/', formData);
  }

  async updateOffice(office: string) {
    const formData = new FormData();

    formData.append('office', office);

    return await ApiService.put('/update/profile/', formData);
  }
}

export default new UserService();
