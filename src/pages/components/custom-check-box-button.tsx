import React from 'react';
import { CustomReturn } from './CustomReturn';

export default function CustomCheckBoxButton({
  title,
  name,
  id,
  className,
  isCheck,
  onChange,
}: {
  title: string;
  name?: string;
  id?: string;
  className?: string;
  isCheck: boolean;
  onChange?: (data: CustomReturn) => void;
}) {
  return (
    <div className={'custom-input ' + className}>
      <button
        className={'checkbox' + (isCheck ? ' checked' : '')}
        value={isCheck ? 'true' : 'false'}
        id={id}
        onClick={() => {
          onChange?.({ elementName: name ?? '', value: !isCheck });
        }}>
        {title}
      </button>
    </div>
  );
}
