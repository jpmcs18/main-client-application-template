import { useState } from 'react';
import {
  useSetBusy,
  useSetMessage,
} from '../../custom-hooks/authorize-provider';
import { Classification } from '../../entities/transaction/Classification';
import {
  createClassification,
  updateClassification,
} from '../../processors/classification-process';
import CustomTextBox from '../components/custom-textbox';
import { CustomReturn } from '../components/CustomReturn';
import Modal from './modal';

export default function ManageClassification({
  selectedClassification,
  onClose,
}: {
  selectedClassification: Classification | undefined;
  onClose: (hasChanges: boolean) => void;
}) {
  const [classification, setClassification] = useState<Classification>(
    () =>
      selectedClassification ?? {
        id: 0,
        description: '',
      }
  );
  const setBusy = useSetBusy();
  const setMessage = useSetMessage();
  async function saveData() {
    setBusy(true);
    if (classification.id === 0) {
      await createClassification(classification)
        .then(() => {
          setMessage({
            message: 'Classification Added',
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
      await updateClassification(classification)
        .then(() => {
          setMessage({
            message: 'Classification Updated',
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
  function onChange(data: CustomReturn) {
    setClassification((r) => {
      return { ...r, [data.elementName]: data.value };
    });
  }
  return (
    <Modal
      onClose={() => {
        onClose(false);
      }}
      title={
        !!selectedClassification?.id
          ? 'Update Classificaiton'
          : 'Add New Classificaiton'
      }>
      <div className='concern-management-modal-body modal-content-body concern-management'>
        <CustomTextBox
          title='Description'
          name='description'
          value={classification.description}
          onChange={onChange}
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
