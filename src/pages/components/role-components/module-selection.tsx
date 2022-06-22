import React, { useContext } from 'react';
import { Modules } from '../../modals/manage-role';
import ModuleItemSelection from './module-item-selection';

export default function ModuleSelection() {
  const modules = useContext(Modules);
  return (
    <table className='item-table'>
      <thead>
        <tr>
          <th>Module Access</th>
        </tr>
      </thead>
      <tbody>
        {modules.map((module) => (
          <ModuleItemSelection key={module.id} module={module} />
        ))}
      </tbody>
    </table>
  );
}
