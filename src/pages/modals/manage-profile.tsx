import React, { useState } from 'react';
import {
  useSetBusy,
  useSetMessage,
  useUpdateUserProfile,
  useUserProfile,
} from '../../custom-hooks/authorize-provider';
import { UpdateUserProfile } from '../../entities/user/UpdateUserProfile';
import { saveProfile } from '../../processors/session-manager';
import { updateProfile } from '../../processors/user-process';
import CustomTextBox from '../components/custom-textbox';
import { CustomReturn } from '../components/CustomReturn';
import Modal from './modal';

export default function ManageProfile({ onClose }: { onClose: () => void }) {
  const profile = useUserProfile();
  const updateProfileInfo = useUpdateUserProfile();
  const [user, setUser] = useState<UpdateUserProfile>(() => {
    return {
      username: profile?.username ?? '',
      personnel: profile?.personnel,
    };
  });

  const setBusy = useSetBusy();
  const setMessage = useSetMessage();
  async function saveData() {
    if ((user.password ?? '') !== '') {
      if (
        (user.newPassword ?? '') !== '' &&
        (user.confirmNewPassword ?? '') !== ''
      ) {
        if (user.newPassword !== user.confirmNewPassword) {
          setMessage({ message: 'Password not match' });
          return;
        }
      }
    }
    setBusy(true);
    await updateProfile(user)
      .then(() => {
        setMessage({
          message: 'Profile Updated',
          onOk: () => {
            saveProfile({
              ...profile,
              username: user.username,
            });
            updateProfileInfo({
              ...profile,
              username: user.username,
            });
          },
        });
      })
      .catch((err) => {
        setMessage({ message: err.message });
      })
      .finally(() => setBusy(false));
  }

  function onChange({ elementName, value }: CustomReturn) {
    setUser((prevUser) => {
      return { ...prevUser, [elementName]: value };
    });
  }
  return (
    <Modal className='profile-modal' onClose={onClose} title='Users Profile'>
      <div className='modal-content-body'>
        <div>
          <CustomTextBox
            title='Name'
            readonly={true}
            value={user?.personnel?.name}
          />
          <CustomTextBox
            title='Username'
            name='username'
            value={user?.username}
            onChange={onChange}
          />
          <CustomTextBox
            title='Old Password'
            name='password'
            value={user?.password}
            type='password'
            onChange={onChange}
          />
          <CustomTextBox
            title='New Password'
            name='newPassword'
            type='password'
            value={user?.newPassword}
            onChange={onChange}
          />
          <CustomTextBox
            title='Confirm New Password'
            name='confirmNewPassword'
            type='password'
            value={user?.confirmNewPassword}
            onChange={onChange}
          />
        </div>
      </div>
      <div className='modal-footer'>
        <button onClick={saveData} className='btn-modal btn-primary'>
          SAVE
        </button>
      </div>
    </Modal>
  );
}
