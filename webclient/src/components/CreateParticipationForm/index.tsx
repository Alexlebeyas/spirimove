import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { ICreateParticipationForm } from '@/interfaces/ICreateParticipationForm';
import moment from 'moment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import HelpIcon from '@mui/icons-material/Help';
import ParticipationService from '@/services/ParticipationService';
import { DATE_FORMAT, DISPLAY_DATE_FORMAT } from '@/constants/formats';
import { useTranslation } from 'react-i18next';
import Button from '@mui/material/Button';
import {
  Checkbox,
  ClickAwayListener,
  FormControl,
  FormControlLabel,
  FormHelperText,
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

interface FieldErrors {
  description: string;
  image: string;
  type: string;
  date: string;
}

const FACILITATOR_KEY = 2;

const helpTextProps = {
  color: '#E0303B',
  fontWeight: '700',
}

const CreateParticipationForm: React.FC<Props> = ({ contestId, startDate, endDate, setOpen, participationToEdit }) => {
  const { participationsTypes, getParticipationsTypes } = fetchParticipationsType((state) => state);
  
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
  const [showActivityTypeTooltip, setShowActivityTypeTooltip] = useState(false);

  const [fileUrl, setfileUrl] = useState(participationToEdit?.image ?? '');
  const [typeError, setTypeError] = useState<FieldErrors | undefined>(undefined);

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

  const validateForm = (): FieldErrors | undefined => {
    const errors: Partial<FieldErrors> = {};

    if (participationData.date) {
      
      const start_date = new Date(startDate);
      const end_date = new Date(endDate);
      const newDate = new Date(participationData.date);
      start_date.setHours(0, 0, 0, 0);
      end_date.setHours(0, 0, 0, 0);
      newDate.setHours(0, 0, 0, 0);

      if (newDate < start_date || newDate > end_date) {
        errors.date = t('Participation.ActivityDateOutOfRangeError');
      }
    } 

    if (!participationData.description) {
      errors.description = t('Participation.Required');
    }

    if (shouldSetImage && !participationData.image) {
      errors.image = t('Participation.Required');
    }

    if (!participationData.type) {
      errors.type = t('Participation.Required');
    }

    return Object.keys(errors).length > 0 ? (errors as FieldErrors) : undefined;
  };

  const onSubmitHandler = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (formErrors) {
      setTypeError(formErrors);
      return;
    }
    setTypeError(undefined);
    if (participationToEdit) {
      ParticipationService.updateParticipation(participationData, participationToEdit?.id)
        .then(() => {
          updateMyParticipations();
          updateAllParticipations();
          setOpen(false);
        })
        .catch(function (error) {
          setTypeError(error);
        });
    } else {
      ParticipationService.submitParticipation(participationData)
        .then(() => {
          updateMyParticipations();
          updateAllParticipations();
          setOpen(false);
        })
        .catch(function (error) {
          const errorObject = {...error};
          if(error?.date){
            errorObject.date = t('Participation.ActivityDuplicateDateError');
          }
          if(error?.type){
            errorObject.type = t('Participation.ActivityDuplicateTypeError');
          }
          setTypeError(errorObject);
        });
    }
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

  useEffect(() => {
    getParticipationsTypes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-2 my-4">
      <h1 className="mb-8 text-3xl font-bold text-darkblue-800">
        {!participationToEdit ? t('Participation.NewTitle') : t('Participation.EditTitle')}
      </h1>
      <div>
        <form>
          <div className="mb-6">
            <div data-te-datepicker-init data-te-inline="true" data-te-input-wrapper-init>
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <DatePicker
                  className="w-full sm:w-1/2"
                  label={t('Participation.ActivityDate')}
                  format={DISPLAY_DATE_FORMAT}
                  value={moment(participationData.date)}
                  minDate={moment(startDate, DATE_FORMAT)}
                  maxDate={moment(endDate, DATE_FORMAT)}
                  slotProps={{
                    textField: () => {
                      const showError = typeError?.type || typeError?.date;
                      return ({
                        color: showError ? 'error' : 'primary',
                        focused: showError ? true : false,
                      })
                    },
                  }}
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
              <FormHelperText sx={helpTextProps}>{typeError?.date}</FormHelperText>
            </div>
          </div>

          {shouldSetImage && (
            <div className="mb-6">
              <FormControl className="w-full" variant="outlined" error={!!typeError?.image}>
                <input
                  accept="image/*"
                  hidden
                  id="raised-button-file"
                  type="file"
                  onChange={handleImageFile}
                  style={{ display: 'none' }}
                  required={shouldSetImage}
                />
                <label htmlFor="raised-button-file">
                  <Button
                    className="w-full"
                    variant="outlined"
                    size="large"
                    component="span"
                    onChange={handleImageFile}
                  >
                    {t('Participation.SelectImage')}
                  </Button>
                </label>
                <div className="flex justify-center items-center">
                  {fileUrl ? <img src={fileUrl} className="max-w-full max-h-88" /> : ''}
                </div>
                <FormHelperText sx={helpTextProps}>{typeError?.image}</FormHelperText>
              </FormControl>
            </div>
          )}
          <div className="mb-6 md:flex md:items-center">
            <div className="flex w-full flex-nowrap">
              <div className="flex-grow">
                <FormControl className="w-full" error={!!typeError?.type}>
                  <InputLabel id="activity-type-label">{t('Participation.ActivityType.Label')}</InputLabel>
                  <Select
                    className={'w-full'}
                    labelId="activity-type-label"
                    value={participationData.type}
                    label={t('Participation.ActivityType.Label')}
                    onChange={onParticipationTypeChange}
                    required={true}
                  >
                    {participationsTypes?.map((participationType) => (
                      <MenuItem key={participationType.id} value={participationType.id}>
                        {participationType.name}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText sx={helpTextProps}>
                    {typeError?.type}
                  </FormHelperText>
                </FormControl>
              </div>
              <div className="ml-3 flex items-center justify-center flex-basis[10%]">
                <ClickAwayListener onClickAway={() => setShowActivityTypeTooltip(false)}>
                  <Tooltip
                    open={showActivityTypeTooltip}
                    title={t('Participation.ActivityType.Tooltip')}
                    placement="top-end"
                    arrow
                  >
                    <HelpIcon
                      sx={{ color: '#2F3940', '&:hover': { color: '#708EF4' } }}
                      onClick={() => setShowActivityTypeTooltip(!showActivityTypeTooltip)}
                    />
                  </Tooltip>
                </ClickAwayListener>
              </div>
            </div>
          </div>
          <div className="mb-6 md:flex md:items-center">
            <FormControl
              className="w-full"
              variant="outlined"
              error={!!typeError?.description}
            >
              <TextField
                required={true}
                className="mb-6 w-full"
                id="outlined-basic"
                label="Activity Description"
                variant="outlined"
                error={!!typeError?.description}
                value={participationData.description}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setParticipationData({
                    ...participationData,
                    description: e.target.value,
                  })
                }
              />
              <FormHelperText sx={helpTextProps}>{typeError?.description}</FormHelperText>
            </FormControl>
          </div>

          {canBeIntensive ? (
            <div className="mb-6">
              <FormControlLabel
                label={t('Participation.HighIntensity.Label')}
                className=" text-darkblue-800"
                control={
                  <Checkbox
                    checked={participationData.isIntensive}
                    sx={{
                      color: '#2F3940',
                      '&.Mui-checked': {
                        color: '#708EF4',
                      },
                    }}
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
                  placement="top"
                  arrow
                >
                  <HelpIcon
                    sx={{ color: '#2F3940', '&:hover': { color: '#708EF4' } }}
                    onClick={() => setIntensiveTooltipVisibility(true)}
                  />
                </Tooltip>
              </ClickAwayListener>
            </div>
          ) : (
            ''
          )}

          {canHaveOrganizer ? (
            <div className="mb-6">
              <FormControlLabel
                label={
                  participationData?.type === FACILITATOR_KEY
                    ? t('Participation.Facilitator.Label')
                    : t('Participation.Initiator.Label')
                }
                control={
                  <Checkbox
                    checked={participationData.isOrganizer}
                    sx={{
                      color: '#2F3940',
                      '&.Mui-checked': {
                        color: '#708EF4',
                      },
                    }}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setParticipationData({
                        ...participationData,
                        isOrganizer: e.target.checked,
                      })
                    }
                  />
                }
              />
            </div>
          ) : (
            ''
          )}
          <div className="flex flex-col md:flex-row md:justify-end md:space-x-4">
            <div className="mb-6 md:mb-0 md:flex ">
              <Button
                className="w-full md:w-32"
                variant="outlined"
                size="large"
                component="label"
                onClick={onCancelHandler}
              >
                {t('Button.Cancel')}
              </Button>
            </div>
            <div className="mb-6 md:mb-0 md:flex">
              <Button
                className="w-full md:w-32"
                variant="contained"
                size="large"
                component="label"
                onClick={onSubmitHandler}
              >
                {t('Button.Submit')}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateParticipationForm;
