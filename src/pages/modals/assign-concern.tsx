import React, { useEffect, useState } from 'react';
import {
  useSetBusy,
  useSetMessage,
} from '../../custom-hooks/authorize-provider';
import { Concern } from '../../entities/transaction/Concern';
import { Personnel } from '../../entities/transaction/Personnel';
import { assignConcern } from '../../processors/concern-process';
import {
  getAvailablePersonnelsByClassification,
  getPersonnels,
  getPersonnelsByClassification,
} from '../../processors/personnel-process';
import CustomDropdown, { DropdownItem } from '../components/custom-dropdown';
import { CustomReturn } from '../components/CustomReturn';
import Modal from './modal';

export default function AssignConcern({
  title,
  onClose,
  concern,
}: {
  title?: string;
  onClose: (hasChanges: boolean) => void;
  concern: Concern | undefined;
}) {
  const [personnelItem, setPersonnelItem] = useState<DropdownItem[]>([]);
  const [availabelPersonnelItem, setAvailabelPersonnelItem] = useState<
    DropdownItem[]
  >([]);
  const [personnels, setPersonnels] = useState<Personnel[]>([]);
  const [selectedPersonnel, setSelectedPersonnel] = useState<
    Personnel | undefined
  >();
  const [selectedAvailablePersonnel, setSelectedAvailablePersonnel] = useState<
    Personnel | undefined
  >();
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
    await fetchAvailablePersonnels();
    await fetchPersonnels();
  }
  async function fetchPersonnels() {
    setBusy(true);
    await getPersonnelsByClassification(concern?.classificationId ?? 0)
      .then((res) => {
        if (res !== undefined) {
          setPersonnels(res);
          setPersonnelItem([
            {
              key: '',
              value: '',
            },
            ...res.map((x) => {
              return {
                key: x.id.toString(),
                value: x.name,
              };
            }),
          ]);
        }
      })
      .catch((err) => {
        setMessage({ message: err.message });
      })
      .finally(() => setBusy(false));
  }
  async function fetchAvailablePersonnels() {
    setBusy(true);
    await getAvailablePersonnelsByClassification(concern?.classificationId ?? 0)
      .then((res) => {
        if (res !== undefined) {
          setAvailabelPersonnelItem([
            {
              key: '',
              value: '',
            },
            ...res.map((x) => {
              return {
                key: x.id.toString(),
                value: x.name,
              };
            }),
          ]);
        }
      })
      .catch((err) => {
        setMessage({ message: err.message });
      })
      .finally(() => setBusy(false));
  }
  function onChange({ elementName, value }: CustomReturn) {
    if (elementName === 'personnel') {
      setSelectedPersonnel(personnels.filter((x) => x.id === +value)?.[0]);
      setSelectedAvailablePersonnel(undefined);
      return;
    }
    if (elementName === 'available-personnel') {
      setSelectedAvailablePersonnel(
        personnels.filter((x) => x.id === +value)?.[0]
      );
      setSelectedPersonnel(undefined);
      return;
    }
  }

  async function saveData() {
    setBusy(true);
    if ((selectedPersonnel?.id ?? selectedAvailablePersonnel?.id ?? 0) == 0) {
      setMessage({ message: 'Select Personnel' });
      return;
    }
    await assignConcern(
      concern?.id ?? 0,
      selectedPersonnel?.id ?? selectedAvailablePersonnel?.id ?? 0
    )
      .then(() => {
        setMessage({
          message: 'Success',
          onOk: () => {
            onClose(true);
          },
        });
      })
      .catch((err) => {
        setMessage({ message: err.message });
      })
      .finally(() => setBusy(false));
  }
  return (
    <Modal onClose={() => onClose(false)} title={title ?? 'Assign Concern'}>
      <div className='concern-management-modal-body modal-content-body'>
        <div>
          <CustomDropdown
            title='Available Personnel'
            name='available-personnel'
            value={selectedAvailablePersonnel?.name}
            onChange={onChange}
            itemsList={availabelPersonnelItem}
          />
          <CustomDropdown
            title='All Personnel'
            name='personnel'
            value={selectedPersonnel?.name}
            onChange={onChange}
            itemsList={personnelItem}
          />
        </div>
      </div>
      <div className='modal-footer'>
        <button onClick={saveData} className='btn-modal btn-primary'>
          SAVE
        </button>
      </div>
    </Modal>
  );
}
