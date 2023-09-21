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
    image: t('ContestCalendar.Image'),
    actions: t('Common.Actions'),
  };

  return (
    <table className="mb-5 w-full overflow-hidden rounded-lg antialiased sm:bg-white sm:shadow-lg">
      <thead className="text-white">
        <tr className="rounded-l-lg bg-darkblue-800">
          {Object.entries(headers).map(([key, header]) => (
            <th key={key} className="px-3 py-4 text-left text-sm font-medium">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {participations.map(({ contestDate, participation }, index) => (
          <SpiriMoveProgressItem
            key={`${contestDate}-${index}`}
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
