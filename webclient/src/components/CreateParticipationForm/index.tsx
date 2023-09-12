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

import { IParticipation } from '@/interfaces';
import { fetchMyParticipations, fetchAllParticipations, fetchParticipationsType } from '@/stores/useParticipationStore';

interface Props {
  startDate: string;
  endDate: string;
  contestId: number;
  setOpen: Dispatch<SetStateAction<boolean>>;
  participationToEdit?: IParticipation | null;
}

const CreateParticipationForm: React.FC<Props> = ({ contestId, startDate, endDate, setOpen, participationToEdit }) => {
  const { isLoading, participationsTypes, getParticipationsTypes } = fetchParticipationsType((state) => state);
  if (isLoading) {
    getParticipationsTypes();
  }

  const [participationData, setParticipationData] = useState<ICreateParticipationForm>({
    contestId: contestId,
    name: 'name',
    description: participationToEdit ? participationToEdit.description : '',
    date: participationToEdit ? participationToEdit.date : moment().format(DATE_FORMAT),
    image: undefined,
    isIntensive: participationToEdit ? participationToEdit.is_intensive : false,
    isOrganizer: participationToEdit ? participationToEdit.is_organizer : false,
    type: participationToEdit?.type?.id ?? participationsTypes[0]?.id,
  });

  const [intensiveTooltipVisibility, setIntensiveTooltipVisibility] = useState(false);
  const [organizerTooltipVisibility, setOrganizerTooltipVisibility] = useState(false);
  const [showActivityTypeTooltip, setShowActivityTypeTooltip] = useState(false);

  const [fileUrl, setfileUrl] = useState(participationToEdit?.image ?? '');

  const updateMyParticipations = fetchMyParticipations((state) => state.getParticipations);
  const updateAllParticipations = fetchAllParticipations((state) => state.getParticipations);

  const [canBeIntensive, setCanBeIntensive] = useState(
    participationsTypes.find((p) => p.id === participationData.type)?.can_be_intensive
  );
  const [canHaveOrganizer, setCanHaveOrganizer] = useState(
    participationsTypes.find((p) => p.id === participationData.type)?.can_have_organizer
  );
  const [shouldSetImage, setShouldSetImage] = useState(
    participationsTypes.find((p) => p.id === participationData.type)?.should_set_image
  );

  const { t } = useTranslation();

  const onSubmitHandler = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    if (participationToEdit) {
      ParticipationService.updateParticipation(participationData, participationToEdit?.id).then(() => {
        updateMyParticipations();
        updateAllParticipations();
      });
    } else {
      ParticipationService.submitParticipation(participationData).then(() => {
        updateMyParticipations();
        updateAllParticipations();
      });
    }

    setOpen(false);
  };

  const onCancelHandler = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setOpen(false);
  };

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file = e.target?.files != undefined ? e.target.files[0] : undefined;
    const filePath = file != undefined ? URL.createObjectURL(file) : '';
    setfileUrl(filePath);

    setParticipationData({
      ...participationData,
      image: file,
    });
  };

  const onParticipationTypeChange = (e: SelectChangeEvent<number | string>) => {
    const val = e.target.value ? Number(e.target.value) : '';
    const choosenType = participationsTypes?.find((type) => type.id === val);
    const intensive = choosenType?.can_be_intensive ? participationData.isIntensive : false;
    const organizer = choosenType?.can_have_organizer ? participationData.isOrganizer : false;
    setCanBeIntensive(choosenType?.can_be_intensive ?? false);
    setCanHaveOrganizer(choosenType?.can_have_organizer ?? false);
    setShouldSetImage(choosenType?.should_set_image ?? false);
    setParticipationData({
      ...participationData,
      type: val,
      isIntensive: intensive,
      isOrganizer: organizer,
    });
  };

  return (
    <>
      <h1 className="mb-6">{!participationToEdit ? t('Participation.NewTitle') : t('Participation.EditTitle')}</h1>
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
          </label>
          {fileUrl ? <img src={fileUrl} style={{ height: 200 }} /> : ''}
        </div>
        <div className="mb-6 md:flex md:items-center">
          <FormControl className="w-full" variant="outlined" style={{ width: '100%' }}>
            <InputLabel id="activity-type-label">{t('Participation.ActivityType.Label')}</InputLabel>
            <Select
              className={'w-full'}
              labelId="activity-type-label"
              value={participationData.type}
              variant="outlined"
              label="Activity Type"
              onChange={onParticipationTypeChange}
              IconComponent={() => null}
            >
              {participationsTypes?.map((participationType) => (
                <MenuItem key={participationType.id} value={participationType.id}>
                  {participationType.name}
                </MenuItem>
              ))}
            </Select>
            <div style={{ position: 'absolute', top: '50%', right: 12, transform: 'translateY(-50%)' }}>
              <ClickAwayListener onClickAway={() => setShowActivityTypeTooltip(false)}>
                <Tooltip open={showActivityTypeTooltip} title={t('Participation.ActivityType.Tooltip')}>
                  <HelpIcon color="action" onClick={() => setShowActivityTypeTooltip(!showActivityTypeTooltip)} />
                </Tooltip>
              </ClickAwayListener>
            </div>
          </FormControl>
        </div>
        <div className="mb-6 md:flex md:items-center">
          <TextField
            required={true}
            className="mb-6 w-full"
            id="outlined-basic"
            label={t('Participation.ActivityDescription.Label')}
            variant="outlined"
            value={participationData.description}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setParticipationData({
                ...participationData,
                description: e.target.value,
              })
            }
          />
        </div>

        {canBeIntensive ? (
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
            <ClickAwayListener onClickAway={() => setIntensiveTooltipVisibility(false)}>
              <Tooltip
                PopperProps={{
                  disablePortal: true,
                }}
                onClose={() => setIntensiveTooltipVisibility(false)}
                open={intensiveTooltipVisibility}
                disableFocusListener
                disableHoverListener
                disableTouchListener
                title={t('Participation.HighIntensity.Tooltip')}
              >
                <HelpIcon color="action" onClick={() => setIntensiveTooltipVisibility(true)} />
              </Tooltip>
            </ClickAwayListener>
          </div>
        ) : (
          ''
        )}

        {canHaveOrganizer ? (
          <div className="mb-6">
            <FormControlLabel
              label={t('Participation.Organizer.Label')}
              control={
                <Checkbox
                  checked={participationData.isOrganizer}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setParticipationData({
                      ...participationData,
                      isOrganizer: e.target.checked,
                    })
                  }
                />
              }
            />
            <ClickAwayListener onClickAway={() => setOrganizerTooltipVisibility(false)}>
              <Tooltip
                PopperProps={{
                  disablePortal: true,
                }}
                onClose={() => setOrganizerTooltipVisibility(false)}
                open={organizerTooltipVisibility}
                disableFocusListener
                disableHoverListener
                disableTouchListener
                title={t('Participation.Organizer.Tooltip')}
              >
                <HelpIcon onClick={() => setOrganizerTooltipVisibility(true)} />
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
            disabled={
              (shouldSetImage && !(participationData.image || participationToEdit?.image)) ||
              participationData.description === '' ||
              participationData.type === ''
            }
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
