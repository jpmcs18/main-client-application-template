import { useState } from 'react';
import {
  useSetBusy,
  useSetMessage,
} from '../../custom-hooks/authorize-provider';
import { PersonnelConcern } from '../../entities/transaction/PersonnelConcern';
import { resolvePersonnelConcern } from '../../processors/personnel-concern-process';
import CustomTextArea from '../components/custom-textarea';
import Modal from './modal';

export default function ResolveConcern({
  personnelConcern,
  onClose,
}: {
  personnelConcern: PersonnelConcern | undefined;
  onClose: (hasChange: boolean) => void;
}) {
  const [actionTaken, setActionTaken] = useState<string>('');
  const setBusy = useSetBusy();
  const setMessage = useSetMessage();
  async function saveData() {
    setBusy(true);
    await resolvePersonnelConcern(personnelConcern?.id ?? 0, actionTaken)
      .then((res) => {
        if (res)
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
    <Modal
      onClose={() => {
        onClose(false);
      }}
      title='Resolve Concern'>
      <div className='modal-content-body'>
        <div>
          <CustomTextArea
            title='Action Taken'
            lineCount={5}
            onChange={(data) => {
              setActionTaken(data.value);
            }}
          />
        </div>
      </div>
      <div className='modal-footer'>
        <button onClick={saveData} className='btn-modal btn-primary'>
          RESOLVE
        </button>
      </div>
    </Modal>
  );
}
