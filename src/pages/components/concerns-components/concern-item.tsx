import React, { useContext } from 'react';
import { ConcernStatus } from '../../../constant';
import { Concern } from '../../../entities/transaction/Concern';
import { dateToString } from '../../../helpers';
import { ConcernActions } from '../../concern-page';

export default function ConcernItem({ concern }: { concern: Concern }) {
  const action = useContext(ConcernActions);
  return (
    <tr>
      <td>{concern.entryDate && dateToString(concern.entryDate)}</td>
      <td>{concern.number}</td>
      <td>{concern.description}</td>
      <td>{concern.classification?.description}</td>
      <td>{concern.caller}</td>
      <td>
        <div>{concern.status}</div>
        <div>{concern.closedDate && dateToString(concern.closedDate)}</div>
      </td>
      <td className='table-actions'>
        {concern.statusId !== ConcernStatus.Open && (
          <button
            className='btn'
            onClick={() => action({ action: 'ViewAction', payload: concern })}>
            View Actions
          </button>
        )}
        {concern.statusId === ConcernStatus.Open && (
          <>
            <button
              className='btn'
              onClick={() => action({ action: 'Assign', payload: concern })}>
              Assign To Concerned Personnel
            </button>

            <button
              className='btn'
              onClick={() => action({ action: 'Edit', payload: concern })}>
              Edit
            </button>
            <button
              className='btn'
              onClick={() => action({ action: 'Delete', payload: concern.id })}>
              Delete
            </button>
          </>
        )}
      </td>
    </tr>
  );
}
