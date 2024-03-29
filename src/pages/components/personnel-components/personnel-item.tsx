import { useContext } from 'react';
import { Personnel } from '../../../entities/transaction/Personnel';
import { PersonnelActions } from '../../personnel-page';

export default function PersonnelItem({ personnel }: { personnel: Personnel }) {
  const action = useContext(PersonnelActions);
  return (
    <tr>
      <td>{personnel.name}</td>
      <td>{personnel.number}</td>
      <td>{personnel.office?.description}</td>
      <td>
        {personnel?.personnelClassification
          ?.map((x) => x.classification?.description)
          .join(' | ')}
      </td>
      <td className='table-actions'>
        <button
          className='btn'
          onClick={() => action({ action: 'Edit', payload: personnel })}>
          Edit
        </button>
        <button
          className='btn'
          onClick={() => action({ action: 'Delete', payload: personnel.id })}>
          Delete
        </button>
      </td>
    </tr>
  );
}
