import { createContext, useEffect, useState } from 'react';
import { useSetBusy, useSetMessage } from '../custom-hooks/authorize-provider';
import { PersonnelConcern } from '../entities/transaction/PersonnelConcern';
import { getDirectConcerns } from '../processors/personnel-concern-process';
import CustomCheckBox from './components/custom-check-box';
import Pagination from './components/pagination';
import DirectConcernItems from './components/tickets-components/direct-concern-items';
import ForwardConcern from './modals/forward-concern';
import ResolveConcern from './modals/resolve-concern';

export type CONCERNACTIONS =
  | { action: 'Resolve'; payload: PersonnelConcern }
  | { action: 'Forward'; payload: PersonnelConcern };

export const DirectConcernList = createContext<PersonnelConcern[]>([]);
export const DirectConcernActions = createContext<
  (action: CONCERNACTIONS) => void
>(() => {});
export default function TicketPage() {
  const [directConcerns, setDirectConcerns] = useState<PersonnelConcern[]>([]);
  const [selectedDirectConcern, setSelectedDirectConcern] = useState<
    PersonnelConcern | undefined
  >();
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [showForwardModal, setShowForwardModal] = useState(false);
  const [resolved, setResolved] = useState(false);
  const [forwarded, setForwarded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const setMessage = useSetMessage();
  const setBusy = useSetBusy();
  function concernAction(action: CONCERNACTIONS) {
    switch (action.action) {
      case 'Resolve':
        setSelectedDirectConcern(action.payload);
        setShowResolveModal(true);
        break;
      case 'Forward':
        setSelectedDirectConcern(action.payload);
        setShowForwardModal(true);
        break;
      default:
        setMessage({ message: 'Invalid Action' });
        break;
    }
  }
  useEffect(
    () => {
      fetchDirectConcern({});
    },
    // eslint-disable-next-line
    []
  );

  async function fetchDirectConcern({
    page,
    isResolved,
    isForwarded,
  }: {
    page?: number | undefined;
    isResolved?: boolean | undefined;
    isForwarded?: boolean | undefined;
  }) {
    setBusy(true);
    await getDirectConcerns(
      isResolved ?? resolved,
      isForwarded ?? forwarded,
      page ?? currentPage
    )
      .then((res) => {
        if (res !== undefined) {
          setDirectConcerns(res.results);
          setPageCount(res.pageCount);
        }
      })
      .catch((err) => {
        setMessage({ message: err.message });
      })
      .finally(() => setBusy(false));
  }

  function goToPage(page: number) {
    setCurrentPage(page);
    fetchDirectConcern({ page: page });
  }

  function onClose(hasChanges: boolean) {
    setShowResolveModal(false);
    setShowForwardModal(false);
    if (hasChanges) {
      fetchDirectConcern({});
    }
  }
  return (
    <div className='main-container'>
      <div className='container'>
        <div className='content'>
          <div className='head-content'>
            <div className='checkbox-container'>
              <CustomCheckBox
                text='Resolved'
                id='resolved'
                checkChange={() => {
                  var x = !resolved;
                  setResolved(x);
                  fetchDirectConcern({ isResolved: x });
                }}
                isCheck={resolved}
              />
              <CustomCheckBox
                text='Forwarded'
                id='forwarded'
                checkChange={() => {
                  var x = !forwarded;
                  setForwarded(x);
                  fetchDirectConcern({ isForwarded: x });
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
            <DirectConcernActions.Provider value={concernAction}>
              <DirectConcernItems />
            </DirectConcernActions.Provider>
          </DirectConcernList.Provider>
        </div>
      </div>
      <div>
        {showResolveModal && (
          <ResolveConcern
            onClose={onClose}
            personnelConcern={selectedDirectConcern}
          />
        )}
        {showForwardModal && (
          <ForwardConcern
            onClose={onClose}
            personnelConcern={selectedDirectConcern}
          />
        )}
      </div>
    </div>
  );
}
