import React from 'react';
import { PersonnelConcernStatus } from '../../../constant';
import { PersonnelConcern } from '../../../entities/transaction/PersonnelConcern';
import { dateToString } from '../../../helpers';

export default function ConcernMonitoringDetail({
  concern,
}: {
  concern: PersonnelConcern;
}) {
  return (
    <div className='concern-action'>
      <div>Received Date & Time</div>
      <div>{concern.receivedDate && dateToString(concern.receivedDate)}</div>
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
          <span> ({dateToString(concern.closedDate)})</span>
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
