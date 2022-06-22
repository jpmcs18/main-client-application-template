import { useEffect, useState } from 'react';
import { useSetBusy, useSetMessage } from '../custom-hooks/authorize-provider';
import { User } from '../entities/user/User';
import {
  activateUsers,
  deleteUser,
  resetUserPassword,
  searchUsers,
} from '../processors/user-process';
import Pagination from './components/pagination';
import SeachBar from './components/seachbar';
import UserItem from './components/users-components/user-item';
import ManageUser from './modals/manage-user';

export type USERACTIONS =
  | { type: 'Activate'; id: number; active: boolean }
  | { type: 'ResetPassword'; id: number }
  | { type: 'Edit'; user: User }
  | { type: 'Delete'; id: number };

export default function UserPage() {
  const [name, setName] = useState<string | undefined>();
  const [users, setUsers] = useState<User[]>([]);
  const [pageCount, setPageCount] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const setBusy = useSetBusy();
  const setMessage = useSetMessage();
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>();

  useEffect(
    () => {
      searchUser(name, currentPage);
    },
    // eslint-disable-next-line
    []
  );

  function userAction(action: USERACTIONS) {
    switch (action.type) {
      case 'Activate':
        activateUser(action.id, action.active);
        break;
      case 'ResetPassword':
        resetPassword(action.id);
        break;
      case 'Edit':
        setShowModal(true);
        setSelectedUser(action.user);
        break;
      case 'Delete':
        setMessage({
          message: 'Are you sure you want to delete this?',
          action: 'YESNO',
          onOk: () => {
            deleteSelectedUser(action.id);
          },
        });
        break;
      default:
        setMessage({ message: 'Invalid Action' });
        break;
    }
  }

  async function deleteSelectedUser(userid: number) {
    setMessage({
      message: 'Delete this user',
      onOk: async () => {
        setBusy(true);
        await deleteUser(userid)
          .then(() => {
            setMessage({
              message: 'User Deleted',
              onOk: () => {
                searchUser(name, currentPage);
              },
            });
          })
          .catch((err) => {
            setMessage({ message: err.message });
          })
          .finally(() => setBusy(false));
      },
    });
  }

  function activateUser(id: number, active: boolean) {
    setMessage({
      message: 'Active this user?',
      onOk: async () => {
        setBusy(true);
        await activateUsers(id)
          .then((res) => {
            setUsers((users) =>
              users.map((user) => {
                if (user.id === id && active !== null) {
                  user.active = !active;
                }
                return user;
              })
            );

            setMessage({ message: active ? 'Deactivated' : 'Activated' });
          })
          .catch((err) => {
            setMessage({ message: err.message });
          })
          .finally(() => setBusy(false));
      },
    });
  }

  function resetPassword(id: number) {
    setMessage({
      message: 'Reset Password?',
      onOk: async () => {
        setBusy(true);
        await resetUserPassword(id)
          .then(() => {
            setMessage({ message: 'Password reset to default password' });
          })
          .catch((err) => {
            setMessage({ message: err.message });
          })
          .finally(() => setBusy(false));
      },
    });
  }

  function searchUser(name: undefined | string, page: number) {
    setBusy(true);
    searchUsers(name, page)
      .then((res) => {
        if (res !== undefined) {
          setUsers(res.results);
          setPageCount(res.pageCount);
          setCurrentPage(page);
        }
      })
      .catch((err) => {
        setMessage({ message: err.message });
      })
      .finally(() => setBusy(false));
  }

  function goToPage(page: number) {
    searchUser(name, page);
  }

  function search(key: string) {
    setName(key);
    searchUser(key, 1);
  }

  function onClose(needToReload: boolean) {
    setShowModal(false);
    if (needToReload) {
      searchUser(name, currentPage);
    }
  }
  function addUser() {
    setSelectedUser(undefined);
    setShowModal(true);
  }

  return (
    <div className='main-container'>
      <div className='item-container'>
        <SeachBar search={search} />
        <div>
          <Pagination
            pages={pageCount}
            currentPageNumber={currentPage}
            goInPage={goToPage}></Pagination>
        </div>
        <div className='content'>
          <table className='users-content item-table'>
            <thead>
              <tr>
                <th>Name</th>
                <th>Classification</th>
                <th>Username</th>
                <th>Role</th>
                <th>Status</th>
              </tr>
              <tr>
                <th colSpan={6}>
                  <button className='btn' onClick={addUser}>
                    Add New User
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <UserItem key={user.id} user={user} action={userAction} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div>
        {showModal && <ManageUser onClose={onClose} usersInfo={selectedUser} />}
      </div>
    </div>
  );
}
