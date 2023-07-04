import CreateParticipationForm from '@/components/CreateParticipationForm';
import moment from 'moment';
import Box from '@mui/material/Box';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Modal } from '@mui/material';
import { DATE_FORMAT } from '@/constants/formats';

const desktopStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '600',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const mobileStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '95%',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

interface Props {
  contestId: string;
  startDate: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const Participate: React.FC<Props> = ({ contestId, startDate, open, setOpen }) => {
  const [mobile, setMobile] = useState(window.innerWidth <= 500);

  const handleWindowSizeChange = () => {
    setMobile(window.innerWidth <= 720);
  };

  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    };
  }, []);

  const endDate = moment().format(DATE_FORMAT);

  return (
    <div>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={mobile ? mobileStyle : desktopStyle}>
          <CreateParticipationForm contestId={contestId} startDate={startDate} endDate={endDate} setOpen={setOpen} />
        </Box>
      </Modal>
    </div>
  );
};

export default Participate;
