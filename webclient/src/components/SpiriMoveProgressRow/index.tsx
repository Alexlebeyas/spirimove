import { useTranslation } from 'react-i18next';
import './index.css';
import { IParticipation } from '@/interfaces';
import DoneIcon from '@mui/icons-material/Done';
import CancelIcon from '@mui/icons-material/Cancel';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import { Dispatch, SetStateAction} from 'react';
import { PARTICIPATION_IN_VERIFICATION } from '@/constants';


interface Props {
  currentDate: string;
  participation?: IParticipation|undefined;
  setConfirmDeleteOpen: Dispatch<SetStateAction<boolean>>;
  setIsEditParticipationModalOpen: Dispatch<SetStateAction<boolean>>;
  setParticipationToHandle: Dispatch<SetStateAction<IParticipation>>;
}

export const SpiriMoveProgressRow: React.FC<Props> = ({ currentDate, participation, setConfirmDeleteOpen, setParticipationToHandle, setIsEditParticipationModalOpen }) => {
  const { t } = useTranslation();

  const deleteRow = () => {
    if(participation){
      setParticipationToHandle(participation);
      setConfirmDeleteOpen(true);
    }
  }

  const editRow = () => {
    if(participation){
      setParticipationToHandle(participation);
      setIsEditParticipationModalOpen(true);
    }
  }

  if (participation === undefined) {
    return (
      <tr className="flex-no wrap mb-2 flex flex-col hover:bg-gray-100 sm:mb-0 sm:table-row">
        <td className="border-grey-light border p-3">{currentDate}</td>
        <td className="border-grey-light border p-3">&nbsp;</td>
        <td className="border-grey-light border p-3">&nbsp;</td>
        <td className="border-grey-light border p-3">&nbsp;</td>
        <td className="border-grey-light border p-3">&nbsp;</td>
        <td className="border-grey-light border p-3">&nbsp;</td>
      </tr>
    );
  }

  const intensityValue = participation?.is_intensive ? t('Common.Yes') : t('Common.No');
  return (
    <tr className="flex-no wrap mb-2 flex flex-col hover:bg-gray-100 sm:mb-0 sm:table-row">
      <td className="border-grey-light border p-3">{currentDate}</td>
      <td className="border-grey-light border p-3">{participation?.type ? participation?.type.name : t('ParticipationType.Normal')}</td>
      <td className="border-grey-light border p-3">{participation?.description}</td>
      <td className="border-grey-light border p-3">
        {participation?.type ? intensityValue : <hr className="h-px border-0 bg-gray-500" />}
      </td>
      <td className="border-grey-light border p-3">
        {participation?.status_display === 'Approved' ? <DoneIcon style={{ color: 'green' }} /> : (participation?.status_display === 'In verification' ? <HourglassTopIcon style={{ color: 'orange' }} /> : <CancelIcon style={{ color: 'red' }} />) }
        {participation?.status_display }
      </td>
      <td className="border-grey-light border p-3">
        {participation?.status_display === PARTICIPATION_IN_VERIFICATION && (
          <>
            <IconButton style={{ color: 'green' }} aria-label="edit" onClick={editRow}> <EditIcon /> </IconButton>
            <IconButton style={{ color: 'red' }} aria-label="delete" onClick={deleteRow}> <DeleteIcon /> </IconButton>
          </>
        )}
      </td>
    </tr>
  );
};
