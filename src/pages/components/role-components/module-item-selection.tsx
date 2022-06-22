import { useContext } from 'react';
import { Module } from '../../../entities/user/Module';
import { RoleManagementActions } from '../../modals/manage-role';
import CustomCheckBox from '../custom-check-box';

export default function ModuleItemSelection({ module }: { module: Module }) {
  const action = useContext(RoleManagementActions);
  return (
    <tr>
      <td className='left-content'>
        {module.viewOnly ? (
          <div>{module.description}</div>
        ) : (
          <CustomCheckBox
            checkChange={() => {
              action({ action: 'Check', payload: module });
            }}
            id={module.id.toString()}
            text={module.description}
            isCheck={module?.checked ?? false}
          />
        )}
      </td>
    </tr>
  );
}
