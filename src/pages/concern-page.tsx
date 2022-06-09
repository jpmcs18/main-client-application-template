import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSetBusy, useSetMessage } from '../custom-hooks/authorize-provider';
import { Concern } from '../entities/transaction/Concern';
import { searchConcerns } from '../processors/concern-process';
import Concerns from './components/concerns-components/concerns-items';
import Pagination from './components/pagination';
import SeachBar from './components/seachbar';
import ManageConcern from './modals/manage-concern';

const ConcernItems = createContext<Concern[]>([]);
const AddConcernItem = createContext<() => void>(() => {});
export function useConcerns() {
  return useContext(ConcernItems);
}
export function useAddConcern() {
  return useContext(AddConcernItem);
}
export default function ConcernPage() {
  const [key, setKey] = useState<string | undefined>();
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [concerns, setConcerns] = useState<Concern[]>(() => []);
  const [showModal, setShowModal] = useState(false);
  const [selectedConcern, setSelectedConcern] = useState<Concern | undefined>();
  const setBusy = useSetBusy();
  const setMessage = useSetMessage();
  function addConcern() {
    setSelectedConcern(() => undefined);
    setShowModal(() => true);
  }
  function onClose(hasChanges: boolean) {
    setShowModal(() => false);
  }
  useEffect(() => {
    searchConcern('', 1);
  }, []);
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
        <ConcernItems.Provider value={concerns}>
          <AddConcernItem.Provider value={addConcern}>
            <Concerns />
          </AddConcernItem.Provider>
        </ConcernItems.Provider>
      </div>
      <div>
        {showModal && (
          <ManageConcern onClose={onClose} selectedConcern={selectedConcern} />
        )}
      </div>
    </div>
  );
}
