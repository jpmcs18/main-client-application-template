import React from 'react';
import { PersonnelConcernStatus } from '../../../constant';
import { PersonnelConcern } from '../../../entities/transaction/PersonnelConcern';
import { dateToString } from '../../../helpers';

export default function ConcernMonitoringAction({
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
          ({action.receivedDate && dateToString(action.receivedDate)})
        </span>
        <span>
          {action.prevPersonnelConcernId ? '' : ` By ${action.creator}`}
        </span>
      </div>
      <div>{action.personnel?.name}</div>
      <div>Status</div>
      <div>
        {action.status}
        {action.closedDate && <span> ({dateToString(action.closedDate)})</span>}
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
