import React from 'react';
import { Concern } from '../../../entities/transaction/Concern';

export default function ConcernItem({ concern }: { concern: Concern }) {
  console.log(concern);
  return (
    <tr>
      <td>
        {concern.entryDate && new Date(concern.entryDate).toLocaleString()}
      </td>
      <td>{concern.description}</td>
      <td>{concern.classification?.description}</td>
      <td>{concern.office?.description}</td>
      <td>{concern.caller}</td>
      <td>
        {concern.closedDate && new Date(concern.closedDate).toLocaleString()}
      </td>
    </tr>
  );
}
