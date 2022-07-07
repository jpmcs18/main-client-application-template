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
  const text: string | undefined =
    value === undefined
      ? undefined
      : `${value.getFullYear()}-${(value.getMonth() + 1)
          .toString()
          .padStart(2, '0')}-${value
          .getDate()
          .toString()
          .padStart(2, '0')}T${value
          .getHours()
          .toString()
          .padStart(2, '0')}:${value.getMinutes().toString().padStart(2, '0')}`;
  return (
    <div className='custom-input'>
      <label htmlFor={name}>{title}</label>
      <div className='datepicker-container'>
        {readonly ? (
          <span>{value?.toLocaleDateString()}</span>
        ) : (
          <>
            <input
              type='datetime-local'
              className='custom-datepicker'
              value={text}
              onChange={(e) => {
                onChange?.({
                  elementName: name ?? '',
                  value:
                    (e.target.value ?? '') === ''
                      ? undefined
                      : new Date(e.target.value),
                });
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}
