import React, { Dispatch, SetStateAction, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import './index.css';
import { IParticipation, ParticipationStatus, ParticipationStatusColorMap } from '@/interfaces';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import { useContest } from '@/hooks';
import { formatDate } from '@/utils/dates';

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
  image?: string;
}

interface ActionButtonsProps {
  handleRowEdit: () => void;
  handleRowDelete: () => void;
  canEdit: boolean;
}

const getScore = (status?: ParticipationStatus, points?: number): string | number => {
  switch (status) {
    case ParticipationStatus.Approved:
      return points || 0;
    case ParticipationStatus.InVerification:
      return '-';
    case ParticipationStatus.Rejected:
    default:
      return 0;
  }
};

const renderStatus = (t: (key: string) => string, status?: ParticipationStatus): JSX.Element | null => {
  if (!status) return null;
  const color = ParticipationStatusColorMap[status];
  if (!color) return null;
  return (
    <span className="align-middle">
      <FiberManualRecordIcon style={{ color, fontSize: '16px' }} /> {t(`Participation.ValidationState.${status}`)}
    </span>
  );
};

const EmptyRow: React.FC<{ currentDate: string }> = ({ currentDate }) => (
  <tr className="flex-no wrap mb-2 flex flex-col border-b border-slate-200 text-darkblue-800 hover:bg-slate-50 sm:mb-0 sm:table-row">
    <td className="px-3 py-2">{formatDate(currentDate)}</td>
    {Array(8)
      .fill(null)
      .map((_, id) => (
        <td key={id} className="p-4">
          &nbsp;
        </td>
      ))}
  </tr>
);

const EmptyCard: React.FC<{ currentDate: string; message: string }> = ({ currentDate, message }) => (
  <div className="mx-4 mb-5 rounded-md bg-white px-4 py-5 antialiased shadow-md">
    <div className="flex items-center justify-between">
      <div className="font-semibold text-darkblue-800">{formatDate(currentDate)}</div>
    </div>
    <div className="mt-2 text-sm text-slate-600">{message}</div>
  </div>
);

const ActionButtons: React.FC<ActionButtonsProps> = ({ handleRowEdit, handleRowDelete, canEdit }) => {
  return (
    <>
      {canEdit && (
        <IconButton style={{ color: '#2F3940' }} aria-label="edit" onClick={handleRowEdit}>
          <EditIcon />
        </IconButton>
      )}
      <IconButton style={{ color: '#2F3940' }} aria-label="delete" onClick={handleRowDelete}>
        <DeleteIcon />
      </IconButton>
    </>
  );
};

const SpiriMoveProgressItem: React.FC<Props> = ({
  currentDate,
  participation,
  setConfirmDeleteOpen,
  setIsEditParticipationModalOpen,
  viewMode,
  setParticipationToHandle,
}) => {
  const { t } = useTranslation();
  const { contest } = useContest();
  const isContestOngoing = contest?.is_open && !contest?.show_winners;

  const commonValues = {
    is_intensive: participation?.is_intensive ? t('Common.Yes') : t('Common.No'),
    is_organizer: participation?.is_organizer ? t('Common.Yes') : t('Common.No'),
    description: participation?.description,
    type: participation?.type?.name,
    status: participation?.status_display,
    score: getScore(participation?.status_display, participation?.points),
    image: participation?.image,
  };

  const handleRow = useCallback(
    (action: Dispatch<SetStateAction<boolean>>) => {
      if (participation) {
        setParticipationToHandle(participation);
        action(true);
      }
    },
    [participation, setParticipationToHandle]
  );

  const handleRowEdit = useCallback(() => {
    handleRow(setIsEditParticipationModalOpen);
  }, [setIsEditParticipationModalOpen, handleRow]);

  const handleRowDelete = useCallback(() => {
    handleRow(setConfirmDeleteOpen);
  }, [setConfirmDeleteOpen, handleRow]);

  const CardView: React.FC<CommonProps> = ({
    currentDate,
    description,
    type,
    is_intensive,
    is_organizer,
    status,
    score,
    image,
  }) => (
    <div className="mx-4 mb-5 rounded-md bg-white px-4 py-5 text-darkblue-800 antialiased shadow-md">
      <div className="flex items-center justify-between">
        <div className="font-semibold">{formatDate(currentDate)}</div>
        <div className="font-medium">{renderStatus(t, status)}</div>
      </div>
      {image && (
        <div className="mt-4">
          <img className="max-h-[100px] max-w-[100px] object-cover" src={image} alt="Activity Image" loading="lazy" />
        </div>
      )}

      <div className="mt-4 text-sm font-medium">{description}</div>
      <div className="mt-1 text-sm font-medium">
        {t('ContestCalendar.ParticipationType')}: {type}
      </div>
      <div className="mt-1 text-sm font-medium">
        {t('ContestCalendar.Intensity')}: {type === 'Standard' ? is_intensive : '-'}
      </div>
      <div className="mt-1 text-sm font-medium">
        {t('ContestCalendar.Initiator')}: {type !== 'Standard' ? is_organizer : '-'}
      </div>
      <div className="mt-1 flex items-center justify-between">
        <div className="font-semibold">
          {t('ContestCalendar.Score')}: {score}
        </div>
        <div>
          {isContestOngoing && (
            <ActionButtons
              handleRowEdit={handleRowEdit}
              handleRowDelete={handleRowDelete}
              canEdit={status === ParticipationStatus.InVerification}
            />
          )}
        </div>
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
    image,
  }) => (
    <tr className="wrap mb-2 flex flex-col border-b border-slate-200 text-darkblue-800 hover:bg-slate-50 sm:mb-0 sm:table-row">
      <td className="px-3 py-2">{formatDate(currentDate)}</td>
      <td className="px-3 py-2">{type}</td>
      <td className="px-3 py-2">{type === 'Standard' ? is_intensive : '-'}</td>
      <td className="px-3 py-2">{type !== 'Standard' ? is_organizer : '-'}</td>
      <td className="px-3 py-2">{description}</td>
      <td className="px-3 py-2">{renderStatus(t, status)}</td>
      <td className="px-3 py-2">{score}</td>
      <td className="px-3 py-2">
        {image && (
          <img className="max-h-[50px] max-w-[50px] object-cover" src={image} alt="Activity Image" loading="lazy" />
        )}
      </td>
      <td className="py-2 pr-3 text-right">
        {isContestOngoing && (
          <ActionButtons
            handleRowEdit={handleRowEdit}
            handleRowDelete={handleRowDelete}
            canEdit={status === ParticipationStatus.InVerification}
          />
        )}
      </td>
    </tr>
  );

  if (viewMode === 'card') {
    return participation ? (
      <CardView {...commonValues} currentDate={currentDate} />
    ) : (
      <EmptyCard currentDate={currentDate} message={t('ContestCalendar.NoData')} />
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
