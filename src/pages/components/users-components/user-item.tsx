import { IconProp } from '@fortawesome/fontawesome-svg-core';
import {
  faPen,
  faTrash,
  faUserLock,
  faUserShield,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { User } from '../../../entities/user/User';
import { USERACTIONS } from '../../user-page';

export default function UserItem({
  user,
  action,
}: {
  user: User;
  action: (action: USERACTIONS) => void;
}) {
  return (
    <tr>
      <td>{user.name}</td>
      <td>{user.username}</td>
      <td>{user.admin ? 'Admin' : 'User'}</td>
      <td>{user.active ? 'Active' : 'Inactive'}</td>
      <td></td>
      <td className='table-actions'>
        <FontAwesomeIcon
          className='action-icon table-icon-button'
          icon={faUserLock as IconProp}
          onClick={() => {
            action({ type: 'Activate', id: user.id, active: user.active });
          }}
          title='Activate/Deactivate User'
        />
        <FontAwesomeIcon
          icon={faUserShield as IconProp}
          className='action-icon table-icon-button'
          onClick={() => {
            action({ type: 'ResetPassword', id: user.id });
          }}
          title='Reset Users Password'
        />
        <FontAwesomeIcon
          icon={faPen as IconProp}
          className='action-icon table-icon-button'
          onClick={() => {
            action({ type: 'Edit', user: user });
          }}
          title='Edit User'
        />
        <FontAwesomeIcon
          icon={faTrash as IconProp}
          className='action-icon table-icon-button'
          onClick={() => {
            action({ type: 'Delete', id: user.id });
          }}
          title='Delete User'
        />
      </td>
    </tr>
  );
}
