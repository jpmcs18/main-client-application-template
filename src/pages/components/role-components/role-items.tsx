import React, { useContext } from 'react';
import { RoleActions, RoleList } from '../../role-page';
import RoleItem from './role-item';

export default function RoleItems() {
  const action = useContext(RoleActions);
  const concerns = useContext(RoleList);
  return (
    <table className='item-table'>
      <thead>
        <tr>
          <th>Description</th>
        </tr>
        <tr>
          <th colSpan={10}>
            <button
              className='btn'
              onClick={() => {
                action({ action: 'Add' });
              }}>
              Add New Role
            </button>
          </th>
        </tr>
      </thead>
      <tbody>
        {concerns.map((concern) => (
          <RoleItem key={concern.id} role={concern} />
        ))}
      </tbody>
    </table>
  );
}
