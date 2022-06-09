import React from 'react';
import { CustomReturn } from './CustomReturn';
export default function CustomTextArea({
  title,
  name,
  id,
  className,
  value,
  readonly,
  onChange,
  lineCount,
}: {
  title: string;
  value?: string;
  name?: string;
  id?: string;
  className?: string;
  readonly?: boolean | false;
  lineCount?: number | undefined;
  onChange?: (data: CustomReturn) => void;
}) {
  return (
    <div className='custom-input no-height'>
      <label htmlFor={name}>{title}</label>
      <div className='input-container'>
        {readonly ? (
          <span>{value}</span>
        ) : (
          <>
            <textarea
              rows={lineCount}
              name={name}
              id={id}
              value={value}
              className={className}
              onChange={(e) =>
                onChange?.({ elementName: name ?? '', value: e.target.value })
              }
            />
          </>
        )}
      </div>
    </div>
  );
}
