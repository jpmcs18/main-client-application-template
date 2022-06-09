import { useState } from 'react';
import {
  useSetBusy,
  useSetMessage,
} from '../../custom-hooks/authorize-provider';
import { User } from '../../entities/user/User';
import { createUser, updateUser } from '../../processors/user-process';
import CustomCheckBoxButton from '../components/custom-check-box-button';
import CustomTextBox from '../components/custom-textbox';
import { CustomReturn } from '../components/CustomReturn';
import Modal from './modal';

export default function ManageUser({
  usersInfo,
  onClose,
}: {
  usersInfo: User | undefined;
  onClose: (needToReLoad: boolean) => void;
}) {
  const [user, setUser] = useState<User>(
    () =>
      usersInfo ?? {
        id: 0,
        username: '',
        name: '',
        active: false,
        admin: false,
        jtcAccess: false,
        partidoAccess: false,
      }
  );
  const setBusy = useSetBusy();
  const setMessage = useSetMessage();
  async function saveData() {
    setBusy(true);
    if (user.id === 0) {
      await createUser(user)
        .then(() => {
          setMessage({
            message: 'New User Added',
            onOk: () => {
              onClose(true);
            },
          });
        })
        .catch((err) => {
          setMessage({ message: err.message });
        })
        .finally(() => setBusy(false));
    } else {
      await updateUser(user)
        .then(() => {
          setMessage({
            message: 'User Updated',
            onOk: () => {
              onClose(true);
            },
          });
        })
        .catch((err) => {
          setMessage({ message: err.message });
        })
        .finally(() => setBusy(false));
    }
  }

  function onChange({ elementName, value }: CustomReturn) {
    setUser((prevUser) => {
      if (prevUser === undefined) return { [elementName]: value } as User;
      return { ...prevUser, [elementName]: value };
    });
  }

  return (
    <Modal
      onClose={() => onClose(false)}
      title={(user?.id ?? 0) > 0 ? 'Update Users Information' : 'Add New User'}>
      <div className='user-management-modal-body'>
        <CustomTextBox
          title='Name'
          name='name'
          value={user?.name}
          onChange={onChange}
        />
        <CustomTextBox
          title='Username'
          name='username'
          value={user?.username}
          onChange={onChange}
        />
        <CustomCheckBoxButton
          title='Is Admin'
          name='admin'
          isCheck={user?.admin ?? false}
          onChange={onChange}
        />
        <CustomCheckBoxButton
          title='Is Active'
          name='active'
          isCheck={user?.active ?? false}
          onChange={onChange}
        />
      </div>
      <div className='modal-footer'>
        <button onClick={saveData} className='btn-modal btn-primary'>
          SAVE
        </button>
      </div>
    </Modal>
  );
}
