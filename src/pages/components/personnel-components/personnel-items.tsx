import { useContext } from 'react';
import { PersonnelActions, PersonnelList } from '../../personnel-page';
import PersonnelItem from './personnel-item';

export default function PersonnelItems() {
  const action = useContext(PersonnelActions);
  const personnels = useContext(PersonnelList);
  return (
    <table className='item-table'>
      <thead>
        <tr>
          <th>Name</th>
          <th>Classification</th>
        </tr>
        <tr>
          <th colSpan={10}>
            <button
              className='btn'
              onClick={() => {
                action({ action: 'Add' });
              }}>
              Add New Personnel
            </button>
          </th>
        </tr>
      </thead>
      <tbody>
        {personnels.map((personnel) => (
          <PersonnelItem key={personnel.id} personnel={personnel} />
        ))}
      </tbody>
    </table>
  );
}
