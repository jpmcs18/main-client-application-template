import { useEffect, useState } from 'react';
import {
  useSetBusy,
  useSetMessage,
} from '../../custom-hooks/authorize-provider';
import { Personnel } from '../../entities/transaction/Personnel';
import { getClassifications } from '../../processors/classification-process';
import { getOffices } from '../../processors/office-process';
import {
  createPersonnel,
  updatePersonnel,
} from '../../processors/personnel-process';
import CustomDropdown, { DropdownItem } from '../components/custom-dropdown';
import CustomTextBox from '../components/custom-textbox';
import { CustomReturn } from '../components/CustomReturn';
import Modal from './modal';

export default function ManagePersonnel({
  selectedPersonnel,
  onClose,
}: {
  selectedPersonnel: Personnel | undefined;
  onClose: (hasChanges: boolean) => void;
}) {
  const [personnel, setPersonnel] = useState<Personnel>(
    () =>
      selectedPersonnel ?? {
        id: 0,
        classificationId: undefined,
        officeId: undefined,
        name: '',
      }
  );
  const [classificationItem, setClassificationItem] = useState<DropdownItem[]>(
    []
  );
  const [officeItem, setOfficeItem] = useState<DropdownItem[]>([]);
  const setBusy = useSetBusy();
  const setMessage = useSetMessage();
  useEffect(
    () => {
      initializeComponents();
    },
    //eslint-disable-next-line
    []
  );

  async function initializeComponents() {
    await fetchClassifications();
    await fetchOffices();
  }
  async function fetchClassifications() {
    setBusy(true);
    await getClassifications()
      .then((res) => {
        if (res !== undefined) {
          setClassificationItem(() =>
            res.map((r) => {
              return { key: r.id.toString(), value: r.description };
            })
          );
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
          setOfficeItem(() =>
            res.map((r) => {
              return { key: r.id.toString(), value: r.description };
            })
          );
        }
      })
      .catch((err) => {
        setMessage({ message: err.message });
      })
      .finally(() => setBusy(false));
  }
  async function saveData() {
    setBusy(true);
    if (personnel.id === 0) {
      await createPersonnel(personnel)
        .then(() => {
          setMessage({
            message: 'Personnel Added',
            onOk: () => {
              onClose(true);
            },
          });
        })
        .catch((err) => {
          setMessage({ message: err.message });
        })
        .finally(() => setBusy(false));
    } else {
      await updatePersonnel(personnel)
        .then(() => {
          setMessage({
            message: 'Personnel Updated',
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
  }
  function onChange({ value, elementName }: CustomReturn) {
    setPersonnel((r) => {
      return { ...r, [elementName]: value };
    });
  }
  return (
    <Modal
      onClose={() => {
        onClose(false);
      }}
      title={
        !!selectedPersonnel?.id ? 'Update Personnel' : 'Add New Personnel'
      }>
      <div className='concern-management-modal-body modal-content-body concern-management'>
        <CustomTextBox
          title='Name'
          name='name'
          value={personnel.name}
          onChange={onChange}
        />
        <CustomDropdown
          title='Classification'
          name='classificationId'
          hasDefault={true}
          value={personnel?.classificationId}
          onChange={onChange}
          itemsList={classificationItem}
        />
        <CustomDropdown
          title='Office'
          name='officeId'
          hasDefault={true}
          value={personnel?.officeId}
          onChange={onChange}
          itemsList={officeItem}
        />
      </div>
      <div className='modal-footer'>
        <button onClick={saveData} className='btn-modal btn-primary'>
          SAVE
        </button>
      </div>
    </Modal>
  );
}
