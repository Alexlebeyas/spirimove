import CreateParticipationForm from '@/components/CreateParticipationForm';
import moment from 'moment';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { Dispatch, SetStateAction } from 'react';
import { DATE_FORMAT } from '@/constants/formats';
import { IParticipation } from '@/interfaces';
interface Props {
  contestId: number;
  startDate: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  participationToEdit?: IParticipation | null;
}

export const ParticipateModal: React.FC<Props> = ({ contestId, startDate, open, setOpen, participationToEdit }) => {
  const endDate = moment().format(DATE_FORMAT);

  return (
    <div>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        scroll="body"
        aria-labelledby="participate-dialog-title"
        aria-describedby="participate-dialog-description"
        maxWidth="sm"
        fullWidth
      >
        <DialogContent dividers>
          <CreateParticipationForm
            contestId={contestId}
            startDate={startDate}
            endDate={endDate}
            setOpen={setOpen}
            participationToEdit={participationToEdit}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
