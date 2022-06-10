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
      <div className='personnel'>
        <span>
          {action.forwardPersonnelConcernId ? 'Forwarded' : 'Assigned'}
        </span>
        &nbsp;
        <span>to {action.personnel?.name}</span>
      </div>
      <div>
        <div>
          <span>Status: </span>
          <span>{action.status}</span>
        </div>
        {action.statusId !== PersonnelConcernStatus.Pending && (
          <div>
            <span>Action Taken: </span>
            <span>{action.action}</span>
          </div>
        )}
      </div>
    </div>
  );
}
