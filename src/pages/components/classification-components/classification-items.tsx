import { useContext } from 'react';
import {
  ClassificationActions,
  ClassificationList,
} from '../../classification-page';
import ClassificationItem from './classification-item';

export default function ClassificationItems() {
  const action = useContext(ClassificationActions);
  const classifications = useContext(ClassificationList);
  return (
    <table className='item-table'>
      <thead>
        <tr>
          <th>Description</th>
        </tr>
        <tr>
          <th colSpan={10}>
            <button
              className='btn'
              onClick={() => {
                action({ action: 'Add' });
              }}>
              Add New Classification
            </button>
          </th>
        </tr>
      </thead>
      <tbody>
        {classifications.map((classification) => (
          <ClassificationItem
            key={classification.id}
            classification={classification}
          />
        ))}
      </tbody>
    </table>
  );
}
