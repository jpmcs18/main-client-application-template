import { useContext } from 'react';
import { OfficeActions, OfficeList } from '../../office-page';
import OfficeItem from './office-item';

export default function OfficeItems() {
  const action = useContext(OfficeActions);
  const offices = useContext(OfficeList);
  return (
    <table className='item-table'>
      <thead>
        <tr>
          <th>Description</th>
          <th>Abbreviation</th>
        </tr>
        <tr>
          <th colSpan={10}>
            <button
              className='btn'
              onClick={() => {
                action({ action: 'Add' });
              }}>
              Add New Office
            </button>
          </th>
        </tr>
      </thead>
      <tbody>
        {offices.map((office) => (
          <OfficeItem key={office.id} office={office} />
        ))}
      </tbody>
    </table>
  );
}
