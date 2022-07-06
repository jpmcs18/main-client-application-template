import { useEffect, useState } from 'react';
import {
  useSetBusy,
  useSetMessage,
} from '../../custom-hooks/authorize-provider';
import { Concern } from '../../entities/transaction/Concern';
import { getClassifications } from '../../processors/classification-process';
import { createConcern, updateConcern } from '../../processors/concern-process';
import { getOffices } from '../../processors/office-process';
import {
  getAvailablePersonnelsByClassification,
  getPersonnels,
} from '../../processors/personnel-process';
import CustomDropdown, { DropdownItem } from '../components/custom-dropdown';
import CustomTextArea from '../components/custom-textarea';
import CustomTextBox from '../components/custom-textbox';
import { CustomReturn } from '../components/CustomReturn';
import Modal from './modal';

export default function ManageConcern({
  selectedConcern,
  onClose,
}: {
  selectedConcern: Concern | undefined;
  onClose: (hasChange: boolean, personnel: string) => void;
}) {
  const [concern, setConcern] = useState<Concern>(
    () =>
      selectedConcern ?? {
        id: 0,
        caller: '',
        description: '',
        classificationId: undefined,
        officeId: undefined,
      }
  );
  const [classificationItem, setClassificationItem] = useState<DropdownItem[]>(
    () => []
  );
  const [officeItem, setOfficeItem] = useState<DropdownItem[]>(() => []);
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
    await fetchClassifications();
    await fetchOffices();
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
  async function fetchAvailablePersonnels(
    classificationId?: number | undefined
  ) {
    console.log(classificationId);
    setBusy(true);
    await getAvailablePersonnelsByClassification(
      classificationId ?? concern?.classificationId ?? 0
    )
      .then((res) => {
        if (res !== undefined) {
          setSelectedAvailablePersonnel(undefined);
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
    if (concern.id === 0) {
      await createConcern(
        concern,
        selectedPersonnel ?? selectedAvailablePersonnel
      )
        .then(() => {
          setMessage({
            message: 'New Concern Added',
            onOk: () => {
              onClose(true, selectedPersonnelName ?? '');
            },
          });
        })
        .catch((err) => {
          setMessage({ message: err.message });
        })
        .finally(() => setBusy(false));
    } else {
      await updateConcern(concern)
        .then(() => {
          setMessage({
            message: 'Concern Updated',
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
  }

  async function onChange({ elementName, value, text }: CustomReturn) {
    if (elementName === 'personnel') {
      setSelectedPersonnel(+value);
      setSelectedAvailablePersonnel(undefined);
      setSelectedPersonnelName(text);
      return;
    }
    if (elementName === 'available-personnel') {
      setSelectedAvailablePersonnel(+value);
      setSelectedPersonnel(undefined);
      setSelectedPersonnelName(text);
      return;
    }
    if (elementName === 'classificationId') {
      if (value === undefined) {
        setAvailabelPersonnelItem(() => []);
      }
      await fetchAvailablePersonnels(+value);
    }
    setConcern((prevConcern) => {
      return { ...prevConcern, [elementName]: value };
    });
  }

  return (
    <Modal
      onClose={() => onClose(false, '')}
      title={
        (concern?.id ?? 0) > 0
          ? `Update Concern ${concern.number}`
          : 'New Concern'
      }
      className='management-modal'>
      <div className='concern-management-modal-body modal-content-body concern-management'>
        <div>
          <div>
            <CustomDropdown
              title='Office'
              name='officeId'
              hasDefault={true}
              value={concern?.officeId}
              onChange={onChange}
              itemsList={officeItem}
            />
          </div>
          <div>
            <CustomDropdown
              title='Classification'
              name='classificationId'
              hasDefault={true}
              value={concern?.classificationId}
              onChange={onChange}
              itemsList={classificationItem}
            />
          </div>
          <div>
            <CustomTextBox
              title='Caller'
              name='caller'
              value={concern?.caller}
              onChange={onChange}
            />
          </div>
        </div>
        <div>
          <CustomTextArea
            title='Description'
            name='description'
            lineCount={7}
            value={concern?.description}
            onChange={onChange}
          />
        </div>
        {!concern.id && (
          <div>
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
              <div></div>
            </div>
          </div>
        )}
      </div>
      <div className='modal-footer'>
        <button onClick={saveData} className='btn-modal btn-primary'>
          SAVE
        </button>
      </div>
    </Modal>
  );
}
