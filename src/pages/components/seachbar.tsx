import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';

export default function SeachBar({
  search,
}: {
  search: (key: string) => void;
}) {
  const [searchKey, setSearchKey] = useState<string>('');

  function onKeyPress(key: React.KeyboardEvent<HTMLDivElement>) {
    if (key.key === 'Enter') {
      search(searchKey);
    }
  }

  function searchKeyChange(val: {
    target: { value: React.SetStateAction<string> };
  }) {
    setSearchKey(val.target.value);
  }

  function searchClick() {
    search(searchKey);
  }
  return (
    <div className='search-container'>
      <input
        type='text'
        className='name'
        placeholder='Search...'
        value={searchKey}
        onChange={searchKeyChange}
        onKeyPress={onKeyPress}
      />
      <FontAwesomeIcon
        className='search-icon'
        icon={faSearch as IconProp}
        onClick={searchClick}
      />
    </div>
  );
}
