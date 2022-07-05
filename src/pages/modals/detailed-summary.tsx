import { useEffect, useState } from 'react';
import {
  useSetBusy,
  useSetMessage,
} from '../../custom-hooks/authorize-provider';
import { PersonnelConcern } from '../../entities/transaction/PersonnelConcern';
import { getDetailedSummary } from '../../processors/personnel-concern-process';
import ConcernDetail from '../components/concerns-components/concern-detail';
import Modal from './modal';

export default function DetailedSummary({
  date,
  onClose,
}: {
  date: Date | undefined;
  onClose: () => void;
}) {
  const [personnelConcern, setPersonnelConcern] = useState<PersonnelConcern[]>(
    []
  );
  const setBusy = useSetBusy();
  const setMessage = useSetMessage();
  useEffect(
    () => {
      initializeComponents();
    },

    // eslint-disable-next-line
    []
  );
  async function initializeComponents() {
    await fetchDetailedSummary();
  }
  async function fetchDetailedSummary() {
    setBusy(true);
    await getDetailedSummary(
      date?.getFullYear() ?? 0,
      (date?.getMonth() ?? 0) + 1,
      date?.getDate() ?? 0
    )
      .then((res) => {
        if (res !== undefined) {
          setPersonnelConcern(res);
        }
      })
      .catch((err) => {
        setMessage({ message: err.message });
      })
      .finally(() => setBusy(false));
  }

  return (
    <Modal title='Closed Concerns' className='concern-detail' onClose={onClose}>
      <div className='modal-content-body'>
        <div className='concern-actions'>
          {personnelConcern.map((x) => (
            <ConcernDetail key={x.id} concern={x} />
          ))}
        </div>
      </div>
    </Modal>
  );
}
