import React, { createContext, useState } from 'react';
import { useSetBusy, useSetMessage } from '../custom-hooks/authorize-provider';
import { Concern } from '../entities/transaction/Concern';
import CustomCheckBox from './components/custom-check-box';
import Pagination from './components/pagination';
import DirectConcernItems from './components/tickets-components/direct-concern-items';

export type CONCERNACTIONS = { action: 'Edit'; payload: Concern };

export const DirectConcernList = createContext<Concern[]>([]);
export const DirectConcernActions = createContext<
  (action: CONCERNACTIONS) => void
>(() => {});
export default function TicketPage() {
  const [directConcerns, setDirectConcerns] = useState<Concern[]>([]);
  const [concern, setConcern] = useState<Concern[]>([]);
  const [selectedDirectConcern, setSelectedDirectConcern] = useState<
    Concern | undefined
  >();
  const [showDirectModal, setShowDirectModal] = useState(false);
  const [resolved, setResolved] = useState(false);
  const [forwarded, setForwarded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const setMessage = useSetMessage();
  const setBusy = useSetBusy();
  function concernAction(action: CONCERNACTIONS) {
    switch (action.action) {
      case 'Edit':
        setSelectedDirectConcern(action.payload);
        setShowDirectModal(true);
        break;
      default:
        setMessage({ message: 'Invalid Action' });
        break;
    }
  }
  function fetchDirectConcern() {
    setBusy(true);
  }
  function goToPage(page: number) {
    // getConcern(page);
  }
  return (
    <div className='main-container'>
      <div className='container'>
        <div className='header'>Assigned Concern</div>
        <div className='content'>
          <div>
            <div className='checkbox-container'>
              <CustomCheckBox
                text='Resolved'
                id='resolved'
                checkChange={() => {
                  setResolved((x) => !x);
                }}
                isCheck={resolved}
              />
              <CustomCheckBox
                text='Forwarded'
                id='forwarded'
                checkChange={() => {
                  setForwarded((x) => !x);
                }}
                isCheck={forwarded}
              />
            </div>

            <Pagination
              pages={pageCount}
              currentPageNumber={currentPage}
              goInPage={goToPage}></Pagination>
          </div>
          <DirectConcernList.Provider value={directConcerns}>
            <DirectConcernItems />
          </DirectConcernList.Provider>
        </div>
      </div>
    </div>
  );
}
