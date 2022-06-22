import { useState } from 'react';
import {
  useSetBusy,
  useSetMessage,
} from '../../custom-hooks/authorize-provider';
import { Office } from '../../entities/transaction/Office';
import { createOffice, updateOffice } from '../../processors/office-process';
import CustomTextBox from '../components/custom-textbox';
import { CustomReturn } from '../components/CustomReturn';
import Modal from './modal';

export default function ManageOffice({
  selectedOffice,
  onClose,
}: {
  selectedOffice: Office | undefined;
  onClose: (hasChanges: boolean) => void;
}) {
  const [office, setOffice] = useState<Office>(
    () =>
      selectedOffice ?? {
        id: 0,
        description: '',
        abbreviation: '',
      }
  );
  const setBusy = useSetBusy();
  const setMessage = useSetMessage();
  async function saveData() {
    setBusy(true);
    if (office.id === 0) {
      await createOffice(office)
        .then(() => {
          setMessage({
            message: 'Office Added',
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
      await updateOffice(office)
        .then(() => {
          setMessage({
            message: 'Office Updated',
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
    setOffice((r) => {
      return { ...r, [data.elementName]: data.value };
    });
  }
  return (
    <Modal
      onClose={() => {
        onClose(false);
      }}
      title={!!selectedOffice?.id ? 'Update Office' : 'Add New Office'}>
      <div className='concern-management-modal-body modal-content-body concern-management'>
        <CustomTextBox
          title='Description'
          name='description'
          value={office.description}
          onChange={onChange}
        />
        <CustomTextBox
          title='Abbreviation'
          name='abbreviation'
          value={office.abbreviation}
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
