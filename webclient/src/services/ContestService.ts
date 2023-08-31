import { IContest } from '@/interfaces';
import ApiService from '@/services/ApiService';

export class ContestService {
  async getCurrent() {
    const contests = (await ApiService.get('/all/contests')).data;

    return contests[0];
    // return undefined;
  }
}

export default new ContestService();
