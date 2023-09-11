import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Dispatch, SetStateAction} from 'react';
import { IParticipation } from '@/interfaces';
import { useTranslation } from 'react-i18next';


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
            <DialogTitle id="alert-dialog-title">{t('Common.DeleteTitle')}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                {t('Participation.DeleteMessageConfirm')} <br/>
                {t('Participation.ActivityDescription')} : <strong>{participation?.description}</strong> <br/>
                {t('Participation.ActivityDate')} : <strong>{participation?.date}</strong> ?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} autoFocus>{t('Common.Cancel')} </Button>
                <Button onClick={handleDelete}>{t('Common.Delete')}</Button>
            </DialogActions>
            </Dialog>
        </div>
    );
}