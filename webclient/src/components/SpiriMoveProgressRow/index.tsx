import { GetTranslatedParticipationType, ParticipationType } from '@/utils/participationTypes';
import { useTranslation } from 'react-i18next';
import './index.css';
import { IParticipation } from '@/interfaces';
import DoneIcon from '@mui/icons-material/Done';
import CancelIcon from '@mui/icons-material/Cancel';

interface Props {
  currentDate: string;
  participation?: IParticipation;
}

export const SpiriMoveProgressRow: React.FC<Props> = ({ currentDate, participation }) => {
  const { t } = useTranslation();
  if (participation === undefined) {
    return (
      <tr className="flex-no wrap mb-2 flex flex-col hover:bg-gray-100 sm:mb-0 sm:table-row">
        <td className="border-grey-light border p-3">{currentDate}</td>
        <td className="border-grey-light border p-3">&nbsp;</td>
        <td className="border-grey-light border p-3">&nbsp;</td>
        <td className="border-grey-light border p-3">&nbsp;</td>
        <td className="border-grey-light border p-3">&nbsp;</td>
      </tr>
    );
  }

  console.log(participation.is_approved);
  const typeName = GetTranslatedParticipationType(
    participation.type ? participation.type.id : ParticipationType.Normal
  );

  return (
    <tr className="flex-no wrap mb-2 flex flex-col hover:bg-gray-100 sm:mb-0 sm:table-row">
      <td className="border-grey-light border p-3">{currentDate}</td>
      <td className="border-grey-light border p-3">{t(typeName)}</td>
      <td className="border-grey-light border p-3">{participation.description}</td>
      <td className="border-grey-light border p-3">
        {participation.is_intensive ? t('Participation.HighIntensity.Label') : t('Participation.LowIntensity.Label')}
      </td>
      <td className="border-grey-light border p-3">
        {participation.is_approved ? <DoneIcon style={{ color: 'green' }} /> : <CancelIcon style={{ color: 'red' }} />}
        {participation.is_approved ? t('Participation.Approved') : t('Participation.NotApproved')}
      </td>
    </tr>
  );
};
