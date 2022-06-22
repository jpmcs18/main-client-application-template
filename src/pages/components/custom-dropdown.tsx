import { CustomReturn } from './CustomReturn';

export interface DropdownItem {
  key: string;
  value: string;
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
              onChange?.({ elementName: name ?? '', value: e.target.value });
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
        {/* <button
          className='current-selection'
          value={currentValue?.value}
          id={id}>
          {currentValue?.value}
        </button>
        <FontAwesomeIcon
          className='current-selection-icon'
          icon={faChevronDown}
        />
        <div className='selection' id='selection'>
          {itemsList.map((item) => (
            <div
              key={item.key}
              className={
                (item.key === currentValue?.key ? 'active' : '') +
                ' selection-options'
              }
              onClick={() => {
                setCurrentValue(item);
                onChange?.({ name: name, value: item });
              }}>
              {item.value}
            </div>
          ))}
        </div> */}
      </div>
    </div>
  );
}
