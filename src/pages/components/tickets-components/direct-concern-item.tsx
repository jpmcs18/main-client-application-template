import React, { useContext } from 'react';
import { PersonnelConcernStatus } from '../../../constant';
import { Concern } from '../../../entities/transaction/Concern';
import { PersonnelConcern } from '../../../entities/transaction/PersonnelConcern';
import { DirectConcernActions } from '../../ticket-page';

export default function DirectConcernItem({
  concern,
}: {
  concern: PersonnelConcern;
}) {
  const action = useContext(DirectConcernActions);
  return (
    <tr>
      <td>
        {concern.receivedDate &&
          new Date(concern.receivedDate).toLocaleString()}
      </td>
      <td className='elipsis'>{concern.concern.description}</td>
      <td>{concern.concern.classification?.description}</td>
      <td>{concern.concern.office?.description}</td>
      <td>{concern.concern.caller}</td>
      <td>{concern.status} </td>
      <td className='table-actions'>
        {concern.statusId === PersonnelConcernStatus.Pending && (
          <>
            <button className='btn'>Resolve</button>
            <button className='btn'>Forward</button>
          </>
        )}
      </td>
    </tr>
  );
}
