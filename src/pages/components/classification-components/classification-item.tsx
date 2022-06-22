import { useContext } from 'react';
import { Classification } from '../../../entities/transaction/Classification';
import { ClassificationActions } from '../../classification-page';

export default function ClassificationItem({
  classification,
}: {
  classification: Classification;
}) {
  const action = useContext(ClassificationActions);
  return (
    <tr>
      <td>{classification.description}</td>
      <td className='table-actions'>
        <button
          className='btn'
          onClick={() => action({ action: 'Edit', payload: classification })}>
          Edit
        </button>
        <button
          className='btn'
          onClick={() =>
            action({ action: 'Delete', payload: classification.id })
          }>
          Delete
        </button>
      </td>
    </tr>
  );
}
