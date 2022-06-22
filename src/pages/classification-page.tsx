import { createContext, useEffect, useState } from 'react';
import { useSetBusy, useSetMessage } from '../custom-hooks/authorize-provider';
import { Classification } from '../entities/transaction/Classification';
import { searchClassifications } from '../processors/classification-process';
import ClassificationItems from './components/classification-components/classification-items';
import Pagination from './components/pagination';
import SeachBar from './components/seachbar';
import ManageClassification from './modals/manage-classification';

type ACTIONS =
  | { action: 'Add' }
  | { action: 'Edit'; payload: Classification }
  | { action: 'Delete'; payload: number };
export const ClassificationList = createContext<Classification[]>([]);
export const ClassificationActions = createContext<(action: ACTIONS) => void>(
  () => {}
);

export default function ClassificationPage() {
  const [key, setKey] = useState<string | undefined>();
  const [classifications, setClassifications] = useState<Classification[]>([]);
  const [pageCount, setPageCount] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const setBusy = useSetBusy();
  const setMessage = useSetMessage();
  const [showModal, setShowModal] = useState(false);
  const [selectedClassification, setSelectedClassification] = useState<
    Classification | undefined
  >();

  useEffect(
    () => {
      searchClassification({});
    },
    // eslint-disable-next-line
    []
  );

  function classificationAction(action: ACTIONS) {
    switch (action.action) {
      case 'Add':
        setShowModal(true);
        setSelectedClassification(undefined);
        break;
      case 'Edit':
        setShowModal(true);
        setSelectedClassification(action.payload);
        break;
    }
  }

  function searchClassification({
    searchKey,
    page,
  }: {
    searchKey?: string | undefined;
    page?: number | undefined;
  }) {
    setBusy(true);
    searchClassifications(searchKey ?? key, page ?? currentPage)
      .then((res) => {
        if (res !== undefined) {
          setClassifications(res.results);
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
    searchClassification({ page: page });
  }

  function search(key: string) {
    setKey(key);
    searchClassification({ searchKey: key, page: 1 });
  }

  function onClose(needToReload: boolean) {
    setShowModal(false);
    if (needToReload) {
      searchClassification({});
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
        <ClassificationList.Provider value={classifications}>
          <ClassificationActions.Provider value={classificationAction}>
            <ClassificationItems />
          </ClassificationActions.Provider>
        </ClassificationList.Provider>
      </div>
      <div>
        {showModal && (
          <ManageClassification
            onClose={onClose}
            selectedClassification={selectedClassification}
          />
        )}
      </div>
    </div>
  );
}
