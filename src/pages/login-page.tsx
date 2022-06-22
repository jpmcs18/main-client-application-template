import { useState } from 'react';
import {
  useSetBusy,
  useSetMessage,
  useUpdateAuthorize,
  useUpdateUserProfile,
} from '../custom-hooks/authorize-provider';
import { LoginUser } from '../entities/user/LoginUser';
import { authenticate } from '../processors/security-process';
import { saveProfile } from '../processors/session-manager';
import { getUserData } from '../processors/user-process';
import CustomTextBox from './components/custom-textbox';
import { CustomReturn } from './components/CustomReturn';

export default function LoginPage() {
  const [user, setUser] = useState<LoginUser>({
    username: '',
    password: '',
  });
  const setMessage = useSetMessage();
  const updateProfile = useUpdateUserProfile();
  const updateAuthorize = useUpdateAuthorize();
  const setBusy = useSetBusy();
  async function signIn() {
    setBusy(true);
    await authenticate(user)
      .then(async (res) => {
        if (res) {
          await getProfile();
          updateAuthorize(res);
        }
      })
      .catch((err) => {
        setMessage({ message: err.message });
      })
      .finally(() => setBusy(false));
  }

  async function getProfile() {
    setBusy(true);
    await getUserData()
      .then((res) => {
        if (res !== undefined) {
          saveProfile(res);
          updateProfile(res);
        }
      })
      .catch((err) => {
        setMessage({ message: err.message });
      })
      .finally(() => setBusy(false));
  }
  function onTextChange({ elementName, value }: CustomReturn) {
    setUser({ ...user, [elementName]: value });
  }
  function onKeyPress(key: React.KeyboardEvent<HTMLDivElement>) {
    if (key.key === 'Enter') {
      if (user.username === '') {
        document.getElementById('username')?.focus();
        return;
      }
      if (user.password === '') {
        document.getElementById('password')?.focus();
        return;
      }

      signIn();
    }
  }
  return (
    <div className='login-container'>
      <div className='login-header'>
        <h1>Authentication</h1>
      </div>
      <div className='login-content'>
        <CustomTextBox
          title='Username'
          name='username'
          id='username'
          className='username'
          onChange={onTextChange}
          onKeyPress={onKeyPress}
        />
        <CustomTextBox
          title='Password'
          name='password'
          id='password'
          type='password'
          className='password'
          onChange={onTextChange}
          onKeyPress={onKeyPress}
        />
        <button onClick={signIn} className='btn'>
          Login
        </button>
      </div>
    </div>
  );
}
