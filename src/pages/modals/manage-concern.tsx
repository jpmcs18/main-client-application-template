import { useEffect, useState } from 'react';
import {
  useSetBusy,
  useSetMessage,
  useUserProfile,
} from '../../custom-hooks/authorize-provider';
import { Concern } from '../../entities/transaction/Concern';
import { getClassifications } from '../../processors/classification-process';
import { createConcern, updateConcern } from '../../processors/concern-process';
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
  const profile = useUserProfile();
  const [concern, setConcern] = useState<Concern>(
    () =>
      selectedConcern ?? {
        id: 0,
        caller: profile?.personnel?.name,
        description: '',
        classificationId: undefined,
        officeId: profile?.personnel?.officeId,
      }
  );
  const [classificationItem, setClassificationItem] = useState<DropdownItem[]>(
    () => []
  );
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
      </div>
      <div className='modal-footer'>
        <button onClick={saveData} className='btn-modal btn-primary'>
          SAVE
        </button>
      </div>
    </Modal>
  );
}
