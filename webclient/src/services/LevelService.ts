import ApiService from '@/services/ApiService';

export class LevelService {
  async getCurrent() {
    return (await ApiService.get('/all/level')).data;
  }
}

export default new LevelService();
