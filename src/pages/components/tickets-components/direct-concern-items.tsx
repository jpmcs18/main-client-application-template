import React, { useContext } from 'react';
import { DirectConcernList } from '../../ticket-page';
import DirectConcernItem from './direct-concern-item';

export default function DirectConcernItems() {
  const concerns = useContext(DirectConcernList);
  return (
    <table className='item-table'>
      <thead>
        <tr>
          <th>Time Entry</th>
          <th>Description</th>
          <th>Classification</th>
          <th>Concern Office</th>
          <th>Caller</th>
          <th>Time Closed</th>
        </tr>
      </thead>
      <tbody>
        {concerns.map((concern) => (
          <DirectConcernItem key={concern.id} concern={concern} />
        ))}
      </tbody>
    </table>
  );
}
