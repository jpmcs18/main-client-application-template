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
      <td>{user.personnel?.name}</td>
      <td>{user.personnel?.office?.description}</td>
      <td>
        {user.personnel?.personnelClassification
          ?.map((x) => x.classification?.description)
          .join(' | ')}
      </td>
      <td>{user.username}</td>
      <td className='elipsis'>
        {user.admin ? 'Admin' : 'User'}
        {(user.userRoles?.length ?? 0) > 0 && ' | '}
        {user.userRoles?.map((x) => x.role?.description).join(' | ')}
      </td>
      <td align='center'>
        <div>{user.active ? 'Active' : 'Inactive'}</div>
        <div>{user.isAvailable ? 'Available' : 'Unavailable'}</div>
      </td>
      <td className='table-actions'>
        <button
          className='btn'
          onClick={() =>
            action({ type: 'Activate', id: user.id, active: user.active })
          }>
          Activate/Deactivate
        </button>
        <button
          className='btn'
          onClick={() => action({ type: 'ResetPassword', id: user.id })}>
          Reset Password
        </button>
        <button
          className='btn'
          onClick={() => action({ type: 'Edit', user: user })}>
          Edit
        </button>
        <button
          className='btn'
          onClick={() => action({ type: 'Delete', id: user.id })}>
          Delete
        </button>
      </td>
    </tr>
  );
}
