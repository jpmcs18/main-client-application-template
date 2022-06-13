import React, { useEffect, useState } from 'react';
import {
  useSetBusy,
  useSetMessage,
} from '../../custom-hooks/authorize-provider';
import { Concern } from '../../entities/transaction/Concern';
import { PersonnelConcern } from '../../entities/transaction/PersonnelConcern';
import { getActions } from '../../processors/personnel-concern-process';
import ConcernAction from '../components/concerns-components/concern-action';
import Modal from './modal';

export default function ConcernActionsViewer({
  concern,
  onClose,
}: {
  concern: Concern | undefined;
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
    await fetchActions();
  }
  async function fetchActions() {
    setBusy(true);
    await getActions(concern?.id ?? 0)
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
    <Modal title='Concern Actions' onClose={onClose}>
      <div className='modal-content-body'>
        <div className='concern-actions'>
          {personnelConcern.map((x) => (
            <ConcernAction key={x.id} action={x} />
          ))}
        </div>
      </div>
    </Modal>
  );
}
