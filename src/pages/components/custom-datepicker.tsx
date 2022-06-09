import DateTimePicker from 'react-datetime-picker';
import 'react-day-picker/lib/style.css';
import { CustomReturn } from './CustomReturn';

export default function CustomDatePicker({
  title,
  name,
  id,
  className,
  value,
  readonly,
  onChange,
}: {
  title: string;
  value?: Date;
  name?: string;
  id?: string;
  className?: string;
  readonly?: boolean | false;
  onChange?: (data: CustomReturn) => void;
}) {
  function onDayChange(day: Date) {
    onChange?.({ elementName: name ?? '', value: day });
  }
  return (
    <div className='custom-input'>
      <label htmlFor={name}>{title}</label>
      <div className='datepicker-container'>
        {readonly ? (
          <span>{value?.toLocaleDateString()}</span>
        ) : (
          <>
            <DateTimePicker
              className={'custom-datepicker ' + className}
              onChange={onDayChange}
              value={value}
              disableCalendar={true}
              format='MM/dd/yyyy'
              disableClock={true}
            />
          </>
        )}
      </div>
    </div>
  );
}
