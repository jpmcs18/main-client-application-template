import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faTrash, faUndo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import {
  useSetBusy,
  useSetMessage,
} from '../../custom-hooks/authorize-provider';
import { Personnel } from '../../entities/transaction/Personnel';
import { PersonnelClassification } from '../../entities/transaction/PersonnelClassification';
import { getClassifications } from '../../processors/classification-process';
import { getOffices } from '../../processors/office-process';
import {
  createPersonnel,
  updatePersonnel,
} from '../../processors/personnel-process';
import CustomDropdown, { DropdownItem } from '../components/custom-dropdown';
import CustomTextBox from '../components/custom-textbox';
import { CustomReturn } from '../components/CustomReturn';
import Modal from './modal';

export default function ManagePersonnel({
  selectedPersonnel,
  onClose,
}: {
  selectedPersonnel: Personnel | undefined;
  onClose: (hasChanges: boolean) => void;
}) {
  const [personnel, setPersonnel] = useState<Personnel>(
    () =>
      selectedPersonnel ?? {
        id: 0,
        classificationId: undefined,
        officeId: undefined,
        name: '',
        number: '',
      }
  );
  const [classificationItem, setClassificationItem] = useState<DropdownItem[]>(
    []
  );
  const [officeItem, setOfficeItem] = useState<DropdownItem[]>([]);
  const [personnelClassification, setPersonnelClassification] = useState<
    PersonnelClassification[]
  >(() => personnel?.personnelClassification ?? []);
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
    await fetchClassifications();
    await fetchOffices();
  }
  async function fetchClassifications() {
    setBusy(true);
    await getClassifications()
      .then((res) => {
        if (res !== undefined) {
          setClassificationItem(() =>
            res.map((r) => {
              return { key: r.id.toString(), value: r.description };
            })
          );
        }
      })
      .catch((err) => {
        setMessage({ message: err.message });
      })
      .finally(() => setBusy(false));
  }
  async function fetchOffices() {
    setBusy(true);
    await getOffices()
      .then((res) => {
        if (res !== undefined) {
          setOfficeItem(() =>
            res.map((r) => {
              return { key: r.id.toString(), value: r.description };
            })
          );
        }
      })
      .catch((err) => {
        setMessage({ message: err.message });
      })
      .finally(() => setBusy(false));
  }
  async function saveData() {
    setBusy(true);
    if (personnel.id === 0) {
      await createPersonnel(
        personnel,
        personnelClassification.map((x) => x.classificationId)
      )
        .then(() => {
          setMessage({
            message: 'Personnel Added',
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
      await updatePersonnel(
        personnel,
        personnelClassification
          .filter((x) => x.id === 0)
          .map((x) => x.classificationId),
        personnelClassification.filter((x) => x.deleted).map((x) => x.id)
      )
        .then(() => {
          setMessage({
            message: 'Personnel Updated',
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
  function onChange({ value, elementName, text }: CustomReturn) {
    if (elementName === 'classification') {
      console.log(value);
      if (value === undefined) {
        return;
      }
      setPersonnelClassification((r) => [
        ...r,
        {
          id: 0,
          classificationId: +value,
          classificationDesc: text,
          personnelId: personnel.id,
        },
      ]);
      setClassificationItem((r) => r.filter((x) => x.key !== value));
      return;
    }
    setPersonnel((r) => {
      return { ...r, [elementName]: value };
    });
  }
  function undoDeleteClassification(classification: PersonnelClassification) {
    setPersonnelClassification((res) =>
      res.map((x) => {
        if (x.classificationId === classification.classificationId)
          x.deleted = false;
        return x;
      })
    );
  }
  function deleteClassification(classification: PersonnelClassification) {
    setPersonnelClassification((res) => {
      if (classification.id === 0) {
        return res.filter(
          (x) => x.classificationId !== classification.classificationId
        );
      }
      return res.map((x) => {
        if (x.classificationId === classification.classificationId)
          x.deleted = true;
        return x;
      });
    });
    if (classification.id === 0) {
      setClassificationItem([
        ...classificationItem,
        {
          key: classification.classificationId?.toString() ?? '',
          value:
            classification.classificationDesc ??
            classification.classification?.description ??
            '',
        },
      ]);
    }
  }
  return (
    <Modal
      onClose={() => {
        onClose(false);
      }}
      title={
        !!selectedPersonnel?.id ? 'Update Personnel' : 'Add New Personnel'
      }>
      <div className='concern-management-modal-body modal-content-body concern-management'>
        <CustomTextBox
          title='Name'
          name='name'
          value={personnel.name}
          onChange={onChange}
        />
        <CustomTextBox
          title='Mobile Number'
          name='number'
          type='tel'
          value={personnel.number}
          onChange={onChange}
        />
        <CustomDropdown
          title='Office'
          name='officeId'
          hasDefault={true}
          value={personnel?.officeId}
          onChange={onChange}
          itemsList={officeItem}
        />
        <div>
          <CustomDropdown
            title='Classifications'
            name='classification'
            hasDefault={true}
            onChange={onChange}
            itemsList={classificationItem}
          />
        </div>
        <div className='table-container'>
          <table className='item-table'>
            <thead>
              <tr>
                <th>User Roles</th>
              </tr>
            </thead>
            <tbody>
              {personnelClassification?.map((classification) => (
                <tr
                  key={classification.classificationId}
                  className={classification.deleted ? 'deleted' : ''}>
                  <td>
                    {classification.classificationDesc ??
                      classification.classification?.description}
                  </td>
                  <td className='table-actions'>
                    {classification.deleted && (
                      <FontAwesomeIcon
                        icon={faUndo as IconProp}
                        className='action-icon table-icon-button'
                        onClick={() => {
                          undoDeleteClassification(classification);
                        }}
                        title='Undo'
                      />
                    )}
                    {!classification.deleted && (
                      <FontAwesomeIcon
                        icon={faTrash as IconProp}
                        className='action-icon table-icon-button'
                        onClick={() => {
                          deleteClassification(classification);
                        }}
                        title='Delete'
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className='modal-footer'>
        <button onClick={saveData} className='btn-modal btn-primary'>
          SAVE
        </button>
      </div>
    </Modal>
  );
}
