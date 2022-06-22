import { createContext, useEffect, useState } from 'react';
import { useSetBusy, useSetMessage } from '../custom-hooks/authorize-provider';
import { Office } from '../entities/transaction/Office';
import { searchOffices } from '../processors/office-process';
import OfficeItems from './components/office-components/office-items';
import Pagination from './components/pagination';
import SeachBar from './components/seachbar';
import ManageOffice from './modals/manage-office';

type ACTIONS =
  | { action: 'Add' }
  | { action: 'Edit'; payload: Office }
  | { action: 'Delete'; payload: number };
export const OfficeList = createContext<Office[]>([]);
export const OfficeActions = createContext<(action: ACTIONS) => void>(() => {});

export default function OfficePage() {
  const [key, setKey] = useState<string | undefined>();
  const [offices, setOffices] = useState<Office[]>([]);
  const [pageCount, setPageCount] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const setBusy = useSetBusy();
  const setMessage = useSetMessage();
  const [showModal, setShowModal] = useState(false);
  const [selectedOffice, setSelectedOffice] = useState<Office | undefined>();

  useEffect(
    () => {
      searchOffice({});
    },
    // eslint-disable-next-line
    []
  );

  function officeAction(action: ACTIONS) {
    switch (action.action) {
      case 'Add':
        setShowModal(true);
        setSelectedOffice(undefined);
        break;
      case 'Edit':
        setShowModal(true);
        setSelectedOffice(action.payload);
        break;
    }
  }

  function searchOffice({
    searchKey,
    page,
  }: {
    searchKey?: string | undefined;
    page?: number | undefined;
  }) {
    setBusy(true);
    searchOffices(searchKey ?? key, page ?? currentPage)
      .then((res) => {
        if (res !== undefined) {
          setOffices(res.results);
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
    searchOffice({ page: page });
  }

  function search(key: string) {
    setKey(key);
    searchOffice({ searchKey: key, page: 1 });
  }

  function onClose(needToReload: boolean) {
    setShowModal(false);
    if (needToReload) {
      searchOffice({});
    }
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
        <OfficeList.Provider value={offices}>
          <OfficeActions.Provider value={officeAction}>
            <OfficeItems />
          </OfficeActions.Provider>
        </OfficeList.Provider>
      </div>
      <div>
        {showModal && (
          <ManageOffice onClose={onClose} selectedOffice={selectedOffice} />
        )}
      </div>
    </div>
  );
}
