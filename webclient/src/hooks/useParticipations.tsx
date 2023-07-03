import { IParticipation } from '@/interfaces';
import ApiService from '@/services/ApiService';
import { useState, useEffect } from 'react';

export const useParticipations = () => {
  const [participations, setParticipations] = useState<Array<IParticipation>>([]);
  const [isLoading, setIsloading] = useState(true);

  const getParticipations = async () => {
    const participations: Array<IParticipation> = (await ApiService.get('/all/participations')).data;
    setParticipations([...participations]);
    setIsloading(false);
  };

  useEffect(() => {
    getParticipations();
  }, []);

  return { participations, isLoading };
};
