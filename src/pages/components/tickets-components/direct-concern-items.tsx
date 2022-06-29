import React, { useContext } from 'react';
import { DirectConcernList } from '../../ticket-page';
import DirectConcernItem from './direct-concern-item';

export default function DirectConcernItems() {
  const concerns = useContext(DirectConcernList);
  return (
    <table className='item-table'>
      <thead>
        <tr>
          <th style={{ width: '8%' }}>Received Date</th>
          <th style={{ width: '10%' }}>Ticket Number</th>
          <th>Description</th>
          <th style={{ width: '10%' }}>Classification</th>
          <th style={{ width: '20%' }}>Concern Office</th>
          <th style={{ width: '15%' }}>Caller</th>
          <th style={{ width: '8%' }}>Status</th>
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
