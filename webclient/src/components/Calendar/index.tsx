import { useMemo } from 'react';
import moment, { Moment } from 'moment';
import { Badge, styled } from '@mui/material';
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
    backgroundColor: '#708ef4',
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
      <PickersDay {...other} disableRipple day={day} />
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
    <div className="MuiCustomCalendarContainer mx-4 mb-5 max-h-[306px] min-h-min max-w-full overflow-clip rounded-md bg-white shadow-md sm:mx-0 sm:max-w-[350px]">
      <DateCalendar
        reduceAnimations
        defaultCalendarMonth={moment()}
        disableFuture
        showDaysOutsideCurrentMonth
        readOnly
        minDate={moment(start_date)}
        views={['day']}
        slots={{
          day: (dayProps) => <CustomDay {...dayProps} highlightedDates={allHighlightedDates} />,
        }}
      />
    </div>
  );
}
