import { useContext } from 'react';
import { PersonnelConcernStatus } from '../../../constant';
import { PersonnelConcern } from '../../../entities/transaction/PersonnelConcern';
import { dateToString } from '../../../helpers';
import { DirectConcernActions } from '../../ticket-page';

export default function DirectConcernItem({
  concern,
}: {
  concern: PersonnelConcern;
}) {
  const action = useContext(DirectConcernActions);
  return (
    <tr
      title={
        concern?.action
          ? (concern?.statusId ?? 0) === PersonnelConcernStatus.Resolved
            ? `Action Taken: ${concern.action}`
            : `Reason: ${concern.action}`
          : undefined
      }>
      <td>{dateToString(concern.receivedDate)}</td>
      <td>{concern.concern.number}</td>
      <td>
        <div>{concern.concern.description}</div>
        {concern.prevPersonnelConcernId && (
          <div>
            <span>Forward Reason: </span>
            {concern.prevPersonnelConcern?.action}
          </div>
        )}
      </td>
      <td>{concern.concern.classification?.description}</td>
      <td>{concern.concern.office?.description}</td>
      <td>{concern.concern.caller}</td>
      <td>
        <div>{concern.status}</div>
        <div>
          {concern.closedDate && (
            <span> ({dateToString(concern.closedDate)})</span>
          )}
        </div>
      </td>
      <td className='table-actions'>
        {concern.statusId === PersonnelConcernStatus.Pending && (
          <>
            <button
              className='btn'
              onClick={() => {
                action({ action: 'Resolve', payload: concern });
              }}>
              Resolve
            </button>
            <button
              className='btn'
              onClick={() => {
                action({ action: 'Forward', payload: concern });
              }}>
              Forward
            </button>
          </>
        )}
      </td>
    </tr>
  );
}
