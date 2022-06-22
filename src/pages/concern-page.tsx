import React, { createContext, useEffect, useState } from 'react';
import { useSetBusy, useSetMessage } from '../custom-hooks/authorize-provider';
import { Concern } from '../entities/transaction/Concern';
import { deleteConcern, searchConcerns } from '../processors/concern-process';
import ConcernItems from './components/concerns-components/concern-items';
import Pagination from './components/pagination';
import SeachBar from './components/seachbar';
import AssignConcern from './modals/assign-concern';
import ConcernActionsViewer from './modals/concern-actions-viewer';
import ManageConcern from './modals/manage-concern';

export type CONCERNACTIONS =
  | { action: 'Add' }
  | { action: 'Assign'; payload: Concern }
  | { action: 'ViewAction'; payload: Concern }
  | { action: 'Edit'; payload: Concern }
  | { action: 'Delete'; payload: number };

export const ConcernList = createContext<Concern[]>([]);
export const ConcernActions = createContext<(action: CONCERNACTIONS) => void>(
  () => {}
);
export default function ConcernPage() {
  const [key, setKey] = useState<string | undefined>();
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [concerns, setConcerns] = useState<Concern[]>(() => []);
  const [showModal, setShowModal] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [showActionsModal, setShowActionsModal] = useState(false);
  const [selectedConcern, setSelectedConcern] = useState<Concern | undefined>();
  const setBusy = useSetBusy();
  const setMessage = useSetMessage();
  function onClose(hasChanges: boolean) {
    setShowModal(false);
    setShowAssignmentModal(false);
    if (hasChanges) {
      searchConcern(key, currentPage);
    }
  }
  useEffect(
    () => {
      searchConcern(key, currentPage);
    },
    // eslint-disable-next-line
    []
  );
  async function searchConcern(key: string | undefined, page: number) {
    setBusy(true);
    searchConcerns(key, page)
      .then((res) => {
        if (res !== undefined) {
          setConcerns(res.results);
          setPageCount(res.pageCount);
          setCurrentPage(page);
        }
      })
      .catch((err) => {
        setMessage({ message: err.message });
      })
      .finally(() => setBusy(false));
  }
  function search(key: string) {
    setKey(key);
    searchConcern(key, 1);
  }
  function goToPage(page: number) {
    searchConcern(key, page);
  }
  function concernAction(action: CONCERNACTIONS) {
    switch (action.action) {
      case 'Add':
        setSelectedConcern(() => undefined);
        setShowModal(() => true);
        break;
      case 'ViewAction':
        setSelectedConcern(action.payload);
        setShowActionsModal(true);
        break;
      case 'Assign':
        setSelectedConcern(action.payload);
        setShowAssignmentModal(true);
        break;
      case 'Edit':
        setSelectedConcern(action.payload);
        setShowModal(true);
        break;
      case 'Delete':
        setMessage({
          message: 'Are you sure you want to delete this?',
          action: 'YESNO',
          onOk: () => {
            deleteSelectedConcern(action.payload);
          },
        });
        break;
      default:
        setMessage({ message: 'Invalid Action' });
        break;
    }
  }

  async function deleteSelectedConcern(id: number) {
    setBusy(true);
    await deleteConcern(id)
      .then(() => {
        setMessage({
          message: 'User Deleted',
          onOk: () => {
            searchConcern(key, currentPage);
          },
        });
      })
      .catch((err) => {
        setMessage({ message: err.message });
      })
      .finally(() => setBusy(false));
  }
  return (
    <div className='main-container'>
      <div className='content'>
        <SeachBar search={search} />
        <div>
          <Pagination
            pages={pageCount}
            currentPageNumber={currentPage}
            goInPage={goToPage}></Pagination>
        </div>
        <ConcernList.Provider value={concerns}>
          <ConcernActions.Provider value={concernAction}>
            <ConcernItems />
          </ConcernActions.Provider>
        </ConcernList.Provider>
      </div>
      <div>
        {showModal && (
          <ManageConcern onClose={onClose} selectedConcern={selectedConcern} />
        )}
        {showAssignmentModal && (
          <AssignConcern onClose={onClose} concern={selectedConcern} />
        )}
        {showActionsModal && (
          <ConcernActionsViewer
            concern={selectedConcern}
            onClose={() => setShowActionsModal(false)}
          />
        )}
      </div>
    </div>
  );
}
