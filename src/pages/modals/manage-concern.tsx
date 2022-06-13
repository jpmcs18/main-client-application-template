import React, { useEffect, useState } from 'react';
import {
  useSetBusy,
  useSetMessage,
} from '../../custom-hooks/authorize-provider';
import { Classification } from '../../entities/transaction/Classification';
import { Concern } from '../../entities/transaction/Concern';
import { Office } from '../../entities/transaction/Office';
import { getClassifications } from '../../processors/classification-process';
import { createConcern, updateConcern } from '../../processors/concern-process';
import { getOffices } from '../../processors/office-process';
import CustomDropdown, { DropdownItem } from '../components/custom-dropdown';
import CustomTextArea from '../components/custom-textarea';
import CustomTextBox from '../components/custom-textbox';
import { CustomReturn } from '../components/CustomReturn';
import Modal from './modal';

export default function ManageConcern({
  selectedConcern,
  onClose,
}: {
  selectedConcern: Concern | undefined;
  onClose: (hasChange: boolean) => void;
}) {
  console.log(selectedConcern);
  const [concern, setConcern] = useState<Concern>(
    () =>
      selectedConcern ?? {
        id: 0,
        entryDate: undefined,
        caller: '',
        description: '',
        classification: undefined,
        classificationId: undefined,
        closedDate: undefined,
        officeId: undefined,
        office: undefined,
        personnel: undefined,
        personnelId: undefined,
      }
  );
  const [classifications, setClassifications] = useState<Classification[]>([]);
  const [offices, setOffices] = useState<Office[]>([]);
  const [classificationItem, setClassificationItem] = useState<DropdownItem[]>(
    () => []
  );
  const [officeItem, setOfficeItem] = useState<DropdownItem[]>(() => []);
  const setBusy = useSetBusy();
  const setMessage = useSetMessage();

  useEffect(
    () => {
      initializeComponents();
    },
    // eslint-disable-next-line
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
          setClassifications(() => res);
          setClassificationItem(() => [
            { key: '', value: '' },
            ...res.map((r) => {
              return { key: r.id.toString(), value: r.description };
            }),
          ]);
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
          setOffices(() => res);
          setOfficeItem(() => [
            { key: '', value: '' },
            ...res.map((r) => {
              return { key: r.id.toString(), value: r.description };
            }),
          ]);
        }
      })
      .catch((err) => {
        setMessage({ message: err.message });
      })
      .finally(() => setBusy(false));
  }
  async function saveData() {
    setBusy(true);
    console.log(concern);
    if (concern.id === 0) {
      await createConcern(concern!)
        .then(() => {
          setMessage({
            message: 'New Concern Added',
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
      await updateConcern(concern)
        .then(() => {
          setMessage({
            message: 'Concern Updated',
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

  function onChange({ elementName, value }: CustomReturn) {
    if (elementName === 'office') {
      let office = offices.filter((x) => x.id === +value)?.[0];
      setConcern((prev) => {
        if (prev === undefined)
          return { office: office, officeId: office.id } as Concern;
        return { ...prev, office: office, officeId: office.id };
      });
      return;
    }
    if (elementName === 'classification') {
      let classification = classifications.filter((x) => x.id === +value)?.[0];
      setConcern((prev) => {
        if (prev === undefined)
          return {
            classification: classification,
            classificationId: classification.id,
          } as Concern;
        return {
          ...prev,
          classification: classification,
          classificationId: classification.id,
        };
      });
      return;
    }
    setConcern((prevConcern) => {
      if (prevConcern === undefined) return { [elementName]: value } as Concern;
      return { ...prevConcern, [elementName]: value };
    });
  }

  return (
    <Modal
      onClose={() => onClose(false)}
      title={(concern?.id ?? 0) > 0 ? 'Update Concern' : 'New Concern'}
      className='management-modal'>
      <div className='concern-management-modal-body modal-content-body concern-management'>
        <div>
          <div>
            <CustomDropdown
              title='Office'
              name='office'
              value={concern?.office?.description}
              onChange={onChange}
              itemsList={officeItem}
            />
          </div>
          <div>
            <CustomDropdown
              title='Classification'
              name='classification'
              value={concern?.classification?.description}
              onChange={onChange}
              itemsList={classificationItem}
            />
          </div>
          <div>
            <CustomTextBox
              title='Caller'
              name='caller'
              value={concern?.caller}
              onChange={onChange}
            />
          </div>
        </div>
        <div>
          <CustomTextArea
            title='Description'
            name='description'
            lineCount={7}
            value={concern?.description}
            onChange={onChange}
          />
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
