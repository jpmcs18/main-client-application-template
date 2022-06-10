import { useEffect, useState } from 'react';
import {
  useSetBusy,
  useSetMessage,
} from '../../custom-hooks/authorize-provider';
import { Personnel } from '../../entities/transaction/Personnel';
import { User } from '../../entities/user/User';
import { getPersonnels } from '../../processors/personnel-process';
import { createUser, updateUser } from '../../processors/user-process';
import CustomCheckBoxButton from '../components/custom-check-box-button';
import CustomDropdown, { DropdownItem } from '../components/custom-dropdown';
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
  const [personnelItem, setPersonnelItem] = useState<DropdownItem[]>([]);
  const [personnels, setPersonnels] = useState<Personnel[]>([]);
  const [user, setUser] = useState<User>(
    () =>
      usersInfo ?? {
        id: 0,
        username: '',
        name: '',
        active: false,
        admin: false,
        personnel: undefined,
        personnelId: undefined,
      }
  );
  const setBusy = useSetBusy();
  const setMessage = useSetMessage();
  useEffect(
    () => {
      fetchPersonnels();
    },
    // eslint-disable-next-line
    []
  );

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
      console.log(user);
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
  async function fetchPersonnels() {
    setBusy(true);
    await getPersonnels()
      .then((res) => {
        if (res !== undefined) {
          setPersonnels(res);
          setPersonnelItem([
            {
              key: '',
              value: '',
            },
            ...res.map((x) => {
              return {
                key: x.id.toString(),
                value: x.name,
              };
            }),
          ]);
        }
      })
      .catch((err) => {
        setMessage({ message: err.message });
      })
      .finally(() => setBusy(false));
  }
  function onChange({ elementName, value }: CustomReturn) {
    if (elementName === 'personnel') {
      let personnel = personnels.filter((x) => x.id === +value)?.[0];
      setUser((prev) => {
        return { ...prev, personnel: personnel, personnelId: personnel.id };
      });
      return;
    }

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
        <CustomDropdown
          title='Personnel'
          name='personnel'
          value={user?.personnel?.name}
          onChange={onChange}
          itemsList={personnelItem}
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
