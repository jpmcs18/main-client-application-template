import React from 'react';
import { PersonnelConcernStatus } from '../../../constant';
import { PersonnelConcern } from '../../../entities/transaction/PersonnelConcern';

export default function ConcernAction({
  action,
}: {
  action: PersonnelConcern;
}) {
  return (
    <div className='concern-action'>
      <div>
        <span>
          {action.prevPersonnelConcernId ? 'Forwarded' : 'Assigned'} to
        </span>
        &nbsp;
        <span>
          (
          {action.receivedDate &&
            new Date(action.receivedDate).toLocaleString()}
          )
        </span>
      </div>
      <div>{action.personnel?.name}</div>
      <div>Status</div>
      <div>
        {action.status}
        {action.closedDate && (
          <span> ({new Date(action.closedDate).toLocaleString()})</span>
        )}
        {action.forwardDate && (
          <span> ({new Date(action.forwardDate).toLocaleString()})</span>
        )}
      </div>
      {action.statusId !== PersonnelConcernStatus.Pending && (
        <>
          <div>
            {action.statusId === PersonnelConcernStatus.Forwarded
              ? 'Reason'
              : 'Action Taken'}
            :
          </div>
          <div>{action.action}</div>
        </>
      )}
    </div>
  );
}
