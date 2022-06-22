import { createContext, useEffect, useState } from 'react';
import {
  useSetBusy,
  useSetMessage,
} from '../../custom-hooks/authorize-provider';
import { Module } from '../../entities/user/Module';
import { Role } from '../../entities/user/Role';
import { getModules } from '../../processors/module-process';
import { createRole, updateRole } from '../../processors/role-process';
import CustomTextBox from '../components/custom-textbox';
import { CustomReturn } from '../components/CustomReturn';
import ModuleSelection from '../components/role-components/module-selection';
import Modal from './modal';

type RoleManagementAction = { action: 'Check'; payload: Module };
export const RoleManagementActions = createContext<
  (action: RoleManagementAction) => void
>(() => {});
export const Modules = createContext<Module[]>([]);
export default function ManageRole({
  selectedRole,
  onClose,
  viewOnly,
}: {
  selectedRole: Role | undefined;
  onClose: (hasChanges: boolean) => void;
  viewOnly: boolean;
}) {
  const [role, setRole] = useState<Role>(
    () =>
      selectedRole ?? {
        id: 0,
        description: '',
        accesses: [],
      }
  );
  const [modules, setModules] = useState<Module[]>([]);
  const setBusy = useSetBusy();
  const setMessage = useSetMessage();
  useEffect(
    () => {
      initializeComponents();
    },
    //eslint-disable-next-line
    []
  );
  async function initializeComponents() {
    await fetchModules();
  }
  async function saveData() {
    setBusy(true);
    if (role.id === 0) {
      await createRole(
        role.description,
        modules.filter((x) => x.checked).map((x) => x.id)
      )
        .then(() => {
          setMessage({
            message: 'Role Added',
            onOk: () => {
              onClose(true);
            },
          });
        })
        .catch((err) => {
          setMessage({ message: err.message });
        })
        .finally(() => setBusy(false));
    } else {
      await updateRole(
        role.id,
        role.description,
        modules
          .filter((x) => x.checked && x.accessId === undefined)
          .map((x) => x.id),
        modules
          .filter((x) => !x.checked && x.accessId !== undefined)
          .map((x) => x.accessId ?? 0)
      )
        .then(() => {
          setMessage({
            message: 'Role Updated',
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
  }
  function onChange(data: CustomReturn) {
    setRole((r) => {
      return { ...r, [data.elementName]: data.value };
    });
  }
  async function roleManagement(action: RoleManagementAction) {
    switch (action.action) {
      case 'Check':
        setModules(
          modules.map((x) => {
            if (x.id === action.payload.id) {
              x.checked = !x.checked;
            }
            return x;
          })
        );
        break;
    }
  }
  async function fetchModules() {
    setBusy(true);
    await getModules()
      .then((res) => {
        if (res !== undefined) {
          let resMod = res.map((module) => {
            const mod = role.accesses?.filter(
              (acc) => acc.moduleId === module.id
            )?.[0];
            if (mod !== undefined) {
              module.checked = true;
              module.accessId = mod.id;
            }
            return module;
          });

          if (viewOnly) {
            resMod = resMod
              .filter((x) => x.accessId !== undefined)
              .map((x) => {
                x.viewOnly = true;
                return x;
              });
          }
          setModules(resMod);
        }
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
      title={
        viewOnly ? 'Role' : !!selectedRole?.id ? 'Update Role' : 'Add New Role'
      }>
      <div className='concern-management-modal-body modal-content-body concern-management'>
        <CustomTextBox
          title='Description'
          name='description'
          value={role.description}
          onChange={onChange}
          readonly={viewOnly}
        />
      </div>
      <div>
        <Modules.Provider value={modules}>
          <RoleManagementActions.Provider value={roleManagement}>
            <ModuleSelection />
          </RoleManagementActions.Provider>
        </Modules.Provider>
      </div>
      {!viewOnly && (
        <div className='modal-footer'>
          <button onClick={saveData} className='btn-modal btn-primary'>
            SAVE
          </button>
        </div>
      )}
    </Modal>
  );
}
