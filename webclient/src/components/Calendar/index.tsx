import { useMemo } from 'react';
import moment, { Moment } from 'moment';
import { Badge, styled } from '@mui/material';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { useContestParticipations } from '@/hooks/useContestParticipations';
import { CircularProgress } from '@mui/material';
import { DATE_FORMAT } from '@/constants/formats';

interface CustomDayProps extends PickersDayProps<Moment> {
  highlightedDates?: string[];
}

const StyledBadge = styled(Badge)(() => ({
  '.MuiBadge-dot': {
    backgroundColor: '#b11b24',
    transform: 'scale(1) translate(-200%, 300%)',
  },
}));

function CustomDay({ highlightedDates = [], day, ...other }: CustomDayProps) {
  const dateString = day.format(DATE_FORMAT);
  const isHighlighted = highlightedDates.includes(dateString);

  return (
    <StyledBadge
      key={dateString}
      overlap="rectangular"
      badgeContent=" "
      variant="dot"
      invisible={!isHighlighted}
      color="primary"
    >
      <PickersDay {...other} day={day} />
    </StyledBadge>
  );
}

export default function Calender() {
  const { isLoading, contestParticipations, start_date } = useContestParticipations();

  const allHighlightedDates = useMemo(() => {
    return contestParticipations
      ? [...new Set(contestParticipations)].filter((p) => p?.participation).map((p) => p.contestDate)
      : [];
  }, [contestParticipations]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="mx-4 mb-6 max-w-full rounded-md bg-white shadow-md sm:mx-0 sm:max-w-[350px]">
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <DateCalendar
          reduceAnimations
          defaultCalendarMonth={moment()}
          disableFuture
          readOnly
          minDate={moment(start_date)}
          slots={{
            day: (dayProps) => <CustomDay {...dayProps} highlightedDates={allHighlightedDates} />,
          }}
        />
      </LocalizationProvider>
    </div>
  );
}
