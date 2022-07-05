import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
} from '@microsoft/signalr';
import { createContext, useEffect, useState } from 'react';
import { API } from '../constant';
import {
  useSetBusy,
  useSetMessage,
  useUserProfile,
} from '../custom-hooks/authorize-provider';
import { Hub } from '../endpoints';
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
  const [pending, setPending] = useState(true);
  const [resolved, setResolved] = useState(false);
  const [forwarded, setForwarded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const profile = useUserProfile();
  const setMessage = useSetMessage();
  const setBusy = useSetBusy();
  const [connection, setConnection] = useState<HubConnection>();

  useEffect(
    () => {
      if (!('Notification' in window)) {
        console.log('This browser does not support desktop notification');
      } else {
        Notification.requestPermission();
      }
      connect();
    },
    //eslint-disable-next-line
    []
  );
  async function connect() {
    try {
      if (connection === undefined) {
        var conn = new HubConnectionBuilder()
          .withUrl(API + Hub.Transaction)
          .build();

        conn.on('NewTicket', () => {
          new Notification('New Ticket Assigned');
          fetchDirectConcern({});
        });

        conn.on('ForwardTicket', (personnel) => {
          new Notification(`New Ticket Forwarded by ${personnel}`);
          fetchDirectConcern({});
        });

        await conn.start();
        if (conn.state === HubConnectionState.Connected)
          await conn.invoke('JoinTicket', profile?.personnel?.name);
        setConnection(conn);
      } else {
        await reconnect();
      }
    } catch (ex) {
      setMessage({ message: ex });
    }
  }
  async function reconnect() {
    if (connection?.state === HubConnectionState.Disconnected)
      await connection?.start();
  }
  async function concernAction(action: CONCERNACTIONS) {
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
    isPending,
  }: {
    page?: number | undefined;
    isResolved?: boolean | undefined;
    isForwarded?: boolean | undefined;
    isPending?: boolean | undefined;
  }) {
    setBusy(true);
    await getDirectConcerns(
      isResolved ?? resolved,
      isForwarded ?? forwarded,
      isPending ?? pending,
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

  async function onCloseForward(hasChanges: boolean, personnel: string) {
    setShowForwardModal(false);
    if (hasChanges) {
      fetchDirectConcern({});
      await reconnect();
      await connection?.invoke(
        'ForwardTicket',
        profile?.personnel?.name,
        personnel
      );
    }
  }
  async function onCLoseResolve(hasChanges: boolean) {
    setShowResolveModal(false);
    if (hasChanges) {
      await reconnect();
      await connection?.invoke(
        'Resolve',
        selectedDirectConcern?.concern.number
      );
      fetchDirectConcern({});
    }
  }
  return (
    <>
      <section>
        <div className='header'>
          <div className='header-text'>Tickets</div>
        </div>
      </section>
      <section className='head-content'>
        <div className='checkbox-container'>
          <CustomCheckBox
            text='Pending'
            id='pending'
            checkChange={() => {
              var x = !pending;
              setPending(x);
              fetchDirectConcern({ isPending: x });
            }}
            isCheck={pending}
          />
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
      </section>
      <section>
        <DirectConcernList.Provider value={directConcerns}>
          <DirectConcernActions.Provider value={concernAction}>
            <DirectConcernItems />
          </DirectConcernActions.Provider>
        </DirectConcernList.Provider>
      </section>
      <>
        {showResolveModal && (
          <ResolveConcern
            onClose={onCLoseResolve}
            personnelConcern={selectedDirectConcern}
          />
        )}
        {showForwardModal && (
          <ForwardConcern
            onClose={onCloseForward}
            personnelConcern={selectedDirectConcern}
          />
        )}
      </>
    </>
  );
}
