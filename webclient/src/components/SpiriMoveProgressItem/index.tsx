import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import './index.css';
import { IParticipation, ParticipationStatus, ParticipationStatusColorMap } from '@/interfaces';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';

interface Props {
  currentDate: string;
  participation?: IParticipation;
  setConfirmDeleteOpen: Dispatch<SetStateAction<boolean>>;
  setIsEditParticipationModalOpen: Dispatch<SetStateAction<boolean>>;
  setParticipationToHandle: Dispatch<SetStateAction<IParticipation | null>>;
  viewMode: 'card' | 'row';
}

interface CommonProps {
  currentDate: string;
  description?: string;
  type?: string;
  is_intensive?: string;
  is_organizer?: string;
  status?: ParticipationStatus;
  score?: string | number;
}

const getScore = (status?: ParticipationStatus, points?: number): string | number => {
  switch (status) {
    case ParticipationStatus.Approved:
      return points || 0;
    case ParticipationStatus.Rejected:
    case ParticipationStatus.InVerification:
      return '-';
    default:
      return 0;
  }
};

const renderStatus = (status?: ParticipationStatus): JSX.Element | null => {
  if (!status) return null;
  const color = ParticipationStatusColorMap[status];
  if (!color) return null;
  return (
    <>
      <FiberManualRecordIcon style={{ color, fontSize: '17px' }} /> {status}
    </>
  );
};

const EmptyRow: React.FC<{ currentDate: string }> = ({ currentDate }) => (
  <tr className="flex-no wrap mb-2 flex flex-col hover:bg-gray-100 sm:mb-0 sm:table-row">
    <td className="border-grey-light border p-3">{currentDate}</td>
    {Array(7)
      .fill(null)
      .map((_, id) => (
        <td key={id} className="border-grey-light border p-3">
          &nbsp;
        </td>
      ))}
  </tr>
);

const SpiriMoveProgressItem: React.FC<Props> = ({
  currentDate,
  participation,
  setConfirmDeleteOpen,
  setIsEditParticipationModalOpen,
  viewMode,
  setParticipationToHandle,
}) => {
  const { t } = useTranslation();

  const commonValues = {
    is_intensive: t('Common.Yes'),
    is_organizer: t('Common.Yes'),
    description: participation?.description,
    type: participation?.type?.name,
    status: participation?.status_display,
    score: getScore(participation?.status_display, participation?.points),
  };

  const handleRow = (action: Dispatch<SetStateAction<boolean>>) => {
    if (participation) {
      setParticipationToHandle(participation);
      action(true);
    }
  };

  const EmptyCard: React.FC<{ currentDate: string }> = ({ currentDate }) => (
    <div className="m-2 rounded border bg-white p-4 shadow-md">
      <div className="flex items-center justify-between">
        <div className="font-bold">{currentDate}</div>
      </div>
      <div className="mt-2">{t('ContestCalendar.NoData')}</div>
    </div>
  );

  const ActionButtons = () => {
    return (
      <>
        <IconButton
          style={{ color: 'green' }}
          aria-label="edit"
          onClick={() => handleRow(setIsEditParticipationModalOpen)}
        >
          <EditIcon />
        </IconButton>
        <IconButton style={{ color: 'red' }} aria-label="delete" onClick={() => handleRow(setConfirmDeleteOpen)}>
          <DeleteIcon />
        </IconButton>
      </>
    );
  };

  const CardView: React.FC<CommonProps> = ({
    currentDate,
    description,
    type,
    is_intensive,
    is_organizer,
    status,
    score,
  }) => (
    <div className="m-2 rounded border bg-white p-4 shadow-md">
      <div className="flex items-center justify-between">
        <div className="font-bold">{currentDate}</div>
        <div>{renderStatus(status)}</div>
      </div>
      <div className="mt-2">
        {t('ContestCalendar.Description')}: {description}
      </div>
      <div className="mt-2">
        {t('ContestCalendar.ParticipationType')}: {type}
      </div>
      <div className="mt-2">
        {t('ContestCalendar.Intensity')}: {type === 'Normal' ? is_intensive : '-'}
      </div>
      <div className="mt-2">
        {t('ContestCalendar.Initiator')}: {type !== 'Normal' ? is_organizer : '-'}
      </div>
      <div className="mt-2 flex items-center justify-between">
        <div>
          <b>{t('ContestCalendar.Score')}</b>: {score}
        </div>
        <div>{status === ParticipationStatus.InVerification && <ActionButtons />}</div>
      </div>
    </div>
  );

  const RowView: React.FC<CommonProps> = ({
    currentDate,
    description,
    type,
    is_intensive,
    is_organizer,
    status,
    score,
  }) => (
    <tr className="flex-no wrap mb-2 flex flex-col hover:bg-gray-100 sm:mb-0 sm:table-row">
      <td className="border-grey-light border p-3">{currentDate}</td>
      <td className="border-grey-light border p-3">{type}</td>
      <td className="border-grey-light border p-3">{type === 'Normal' ? is_intensive : '-'}</td>
      <td className="border-grey-light border p-3">{type !== 'Normal' ? is_organizer : '-'}</td>
      <td className="border-grey-light border p-3">{description}</td>
      <td className="border-grey-light border p-3">{renderStatus(status)}</td>
      <td className="border-grey-light border p-3">{score}</td>
      <td className="border-grey-light border p-3">
        {status === ParticipationStatus.InVerification && <ActionButtons />}
      </td>
    </tr>
  );

  if (viewMode === 'card') {
    return participation ? (
      <CardView {...commonValues} currentDate={currentDate} />
    ) : (
      <EmptyCard currentDate={currentDate} />
    );
  } else if (viewMode === 'row') {
    return participation ? (
      <RowView {...commonValues} currentDate={currentDate} />
    ) : (
      <EmptyRow currentDate={currentDate} />
    );
  }
};

export default SpiriMoveProgressItem;
