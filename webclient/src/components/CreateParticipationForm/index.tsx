import { Dispatch, SetStateAction, useState } from 'react';
import { ICreateParticipationForm } from '@/interfaces/ICreateParticipationForm';
import moment from 'moment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import HelpIcon from '@mui/icons-material/Help';
import ParticipationService from '@/services/ParticipationService';
import { DATE_FORMAT } from '@/constants/formats';
import { useTranslation } from 'react-i18next';
import Button from '@mui/material/Button';
import {
  Checkbox,
  ClickAwayListener,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Tooltip,
} from '@mui/material';

import useParticipationStore from '@/stores/useParticipationStore';

interface Props {
  startDate: string;
  endDate: string;
  contestId: number;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const CreateParticipationForm: React.FC<Props> = ({ contestId, startDate, endDate, setOpen }) => {
  const [participationData, setParticipationData] = useState<ICreateParticipationForm>({
    contestId: contestId,
    name: 'name',
    description: '',
    date: moment().format(DATE_FORMAT),
    image: undefined,
    isIntensive: false,
    type: 1,
  });

  const [tooltipVisibility, setTooltipVisibility] = useState(false);
  const [fileName, setFileName] = useState('');

  const { t } = useTranslation();

  const { refreshParticipations } = useParticipationStore((state) => state);

  const onSubmitHandler = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    ParticipationService.submitParticipation(participationData);
    setOpen(false);
    await refreshParticipations();
  };

  const onCancelHandler = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setOpen(false);
  };

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file = e.target?.files != undefined ? e.target.files[0] : undefined;
    const fn = file != undefined ? file.name : '';
    setFileName(fn);

    setParticipationData({
      ...participationData,
      image: file,
    });
  };

  const onParticipationTypeChange = (e: SelectChangeEvent<number>) => {
    const val = Number(e.target.value);
    const intensive = val == 1 ? participationData.isIntensive : false;
    setParticipationData({
      ...participationData,
      type: Number(e.target.value),
      isIntensive: intensive,
    });
  };

  return (
    <>
      <h1 className="mb-6">{t('Participation.Title')}</h1>
      <form>
        <div className="mb-6">
          <div data-te-datepicker-init data-te-inline="true" data-te-input-wrapper-init>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DatePicker
                className="w-full"
                label={t('Participation.ActivityDate')}
                value={moment(participationData.date)}
                minDate={moment(startDate, DATE_FORMAT)}
                maxDate={moment(endDate, DATE_FORMAT)}
                onChange={(newValue) => {
                  if (newValue !== null) {
                    setParticipationData({
                      ...participationData,
                      date: newValue?.format(DATE_FORMAT),
                    });
                  }
                }}
              />
            </LocalizationProvider>
          </div>
        </div>
        <div className="mb-6">
          <input
            accept="image/*"
            hidden
            id="raised-button-file"
            type="file"
            onChange={handleImageFile}
            style={{ display: 'none' }}
          />
          <label htmlFor="raised-button-file">
            <Button className="w-full" variant="outlined" component="span" onChange={handleImageFile}>
              {t('Participation.SelectImage')}
            </Button>
            <span>{fileName}</span>
          </label>
        </div>
        <div className="mb-6 md:flex md:items-center">
          <FormControl className="w-full" variant="outlined" style={{ width: '100%' }}>
            <InputLabel id="activity-type-label">{t('Participation.ActivityType')}</InputLabel>
            <Select
              className={'w-full'}
              labelId="activity-type-label"
              value={participationData.type}
              variant="outlined"
              label="Activity Type"
              onChange={onParticipationTypeChange}
            >
              <MenuItem value={1}>{t('ParticipationType.Normal')}</MenuItem>
              <MenuItem value={2}>{t('ParticipationType.Popup')}</MenuItem>
              <MenuItem value={3}>{t('ParticipationType.Group')}</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className="mb-6 md:flex md:items-center">
          <TextField
            required={true}
            className="mb-6 w-full"
            id="outlined-basic"
            label="Activity Description"
            variant="outlined"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setParticipationData({
                ...participationData,
                description: e.target.value,
              })
            }
          />
        </div>

        {participationData.type === 1 ? (
          <div className="mb-6">
            <FormControlLabel
              label={t('Participation.HighIntensity.Label')}
              control={
                <Checkbox
                  checked={participationData.isIntensive}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setParticipationData({
                      ...participationData,
                      isIntensive: e.target.checked,
                    })
                  }
                />
              }
            />
            <ClickAwayListener onClickAway={() => setTooltipVisibility(false)}>
              <Tooltip
                PopperProps={{
                  disablePortal: true,
                }}
                onClose={() => setTooltipVisibility(false)}
                open={tooltipVisibility}
                disableFocusListener
                disableHoverListener
                disableTouchListener
                title={t('Participation.HighIntensity.Tooltip')}
              >
                <HelpIcon onClick={() => setTooltipVisibility(true)} />
              </Tooltip>
            </ClickAwayListener>
          </div>
        ) : (
          ''
        )}

        <div className="mb-6 md:flex md:items-center">
          <Button
            className="w-full"
            variant="contained"
            component="label"
            onClick={onSubmitHandler}
            disabled={!participationData.image || participationData.description === ''}
          >
            {t('Button.Submit')}
          </Button>
        </div>
        <div className="mb-6 md:flex md:items-center">
          <Button className="w-full" variant="contained" component="label" onClick={onCancelHandler}>
            {t('Button.Cancel')}
          </Button>
        </div>
      </form>
    </>
  );
};

export default CreateParticipationForm;
