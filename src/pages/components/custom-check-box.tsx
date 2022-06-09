import React from 'react';

export default function CustomCheckBox({
  isCheck,
  checkChange,
  id,
  text,
}: {
  checkChange: () => void;
  isCheck: boolean;
  id?: string;
  text?: string;
}) {
  return (
    <div className='check'>
      <label className='check-container'>
        <input
          type='checkbox'
          id={id ?? 'check'}
          onChange={checkChange}
          checked={isCheck}
        />
        <span className='checkmark'></span>
      </label>
      {text && (
        <label className='check-label' htmlFor={id ?? 'check'}>
          {text}
        </label>
      )}
    </div>
  );
}
