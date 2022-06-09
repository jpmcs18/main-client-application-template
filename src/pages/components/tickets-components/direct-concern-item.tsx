import React, { useContext } from 'react';
import { Concern } from '../../../entities/transaction/Concern';
import { DirectConcernActions } from '../../ticket-page';

export default function DirectConcernItem({ concern }: { concern: Concern }) {
  const action = useContext(DirectConcernActions);
  return (
    <tr>
      <td>
        {concern.entryDate && new Date(concern.entryDate).toLocaleString()}
      </td>
      <td className='elipsis'>{concern.description}</td>
      <td>{concern.classification?.description}</td>
      <td>{concern.office?.description}</td>
      <td>{concern.caller}</td>
      <td>
        {concern.closedDate && new Date(concern.closedDate).toLocaleString()}
      </td>
      <td className='table-actions'>
        <button className='btn'>View Actions</button>
        <button className='btn'>Forward To Concerned Personnel</button>
        <button
          className='btn'
          onClick={() => action({ action: 'Edit', payload: concern })}>
          Edit
        </button>
        <button
          className='btn'
          onClick={() => action({ action: 'Edit', payload: concern })}>
          Delete
        </button>
      </td>
    </tr>
  );
}
