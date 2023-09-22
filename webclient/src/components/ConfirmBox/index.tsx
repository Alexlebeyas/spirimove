import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Dispatch, SetStateAction } from 'react';
import { IParticipation } from '@/interfaces';
import { useTranslation } from 'react-i18next';
import { formatDate } from '@/utils/dates';

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  participation?: IParticipation | null;
  handleDeleteParticipation: () => void;
}

export const ConfirmBox: React.FC<Props> = ({ open, setOpen, participation, handleDeleteParticipation }) => {
  const handleClose = () => {
    setOpen(false);
  };
  const handleDelete = () => {
    handleDeleteParticipation();
    setOpen(false);
  };

  const { t } = useTranslation();

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          className="text-darkblue-800"
          sx={{ fontSize: '1.4rem', fontWeight: '700', marginTop: 2 }}
          id="alert-dialog-title"
        >
          {t('Participation.DeleteActivity')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            sx={{ color: '#2F3940', fontWeight: '600', WebkitFontSmoothing: 'antialiased' }}
          >
            {t('Participation.DeleteMessageConfirm')} <br />
            {t('Participation.ActivityDescription.Label')} : <strong>{participation?.description}</strong> <br />
            {t('Participation.DateWithoutAsterisk')} : <strong>{formatDate(participation?.date)}</strong>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ marginBottom: 2, marginRight: 2 }}>
          <Button variant="outlined" size="large" onClick={handleClose} autoFocus sx={{ marginRight: 1 }}>
            {t('Common.KeepIt')}
          </Button>
          <Button className="MuiCustomButton-delete" variant="contained" size="large" onClick={handleDelete}>
            {t('Common.Delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
