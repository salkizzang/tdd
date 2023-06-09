import React from 'react';
import Calendar from 'react-calendar';

type CalendarComponentProps = {
  selectedDate: Date | null;
  onDateChange: any;
};
type CalendarTile = {
  date: Date;
  view: string;
};

const CalendarComponent: React.FC<CalendarComponentProps> = ({
  selectedDate,
  onDateChange,
}) => {
  const tileClass = ({ date, view }: CalendarTile) => {
    if (
      view === 'month' &&
      date.toDateString() === (selectedDate?.toDateString() ?? '')
    ) {
      return 'highlight';
    }
    return null;
  };

  return (
    <div data-testid='calendar-component'>
      <Calendar
        onChange={onDateChange}
        value={selectedDate}
        tileClassName={tileClass}
      />
    </div>
  );
};

export default CalendarComponent;
