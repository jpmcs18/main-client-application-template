import { createContext, useEffect, useState } from 'react';
import { useSetBusy, useSetMessage } from '../custom-hooks/authorize-provider';
import { Module } from '../entities/user/Module';
import { Role } from '../entities/user/Role';
import { searchRoles } from '../processors/role-process';
import Pagination from './components/pagination';
import RoleItems from './components/role-components/role-items';
import SeachBar from './components/seachbar';
import ManageRole from './modals/manage-role';

type ACTIONS =
  | { action: 'Add' }
  | { action: 'View'; payload: Role }
  | { action: 'Edit'; payload: Role }
  | { action: 'Delete'; payload: number }
  | { action: 'Check'; payload: Module };
export const RoleList = createContext<Role[]>([]);
export const RoleActions = createContext<(action: ACTIONS) => void>(() => {});

export default function RolePage() {
  const [key, setKey] = useState<string | undefined>();
  const [roles, setRoles] = useState<Role[]>([]);
  const [pageCount, setPageCount] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const setBusy = useSetBusy();
  const setMessage = useSetMessage();
  const [showModal, setShowModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | undefined>();
  const [viewOnly, setViewOnly] = useState(false);

  useEffect(
    () => {
      searchRole({});
    },
    // eslint-disable-next-line
    []
  );

  function roleAction(action: ACTIONS) {
    switch (action.action) {
      case 'View':
        setShowModal(true);
        setSelectedRole(action.payload);
        setViewOnly(true);
        break;
      case 'Add':
        setShowModal(true);
        setSelectedRole(undefined);
        setViewOnly(false);
        break;
      case 'Edit':
        setShowModal(true);
        setSelectedRole(action.payload);
        setViewOnly(false);
        break;
      // case 'Delete':
      //   setMessage({
      //     message: 'Are you sure you want to delete this?',
      //     action: 'YESNO',
      //     onOk: () => {
      //       deleteSelectedUser(action.payload);
      //     },
      //   });
      //   break;
      // default:
      //   setMessage({ message: 'Invalid Action' });
      //   break;
    }
  }

  function searchRole({
    searchKey,
    page,
  }: {
    searchKey?: string | undefined;
    page?: number | undefined;
  }) {
    setBusy(true);
    searchRoles(searchKey ?? key, page ?? currentPage)
      .then((res) => {
        if (res !== undefined) {
          setRoles(res.results);
          setPageCount(res.pageCount);
          if (page !== undefined) setCurrentPage(page);
        }
      })
      .catch((err) => {
        setMessage({ message: err.message });
      })
      .finally(() => setBusy(false));
  }

  function goToPage(page: number) {
    searchRole({ page: page });
  }

  function search(key: string) {
    setKey(key);
    searchRole({ searchKey: key, page: 1 });
  }

  function onClose(needToReload: boolean) {
    setShowModal(false);
    if (needToReload) {
      searchRole({});
    }
  }

  return (
    <>
      <section>
        <SeachBar search={search} />
      </section>
      <section>
        <Pagination
          pages={pageCount}
          currentPageNumber={currentPage}
          goInPage={goToPage}></Pagination>
      </section>
      <section>
        <RoleList.Provider value={roles}>
          <RoleActions.Provider value={roleAction}>
            <RoleItems />
          </RoleActions.Provider>
        </RoleList.Provider>
      </section>
      <>
        {showModal && (
          <ManageRole
            onClose={onClose}
            selectedRole={selectedRole}
            viewOnly={viewOnly}
          />
        )}
      </>
    </>
  );
}
