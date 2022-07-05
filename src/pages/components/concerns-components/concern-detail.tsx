import React from 'react';
import { PersonnelConcernStatus } from '../../../constant';
import { PersonnelConcern } from '../../../entities/transaction/PersonnelConcern';

export default function ConcernDetail({
  concern,
}: {
  concern: PersonnelConcern;
}) {
  return (
    <div className='concern-action'>
      <div>Received Date & Time</div>
      <div>
        {concern.receivedDate &&
          new Date(concern.receivedDate).toLocaleString()}
      </div>
      <div>Concern</div>
      <div>{concern.concern.description}</div>
      {concern.prevPersonnelConcernId && (
        <>
          <div>Forwarded By</div>
          <div>{concern.prevPersonnelConcern?.personnel?.name}</div>
          <div>Forwarded Reason</div>
          <div>{concern.prevPersonnelConcern?.action}</div>
        </>
      )}
      <div>Status</div>
      <div>
        {concern.status}
        {concern.closedDate && (
          <span> ({new Date(concern.closedDate).toLocaleString()})</span>
        )}
      </div>
      {concern.statusId !== PersonnelConcernStatus.Pending && (
        <>
          <div>
            {concern.statusId === PersonnelConcernStatus.Forwarded
              ? 'Reason'
              : 'Action Taken'}
            :
          </div>
          <div>{concern.action}</div>
        </>
      )}
    </div>
  );
}
