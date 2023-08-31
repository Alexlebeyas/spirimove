import { DATE_FORMAT } from '@/constants/formats';
import { DateTime } from 'luxon';
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

export const daysInterval = function (from: DateTime, to: DateTime): number {
  return to.diff(from).as('days');
};
