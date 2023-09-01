import ApiService from '@/services/ApiService';

export class ContestService {
  async getCurrent() {
    const contests = (await ApiService.get('/all/contests')).data;

    return contests[0];
  }
}

export default new ContestService();
