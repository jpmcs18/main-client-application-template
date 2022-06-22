import React, { useEffect, useState } from 'react';
import {
  useSetBusy,
  useSetMessage,
} from '../../custom-hooks/authorize-provider';
import { Classification } from '../../entities/transaction/Classification';
import { Concern } from '../../entities/transaction/Concern';
import { Office } from '../../entities/transaction/Office';
import { Personnel } from '../../entities/transaction/Personnel';
import { getClassifications } from '../../processors/classification-process';
import { createConcern, updateConcern } from '../../processors/concern-process';
import { getOffices } from '../../processors/office-process';
import {
  getAvailablePersonnelsByClassification,
  getPersonnels,
} from '../../processors/personnel-process';
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
  const [personnelItem, setPersonnelItem] = useState<DropdownItem[]>([]);
  const [availabelPersonnelItem, setAvailabelPersonnelItem] = useState<
    DropdownItem[]
  >([]);
  const [personnels, setPersonnels] = useState<Personnel[]>([]);
  const [selectedPersonnel, setSelectedPersonnel] = useState<
    Personnel | undefined
  >();
  const [selectedAvailablePersonnel, setSelectedAvailablePersonnel] = useState<
    Personnel | undefined
  >();
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
    await fetchAvailablePersonnels();
    await fetchPersonnels();
  }
  async function fetchPersonnels() {
    setBusy(true);
    await getPersonnels()
      .then((res) => {
        if (res !== undefined) {
          setPersonnels(res);
          setPersonnelItem([
            {
              key: '',
              value: '',
            },
            ...res.map((x) => {
              return {
                key: x.id.toString(),
                value: x.name,
              };
            }),
          ]);
        }
      })
      .catch((err) => {
        setMessage({ message: err.message });
      })
      .finally(() => setBusy(false));
  }
  async function fetchAvailablePersonnels(
    classificationId?: number | undefined
  ) {
    setBusy(true);
    await getAvailablePersonnelsByClassification(
      classificationId ?? concern?.classificationId ?? 0
    )
      .then((res) => {
        if (res !== undefined) {
          setSelectedAvailablePersonnel(undefined);
          setAvailabelPersonnelItem([
            {
              key: '',
              value: '',
            },
            ...res.map((x) => {
              return {
                key: x.id.toString(),
                value: x.name,
              };
            }),
          ]);
        }
      })
      .catch((err) => {
        setMessage({ message: err.message });
      })
      .finally(() => setBusy(false));
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
    if (concern.id === 0) {
      await createConcern(
        concern!,
        selectedPersonnel?.id ?? selectedAvailablePersonnel?.id
      )
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

  async function onChange({ elementName, value }: CustomReturn) {
    if (elementName === 'personnel') {
      setSelectedPersonnel(personnels.filter((x) => x.id === +value)?.[0]);
      setSelectedAvailablePersonnel(undefined);
      return;
    }
    if (elementName === 'available-personnel') {
      setSelectedAvailablePersonnel(
        personnels.filter((x) => x.id === +value)?.[0]
      );
      setSelectedPersonnel(undefined);
      return;
    }
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

      await fetchAvailablePersonnels(classification?.id);
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
        {!concern.id && (
          <div>
            <div>
              <CustomDropdown
                title='Available Personnel'
                name='available-personnel'
                value={selectedAvailablePersonnel?.name}
                onChange={onChange}
                itemsList={availabelPersonnelItem}
              />
              <CustomDropdown
                title='All Personnel'
                name='personnel'
                value={selectedPersonnel?.name}
                onChange={onChange}
                itemsList={personnelItem}
              />
              <div></div>
            </div>
          </div>
        )}
      </div>
      <div className='modal-footer'>
        <button onClick={saveData} className='btn-modal btn-primary'>
          SAVE
        </button>
      </div>
    </Modal>
  );
}
