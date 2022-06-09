import React from 'react';
import { useAddConcern, useConcerns } from '../../concern-page';
import ConcernItem from './concern-item';

export default function Concerns() {
  const concerns = useConcerns();
  const addConcern = useAddConcern();
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
        <tr>
          <th colSpan={10}>
            <button className='btn' onClick={addConcern}>
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
