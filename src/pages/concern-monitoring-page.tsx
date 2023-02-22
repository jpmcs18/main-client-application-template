import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from '@microsoft/signalr';
import { createContext, useEffect, useRef, useState } from 'react';
import { API } from '../constant';
import { useSetBusy, useSetMessage } from '../custom-hooks/authorize-provider';
import { Hub } from '../endpoints';
import { Concern } from '../entities/transaction/Concern';
import { getClassifications } from '../processors/classification-process';
import { deleteConcern, searchConcerns } from '../processors/concern-process';
import { getOffices } from '../processors/office-process';
import ConcernMonitoringItems from './components/concerns-monitoring-components/concern-monitoring-items';
import CustomCheckBox from './components/custom-check-box';
import CustomDatePicker from './components/custom-datepicker';
import CustomDropdown, { DropdownItem } from './components/custom-dropdown';
import { CustomReturn } from './components/CustomReturn';
import Pagination from './components/pagination';
import SeachBar from './components/seachbar';
import AssignConcern from './modals/assign-concern';
import ConcernActionsViewer from './modals/concern-actions-viewer';
import ManageConcernMonitoring from './modals/manage-concern-monitoring';
interface Filtering {
  classification?: number | undefined;
  office?: number | undefined;
  startDate?: Date | undefined;
  endDate?: Date | undefined;
}
export type CONCERNMONITORINGACTIONS =
  | { action: 'Add' }
  | { action: 'Assign'; payload: Concern }
  | { action: 'ViewAction'; payload: Concern }
  | { action: 'Edit'; payload: Concern }
  | { action: 'Delete'; payload: number };

export const ConcernMonitoringList = createContext<Concern[]>([]);
export const ConcernMonitoringActions = createContext<
  (action: CONCERNMONITORINGACTIONS) => void
>(() => {});
export default function ConcernMonitoringPage() {
  const [key, setKey] = useState<string | undefined>();
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [concerns, setConcerns] = useState<Concern[]>(() => []);
  const [showModal, setShowModal] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [showActionsModal, setShowActionsModal] = useState(false);
  const [selectedConcern, setSelectedConcern] = useState<Concern | undefined>();
  const assigned = useRef(true);
  const closed = useRef(false);
  const setBusy = useSetBusy();
  const setMessage = useSetMessage();
  const [connection, setConnection] = useState<HubConnection>();
  const [classificationItem, setClassificationItem] = useState<DropdownItem[]>(
    () => []
  );
  const [officeItem, setOfficeItem] = useState<DropdownItem[]>(() => []);
  const [filtering, setFiltering] = useState<Filtering>(() => {
    return {
      classification: undefined,
      office: undefined,
      startDate: undefined,
      endDate: undefined,
    };
  });
  async function onClose(hasChanges: boolean, personnel: string | undefined) {
    setShowModal(false);
    setShowAssignmentModal(false);
    if (hasChanges) {
      console.log(connection?.state);
      await reconnect();
      await connection?.invoke('NewConcern');
      if ((personnel ?? '') !== '')
        await connection?.invoke('NewTicket', personnel);
      searchConcern();
    }
  }
  useEffect(
    () => {
      searchConcern();
    },
    //eslint-disable-next-line
    [currentPage, key]
  );
  useEffect(
    () => {
      initializeComponents();
    },
    // eslint-disable-next-line
    []
  );

  async function initializeComponents() {
    if (!('Notification' in window)) {
      console.log('This browser does not support desktop notification');
    } else {
      Notification.requestPermission();
    }
    await fetchClassifications();
    await fetchOffices();
    await connect();
    await searchConcern();
  }

  async function connect() {
    try {
      if (connection === undefined) {
        var conn = new HubConnectionBuilder()
          .withUrl(API + Hub.Transaction)
          .configureLogging(LogLevel.Information)
          .build();

        conn.on('NewConcern', () => {
          new Notification('New Concern Added');
          searchConcern();
        });
        conn.on('ResolveConcern', (ticketnumber) => {
          new Notification(`Ticket ${ticketnumber} Resolved`);
          searchConcern();
        });
        await conn.start();
        if (conn.state === HubConnectionState.Connected) {
          await conn.invoke('JoinConcernCreators');
          console.log(conn.state);
        }
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
  async function searchConcern() {
    setBusy(true);
    searchConcerns(
      key,
      currentPage,
      assigned.current,
      closed.current,
      filtering.startDate,
      filtering.endDate,
      filtering.office,
      filtering.classification
    )
      .then((res) => {
        if (res !== undefined) {
          setConcerns(res.results);
          setPageCount(res.pageCount);
        }
      })
      .catch((err) => {
        setMessage({ message: err.message });
      })
      .finally(() => setBusy(false));
  }
  function search(key: string) {
    setKey(() => key);
    setCurrentPage(() => 1);
  }
  function goToPage(page: number) {
    setCurrentPage(() => page);
  }
  function concernAction(action: CONCERNMONITORINGACTIONS) {
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
          message: 'Concern Deleted',
          onOk: () => {
            searchConcern();
          },
        });
      })
      .catch((err) => {
        setMessage({ message: err.message });
      })
      .finally(() => setBusy(false));
  }
  async function fetchClassifications() {
    setBusy(true);
    await getClassifications()
      .then((res) => {
        if (res !== undefined) {
          setClassificationItem(() => [
            { key: '', value: '' },
            ...res.map((r) => {
              return { key: r.id.toString(), value: r.description };
            }),
          ]);
        }
      })
      .catch((err) => {
        setMessage({ message: err.message });
      })
      .finally(() => setBusy(false));
  }
  async function fetchOffices() {
    setBusy(true);
    await getOffices()
      .then((res) => {
        if (res !== undefined) {
          setOfficeItem(() => [
            { key: '', value: '' },
            ...res.map((r) => {
              return { key: r.id.toString(), value: r.description };
            }),
          ]);
        }
      })
      .catch((err) => {
        setMessage({ message: err.message });
      })
      .finally(() => setBusy(false));
  }

  async function onChange({ elementName, value }: CustomReturn) {
    setFiltering((r) => {
      return { ...r, [elementName]: value };
    });
  }
  return (
    <>
      <section>
        <div className='header'>
          <div className='header-text'>Concerns Monitoring</div>
        </div>
      </section>
      <section>
        <SeachBar search={search} />
      </section>
      <section>
        <div className='filter-container'>
          <CustomDatePicker
            title='Start Date'
            name='startDate'
            value={filtering.startDate}
            onChange={onChange}
          />
          <CustomDatePicker
            title='End Date'
            name='endDate'
            value={filtering.endDate}
            onChange={onChange}
          />
          <CustomDropdown
            title='Office'
            name='office'
            value={filtering.office}
            onChange={onChange}
            itemsList={officeItem}
          />
          <CustomDropdown
            title='Classification'
            name='classification'
            value={filtering.classification}
            onChange={onChange}
            itemsList={classificationItem}
          />
        </div>
      </section>
      <section className='head-content'>
        <div className='container'>
          <CustomCheckBox
            text='Assigned'
            id='assigned'
            checkChange={() => {
              assigned.current = !assigned.current;
              searchConcern();
            }}
            isCheck={assigned.current}
          />
          <CustomCheckBox
            text='Closed'
            id='closed'
            checkChange={() => {
              closed.current = !closed.current;
              searchConcern();
            }}
            isCheck={closed.current}
          />
        </div>
        <Pagination
          pages={pageCount}
          currentPageNumber={currentPage}
          goInPage={goToPage}></Pagination>
      </section>
      <section className='table-container'>
        <ConcernMonitoringList.Provider value={concerns}>
          <ConcernMonitoringActions.Provider value={concernAction}>
            <ConcernMonitoringItems />
          </ConcernMonitoringActions.Provider>
        </ConcernMonitoringList.Provider>
      </section>
      <>
        {showModal && (
          <ManageConcernMonitoring
            onClose={onClose}
            selectedConcern={selectedConcern}
          />
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
      </>
    </>
  );
}
