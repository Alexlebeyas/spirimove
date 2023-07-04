import { DATE_FORMAT } from '@/utils/formats';
import moment from 'moment';

export const getDates = function (strStartDate: string, strEndDate: string): string[] {
  const dateArray = [];
  let currentDate = moment(strStartDate);
  const endDate = moment(strEndDate);
  while (currentDate <= endDate) {
    dateArray.push(moment(currentDate).format(DATE_FORMAT));
    currentDate = moment(currentDate).add(1, 'days');
  }
  return dateArray;
};
