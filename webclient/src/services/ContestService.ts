import ApiService from '@/services/ApiService';

export class ContestService {
  async getCurrent() {
    return (await ApiService.get('/all/contests')).data[0];
  }
}

export default new ContestService();
