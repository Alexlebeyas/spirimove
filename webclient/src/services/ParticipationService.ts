import { ICreateParticipationForm } from '@/interfaces/ICreateParticipationForm';
import ApiService from '@/services/ApiService';

export class ParticipationService {
  static submitParticipation(data: ICreateParticipationForm) {
    const formData = new FormData();

    formData.set('name', 'asdasd');
    formData.set('contest', data.contestId.toString());
    formData.set('description', data.description);
    formData.set('date', data.date);
    formData.set('image', data.image as Blob);
    formData.set('is_intensive', data.isIntensive.toString());
    formData.set('is_in_group', 'false');
    formData.set('type', data.type.toString());

    ApiService.post('create/participation/', formData);
  }
}

export default ParticipationService;
