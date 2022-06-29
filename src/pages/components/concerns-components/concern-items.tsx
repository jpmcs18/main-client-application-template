import React, { useContext } from 'react';
import { ConcernActions, ConcernList } from '../../concern-page';
import ConcernItem from './concern-item';

export default function ConcernItems() {
  const action = useContext(ConcernActions);
  const concerns = useContext(ConcernList);
  return (
    <table className='item-table'>
      <thead>
        <tr>
          <th style={{ width: '8%' }}>Time Entry</th>
          <th style={{ width: '10%' }}>Ticket Number</th>
          <th>Description</th>
          <th style={{ width: '10%' }}>Classification</th>
          <th style={{ width: '20%' }}>Concern Office</th>
          <th style={{ width: '15%' }}>Caller</th>
          <th style={{ width: '8%' }}>Status</th>
        </tr>
        <tr>
          <th colSpan={10}>
            <button
              className='btn'
              onClick={() => {
                action({ action: 'Add' });
              }}>
              Add New Concern
            </button>
          </th>
        </tr>
      </thead>
      <tbody>
        {concerns.map((concern) => (
          <ConcernItem key={concern.id} concern={concern} />
        ))}
      </tbody>
    </table>
  );
}
