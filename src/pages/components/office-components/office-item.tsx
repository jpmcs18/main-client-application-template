import { useContext } from 'react';
import { Office } from '../../../entities/transaction/Office';
import { OfficeActions } from '../../office-page';

export default function OfficeItem({ office }: { office: Office }) {
  const action = useContext(OfficeActions);
  return (
    <tr>
      <td>{office.description}</td>
      <td>{office.abbreviation}</td>
      <td className='table-actions'>
        <button
          className='btn'
          onClick={() => action({ action: 'Edit', payload: office })}>
          Edit
        </button>
        <button
          className='btn'
          onClick={() => action({ action: 'Delete', payload: office.id })}>
          Delete
        </button>
      </td>
    </tr>
  );
}
