import { CustomReturn } from './CustomReturn';

export interface DropdownItem {
  key: string | undefined;
  value: string | undefined;
}
export default function CustomDropdown({
  title,
  name,
  id,
  className,
  value,
  itemsList,
  readonly,
  onChange,
}: {
  title: string;
  name?: string;
  id?: string;
  className?: string;
  value?: string;
  itemsList: DropdownItem[];
  readonly?: boolean | false;
  onChange?: (data: CustomReturn) => void;
}) {
  return (
    <div className='custom-input'>
      <label>{title}</label>
      <div className='select-container'>
        {readonly ? (
          <span>{itemsList.find((x) => x.key === value)?.value}</span>
        ) : (
          <select
            id={id}
            className={className}
            onChange={(e) => {
              onChange?.({
                elementName: name ?? '',
                value: (e.target.value === '' ? '0' : e.target.value) ?? '0',
              });
            }}>
            {itemsList?.map((item) => (
              <option
                key={item.key}
                value={item.key}
                selected={item.value === value}>
                {item.value}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
}
