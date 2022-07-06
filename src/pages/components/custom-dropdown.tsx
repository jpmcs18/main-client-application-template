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
  hasDefault,
}: {
  title: string;
  name?: string;
  id?: string;
  className?: string;
  value?: any;
  itemsList: DropdownItem[];
  readonly?: boolean | false;
  onChange?: (data: CustomReturn) => void;
  hasDefault?: boolean | undefined;
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
            value={value ?? ''}
            onChange={(e) => {
              onChange?.({
                elementName: name ?? 'def',
                value: e.target.value,
                text: e.target.selectedOptions?.[0]?.text,
              });
            }}>
            {hasDefault && <option value={undefined}></option>}
            {itemsList?.map((item) => (
              <option key={item.key} value={item.key}>
                {item.value}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
}
