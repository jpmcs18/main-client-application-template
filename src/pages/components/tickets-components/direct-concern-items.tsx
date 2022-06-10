import React, { useContext } from 'react';
import { DirectConcernList } from '../../ticket-page';
import DirectConcernItem from './direct-concern-item';

export default function DirectConcernItems() {
  const concerns = useContext(DirectConcernList);
  return (
    <table className='item-table'>
      <thead>
        <tr>
          <th>Received Date</th>
          <th>Description</th>
          <th>Classification</th>
          <th>Concern Office</th>
          <th>Caller</th>
          <th>Status</th>
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
