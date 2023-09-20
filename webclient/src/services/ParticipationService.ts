import { ICreateParticipationForm } from '@/interfaces/ICreateParticipationForm';
import { IParticipation, ToggleReactionsType } from '@/interfaces';
import ApiService from '@/services/ApiService';
import { toast } from 'react-toastify';
import { AxiosResponse } from 'axios';
import i18n from 'i18next';

type ResponseType = 
  | 'Success'
  | 'error'
  | 'SubmitActivitySuccess'
  | 'SubmitActivityError'
  | 'DeleteActivitySuccess'
  | 'DeleteActivityError';


const ToastDisplay = (response: AxiosResponse<{ errors: { detail: string }[] }>, responseType: ResponseType) => {
  let toastMessage: string;
  let toastType = toast.success;

  if (responseType === 'error') {
    toastMessage = response?.data.errors[0].detail;
    toastType = toast.error;
  } else {
    toastMessage = i18n.t(`Request.${responseType}`);
    if (['SubmitActivityError', 'DeleteActivityError'].includes(responseType)) {
      toastType = toast.error;
    }
  }

  toastType(toastMessage, {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 20000,
  });
};

interface FormEntryError {
  attr: string,
  detail: string
}

class ParticipationService {
  static submitParticipation(data: ICreateParticipationForm) {
    const formData = new FormData();

    formData.set('contest', data.contestId.toString());
    formData.set('description', data.description);
    formData.set('date', data.date);
    if(data.image){
      formData.set('image', data.image as Blob);
    }
    formData.set('is_intensive', data.isIntensive.toString());
    formData.set('is_organizer', data.isOrganizer.toString());
    formData.set('type', data.type.toString());

    return ApiService.post('/create/participation/', formData)
      .then(function (response) {
        ToastDisplay(response, 'SubmitActivitySuccess');
      })
      .catch(function (error) {
        ToastDisplay(error.response, 'SubmitActivityError');
        return Promise.reject(Object.fromEntries(error.response.data.errors.map((x: FormEntryError) => [x.attr, x.detail])));
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
        ToastDisplay(data, 'SubmitActivitySuccess');
      })
      .catch(function (error) {
        ToastDisplay(error.response, 'SubmitActivityError');
        return Promise.reject(Object.fromEntries(error.response.data.errors.map((x: FormEntryError) => [x.attr, x.detail])))
      });
  }

  static deleteParticipation(data: IParticipation) {
    return ApiService.delete(`/delete/participation/${data.id}/`)
      .then(function (data) {
        ToastDisplay(data, 'DeleteActivitySuccess');
      })
      .catch(function (error) {
        ToastDisplay(error.response, 'DeleteActivityError');
      });
  }

  static toggleReactionParticipation(data: ToggleReactionsType) {
    return ApiService.post(`reaction/participation/`, data)
  }
}

export default ParticipationService;
