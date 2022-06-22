import React, { useContext } from 'react';
import { Role } from '../../../entities/user/Role';
import { RoleActions } from '../../role-page';

export default function RoleItem({ role }: { role: Role }) {
  const action = useContext(RoleActions);
  return (
    <tr>
      <td>{role.description}</td>
      <td className='table-actions'>
        <button
          className='btn'
          onClick={() => action({ action: 'View', payload: role })}>
          View
        </button>

        <button
          className='btn'
          onClick={() => action({ action: 'Edit', payload: role })}>
          Edit
        </button>
        <button
          className='btn'
          onClick={() => action({ action: 'Delete', payload: role.id })}>
          Delete
        </button>
      </td>
    </tr>
  );
}
