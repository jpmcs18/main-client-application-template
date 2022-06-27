import { useEffect, useRef } from 'react';
import {
  useMessage,
  useSetCloseMessageDialog,
  useUpdateAuthorize,
} from '../../custom-hooks/authorize-provider';
import Modal from './modal';

export default function MessageDialog() {
  const closeDialog = useSetCloseMessageDialog();
  const Message = useMessage();
  const updateAuthorize = useUpdateAuthorize();
  const ref = useRef<HTMLButtonElement>(null);

  function handleClose() {
    closeDialog();
  }

  function ok() {
    if (Message?.message === 'Unauthorized') updateAuthorize(false);
    closeDialog();
    Message?.onOk?.();
  }
  useEffect(
    () => {
      ref?.current?.focus();
    },
    //eslint-disable-next-line
    []
  );

  return (
    <Modal>
      <div className='modal-content-body'>
        <p>{Message?.message}</p>
      </div>
      <div className='modal-footer'>
        <button onClick={ok} className='btn-modal btn-primary' ref={ref}>
          {(Message?.action === undefined ||
            Message?.action === 'OKCANCEL') && <span>OK</span>}
          {Message?.action === 'YESNO' && <span>YES</span>}
        </button>
        <button onClick={handleClose} className='btn-modal btn-secondary '>
          {Message?.action === 'OKCANCEL' && <span>CANCEL</span>}
          {Message?.action === 'YESNO' && <span>NO</span>}
        </button>
      </div>
    </Modal>
  );
}
