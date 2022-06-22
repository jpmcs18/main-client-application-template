import { useEffect, useState } from 'react';
import {
  useSetBusy,
  useSetMessage,
} from '../../custom-hooks/authorize-provider';
import { Classification } from '../../entities/transaction/Classification';
import { Personnel } from '../../entities/transaction/Personnel';
import { getClassifications } from '../../processors/classification-process';
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
        classification: undefined,
        classificationId: undefined,
        name: '',
      }
  );
  const [classifications, setClassifications] = useState<Classification[]>([]);
  const [classificationItem, setClassificationItem] = useState<DropdownItem[]>(
    []
  );
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
  }
  async function fetchClassifications() {
    setBusy(true);
    await getClassifications()
      .then((res) => {
        if (res !== undefined) {
          setClassifications(() => res);
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
    if (elementName === 'classification') {
      let classification = classifications.filter((x) => x.id === +value)?.[0];
      setPersonnel((prev) => {
        if (prev === undefined)
          return {
            classification: classification,
            classificationId: classification.id,
          } as Personnel;
        return {
          ...prev,
          classification: classification,
          classificationId: classification.id,
        };
      });
      return;
    }
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
          name='classification'
          value={personnel?.classification?.description}
          onChange={onChange}
          itemsList={classificationItem}
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
