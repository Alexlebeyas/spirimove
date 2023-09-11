import React from 'react';
import { useTranslation } from 'react-i18next';
import { ViewProps } from './interfaces';
import SpiriMoveProgressItem from '@/components/SpiriMoveProgressItem';

const DesktopView: React.FC<ViewProps> = ({
  participations,
  setConfirmDelOpen,
  setIsEditParticipationModalOpen,
  setParticipationToHandle,
}) => {
  const { t } = useTranslation();

  const headers = {
    date: t('ContestCalendar.Date'),
    participationType: t('ContestCalendar.ParticipationType'),
    intensity: t('ContestCalendar.Intensity'),
    initiator: t('ContestCalendar.Initiator'),
    description: t('ContestCalendar.Description'),
    status: t('ContestCalendar.Status'),
    score: t('ContestCalendar.Score'),
    actions: t('Common.Actions'),
  };

  return (
    <table className="my-5 w-full overflow-hidden rounded-lg sm:bg-white sm:shadow-lg">
      <thead className="text-white">
        <tr className="rounded-l-lg bg-gray-800">
          {Object.values(headers).map((header, index) => (
            <th key={index} className="p-3 text-left">{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {participations.map(({ contestDate, participation }, index) => (
          <SpiriMoveProgressItem
            key={index}
            currentDate={contestDate}
            participation={participation}
            setConfirmDeleteOpen={setConfirmDelOpen}
            setIsEditParticipationModalOpen={setIsEditParticipationModalOpen}
            setParticipationToHandle={setParticipationToHandle}
            viewMode={'row'}
          />
        ))}
      </tbody>
    </table>
  );
};

export default DesktopView;
