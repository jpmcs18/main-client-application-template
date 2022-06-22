import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { CustomReturn } from './CustomReturn';
export default function CustomTextBox({
  title,
  name,
  type,
  id,
  className,
  value,
  readonly,
  onChange,
  onKeyPress,
}: {
  title: string;
  value?: string;
  name?: string;
  type?: string;
  id?: string;
  className?: string;
  readonly?: boolean | false;
  onChange?: (data: CustomReturn) => void;
  onKeyPress?: (key: React.KeyboardEvent<HTMLDivElement>) => void;
}) {
  const [toggle, setToggle] = useState(true);
  return (
    <div className='custom-input '>
      <label htmlFor={name}>{title}</label>
      <div className='input-container'>
        {readonly ? (
          <span>{value}</span>
        ) : (
          <>
            <input
              type={
                type === 'password'
                  ? toggle
                    ? 'password'
                    : 'text'
                  : type ?? 'text'
              }
              name={name}
              id={id}
              value={value}
              className={className}
              onChange={(e) =>
                onChange?.({ elementName: name ?? '', value: e.target.value })
              }
              onKeyPress={onKeyPress}
            />
            {type === 'password' && (
              <div className='eye-container'>
                <FontAwesomeIcon
                  icon={(toggle ? faEye : faEyeSlash) as IconProp}
                  className='eye-icon'
                  onClick={() => {
                    setToggle((prev) => !prev);
                  }}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
