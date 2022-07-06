import { useEffect, useState } from 'react';
import {
  useSetBusy,
  useSetMessage,
} from '../../custom-hooks/authorize-provider';
import { Concern } from '../../entities/transaction/Concern';
import { assignConcern } from '../../processors/concern-process';
import {
  getAvailablePersonnelsByClassification,
  getPersonnels,
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
  onClose: (hasChanges: boolean, personnel: string) => void;
  concern: Concern | undefined;
}) {
  const [personnelItem, setPersonnelItem] = useState<DropdownItem[]>([]);
  const [availabelPersonnelItem, setAvailabelPersonnelItem] = useState<
    DropdownItem[]
  >([]);
  const [selectedPersonnel, setSelectedPersonnel] = useState<
    number | undefined
  >();
  const [selectedAvailablePersonnel, setSelectedAvailablePersonnel] = useState<
    number | undefined
  >();
  const [selectedPersonnelName, setSelectedPersonnelName] = useState<
    string | undefined
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
    await getPersonnels()
      .then((res) => {
        if (res !== undefined) {
          setPersonnelItem(() =>
            res.map((x) => {
              return {
                key: x.id.toString(),
                value: x.name,
              };
            })
          );
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
          setAvailabelPersonnelItem(() =>
            res.map((x) => {
              return {
                key: x.id.toString(),
                value: x.name,
              };
            })
          );
        }
      })
      .catch((err) => {
        setMessage({ message: err.message });
      })
      .finally(() => setBusy(false));
  }
  function onChange({ elementName, value, text }: CustomReturn) {
    setSelectedPersonnelName(text);
    if (elementName === 'personnel') {
      setSelectedPersonnel(+value);
      setSelectedAvailablePersonnel(undefined);
      return;
    }
    if (elementName === 'available-personnel') {
      setSelectedAvailablePersonnel(+value);
      setSelectedPersonnel(undefined);
      return;
    }
  }

  async function saveData() {
    setBusy(true);
    if ((selectedPersonnel ?? selectedAvailablePersonnel ?? 0) === 0) {
      setMessage({ message: 'Select Personnel' });
      return;
    }
    await assignConcern(
      concern?.id ?? 0,
      selectedPersonnel ?? selectedAvailablePersonnel ?? 0
    )
      .then((res) => {
        if (res)
          setMessage({
            message: 'Success',
            onOk: () => {
              onClose(true, selectedPersonnelName ?? '');
            },
          });
      })
      .catch((err) => {
        setMessage({ message: err.message });
      })
      .finally(() => setBusy(false));
  }
  return (
    <Modal onClose={() => onClose(false, '')} title={title ?? 'Assign Concern'}>
      <div className='concern-management-modal-body modal-content-body'>
        <div>
          <CustomDropdown
            title='Available Personnel'
            name='available-personnel'
            hasDefault={true}
            value={selectedAvailablePersonnel}
            onChange={onChange}
            itemsList={availabelPersonnelItem}
          />
          <CustomDropdown
            title='All Personnel'
            name='personnel'
            hasDefault={true}
            value={selectedPersonnel}
            onChange={onChange}
            itemsList={personnelItem}
          />
        </div>
      </div>
      <div className='modal-footer'>
        <button onClick={saveData} className='btn-modal btn-primary'>
          ASSIGN
        </button>
      </div>
    </Modal>
  );
}
