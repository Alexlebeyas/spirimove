import { ICreateParticipationForm } from '@/interfaces/ICreateParticipationForm';
import { IParticipation, ToggleReactionsType } from '@/interfaces';
import ApiService from '@/services/ApiService';
import { toast } from 'react-toastify';
import { AxiosResponse } from 'axios';
import i18n from 'i18next';


const ToastDisplay = (response:AxiosResponse<{ errors: {detail: string}[] }>, responseType:'success' | 'error') => {
  if (responseType === 'error') {
    toast.error(response?.data.errors[0].detail, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 20000,
    });
  } else {
    toast.success(i18n.t('Request.Success'), {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 20000,
    });
  }
};

class ParticipationService {
  static submitParticipation(data: ICreateParticipationForm) {
    const formData = new FormData();

    formData.set('contest', data.contestId.toString());
    formData.set('description', data.description);
    formData.set('date', data.date);
    formData.set('image', data.image as Blob);
    formData.set('is_intensive', data.isIntensive.toString());
    formData.set('is_organizer', data.isOrganizer.toString());
    formData.set('type', data.type.toString());

    return ApiService.post('/create/participation/', formData)
      .then(function (response) {
        ToastDisplay(response, 'success');
      })
      .catch(function (error) {
        ToastDisplay(error.response, 'error');
      });
  }

  static updateParticipation(data: ICreateParticipationForm, paticipationId:number) {

    const formData = new FormData();

    formData.set('contest', data.contestId.toString());
    formData.set('description', data.description);
    formData.set('date', data.date);
    if(data.image){
      formData.set('image', data.image as Blob);
    }
    formData.set('is_intensive', data.isIntensive.toString());
    formData.set('is_organizer', data.isOrganizer.toString());
    formData.set('type', data.type ? data.type.toString() : "") ;

    return ApiService.put(`/update/participation/${paticipationId}/`, formData)
      .then(function (data) {
        ToastDisplay(data, 'success');
      })
      .catch(function (error) {
        ToastDisplay(error.response, 'error');
      });
  }

  static deleteParticipation(data: IParticipation) {
    return ApiService.delete(`/delete/participation/${data.id}/`)
      .then(function (data) {
        ToastDisplay(data, 'success');
      })
      .catch(function (error) {
        ToastDisplay(error.response, 'error');
      });
  }

  static toggleReactionParticipation(data: ToggleReactionsType) {
    return ApiService.post(`reaction/participation/`, data)
  }
}

export default ParticipationService;
