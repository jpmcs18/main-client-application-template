import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { useSetBusy, useSetMessage } from '../custom-hooks/authorize-provider';
import { TicketSummary } from '../entities/transaction/PersonnelConcern';
import {
  addDays,
  addMonths,
  getFirstDateOfMonth,
  getLastDateOfMonth,
  getMonthName,
} from '../helpers';
import { getTicketSummary } from '../processors/personnel-concern-process';
import DetailedSummary from './modals/detailed-summary';
interface SummaryDate {
  date: Date;
  summary?: TicketSummary | undefined;
}
export default function SummaryPage() {
  const setMessage = useSetMessage();
  const setBusy = useSetBusy();
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date());
  const [dates, setDates] = useState<SummaryDate[]>(() => []);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [showModal, setShowModal] = useState<boolean>(false);
  useEffect(
    () => {
      initializeComponents();
    },
    //eslint-disable-next-line
    [currentDate]
  );

  async function initializeComponents() {
    setBusy(true);
    await getTicketSummary(
      currentDate.getMonth() + 1,
      currentDate.getFullYear()
    )
      .then((res) => {
        const firstDate = getFirstDateOfMonth(currentDate);
        const lastDate = getLastDateOfMonth(currentDate);
        let firstDay = firstDate.getDay();

        let date = firstDate;
        const last =
          (lastDate.getDate() ?? 0) + firstDay + (6 - lastDate.getDay());
        var _dates: SummaryDate[] = [];
        if (firstDay > 0) {
          date = addDays(firstDate, -firstDay);
        }
        for (let i = 0; i < last; i++) {
          var sum = res?.filter(
            // eslint-disable-next-line
            (x) => new Date(x.date).toDateString() === date.toDateString()
          )?.[0];
          _dates = [..._dates, { date: date, summary: sum }];
          date = addDays(date, 1);
        }
        setDates(() => _dates);
      })
      .catch((err) => {
        setMessage({ message: err.message });
      })
      .finally(() => setBusy(false));
  }
  return (
    <>
      <section>
        <div className='header'>
          <div className='header-text'>Ticket Summary</div>
          <div className='date-action'>
            <FontAwesomeIcon
              icon={faAngleLeft as IconProp}
              onClick={() => setCurrentDate(() => addMonths(currentDate, -1))}
            />
            <div className='month-year'>
              <div>{getMonthName(currentDate)}</div>
              <div>{currentDate.getFullYear()}</div>
            </div>
            <FontAwesomeIcon
              icon={faAngleRight as IconProp}
              onClick={() => setCurrentDate(() => addMonths(currentDate, 1))}
              className={
                currentDate.getMonth() === new Date().getMonth() &&
                currentDate.getFullYear() === new Date().getFullYear()
                  ? 'stop'
                  : ''
              }
            />
          </div>
        </div>
      </section>
      <section>
        <div className='calendar'>
          <div className='day-header'>Su</div>
          <div className='day-header'>Mo</div>
          <div className='day-header'>Tu</div>
          <div className='day-header'>We</div>
          <div className='day-header'>Th</div>
          <div className='day-header'>Fr</div>
          <div className='day-header'>Sa</div>
          {dates.map((x, i) => (
            <div
              className={`date ${
                x.date.getMonth() === currentDate.getMonth()
                  ? 'current-month'
                  : 'non'
              } ${
                x.date.toDateString() === new Date().toDateString()
                  ? 'current'
                  : ''
              } ${
                !!x.summary?.noOfResolved || !!x.summary?.noOfForwarded
                  ? 'has-data'
                  : ''
              }`}
              key={i}
              onClick={() => {
                if (!!x.summary?.noOfResolved || !!x.summary?.noOfForwarded) {
                  setSelectedDate(x.date);
                  setShowModal(true);
                  return;
                }
                if (
                  x.date.getMonth() < currentDate.getMonth() ||
                  x.date.getFullYear() < currentDate.getFullYear()
                ) {
                  setCurrentDate(x.date);
                  return;
                }
                if (
                  currentDate.getMonth() !== new Date().getMonth() &&
                  currentDate.getFullYear() === new Date().getFullYear()
                ) {
                  if (
                    x.date.getMonth() > currentDate.getMonth() ||
                    x.date.getFullYear() > currentDate.getFullYear()
                  ) {
                    setCurrentDate(x.date);
                  }
                  return;
                }
              }}>
              <div className='day'>{x.date.getDate()}</div>
              <div className='remarks'>
                {!!x.summary?.noOfResolved && (
                  <div>RESOLVED: {x.summary?.noOfResolved}</div>
                )}
                {!!x.summary?.noOfForwarded && (
                  <div>FORWARDED: {x.summary?.noOfForwarded}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
      <>
        {showModal && (
          <DetailedSummary
            date={selectedDate}
            onClose={() => {
              setShowModal(false);
              setSelectedDate(undefined);
            }}
          />
        )}
      </>
    </>
  );
}
