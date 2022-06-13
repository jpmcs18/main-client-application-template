import { useContext } from 'react';
import { PersonnelConcernStatus } from '../../../constant';
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
      <td>
        <div className='elipsis'>{concern.concern.description}</div>
        {concern.prevPersonnelConcernId && (
          <div className='elipsis'>
            <span>Forward Reason: </span>
            {concern.prevPersonnelConcern?.action}
          </div>
        )}
      </td>
      <td>{concern.concern.classification?.description}</td>
      <td>{concern.concern.office?.description}</td>
      <td>{concern.concern.caller}</td>
      <td>
        {concern.status}
        {concern.statusId !== PersonnelConcernStatus.Pending && (
          <div className='elipsis'>{concern?.action}</div>
        )}
      </td>
      <td className='table-actions'>
        {concern.statusId === PersonnelConcernStatus.Pending && (
          <>
            <button
              className='btn'
              onClick={() => {
                console.log('resolve');
                action({ action: 'Resolve', payload: concern });
              }}>
              Resolve
            </button>
            <button className='btn'>Forward</button>
          </>
        )}
      </td>
    </tr>
  );
}
