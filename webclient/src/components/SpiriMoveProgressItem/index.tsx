import React, { Dispatch, SetStateAction, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import './index.css';
import { IParticipation, ParticipationStatus, ParticipationStatusColorMap } from '@/interfaces';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import { useContest } from '@/hooks';
import { isContestOver } from '@/utils/contest';
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
    <span>
      <FiberManualRecordIcon style={{ color, fontSize: '17px' }} /> {status}
    </span>
  );
};

const EmptyRow: React.FC<{ currentDate: string }> = ({ currentDate }) => (
  <tr className="flex-no wrap mb-2 flex flex-col hover:bg-gray-100 sm:mb-0 sm:table-row">
    <td className="border-grey-light border p-3">{currentDate}</td>
    {Array(8)
      .fill(null)
      .map((_, id) => (
        <td key={id} className="border-grey-light border p-3">
          &nbsp;
        </td>
      ))}
  </tr>
);

const EmptyCard: React.FC<{ currentDate: string; message: string }> = ({ currentDate, message }) => (
  <div className="m-2 rounded border bg-white p-4 shadow-md">
    <div className="flex items-center justify-between">
      <div className="font-bold">{currentDate}</div>
    </div>
    <div className="mt-2">{message}</div>
  </div>
);

const ActionButtons: React.FC<ActionButtonsProps> = ({ handleRowEdit, handleRowDelete, canEdit }) => {
  return (
    <>
      {canEdit && (
        <IconButton style={{ color: 'green' }} aria-label="edit" onClick={handleRowEdit}>
          <EditIcon />
        </IconButton>
      )}
      <IconButton style={{ color: 'red' }} aria-label="delete" onClick={handleRowDelete}>
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
  const isContestOngoing = contest?.end_date && !isContestOver(contest.end_date);

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
    <div className="m-2 rounded border bg-white p-4 shadow-md">
      <div className="flex items-center justify-between">
        <div className="font-bold">{currentDate}</div>
        <div>{renderStatus(status)}</div>
      </div>
      {image && (
        <div className="mt-4">
          <img className="max-h-[100px] max-w-[100px] object-cover" src={image} alt="Activity Image" loading="lazy" />
        </div>
      )}

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
    <tr className="flex-no wrap mb-2 flex flex-col hover:bg-gray-100 sm:mb-0 sm:table-row">
      <td className="border-grey-light border p-3">{currentDate}</td>
      <td className="border-grey-light border p-3">{type}</td>
      <td className="border-grey-light border p-3">{type === 'Normal' ? is_intensive : '-'}</td>
      <td className="border-grey-light border p-3">{type !== 'Normal' ? is_organizer : '-'}</td>
      <td className="border-grey-light border p-3">{description}</td>
      <td className="border-grey-light border p-3">{renderStatus(status)}</td>
      <td className="border-grey-light border p-3">{score}</td>
      <td className="border-grey-light border p-3">
        {image && (
          <img className="max-h-[50px] max-w-[50px] object-cover" src={image} alt="Activity Image" loading="lazy" />
        )}
      </td>
      <td className="border-grey-light border p-3">
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
