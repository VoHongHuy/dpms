import React, { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { permissionsGuard } from '@/HOCs';
import { TextArea } from '@/components/Form';
import { PERMISSIONS } from '@/constants/userAccounts';
import Button from '@/components/Button';
import { useDispatch } from 'react-redux';
import { createNoteResult, updateNoteResult } from '@/redux/ducks/results.duck';

import styles from './resultNoteControl.module.scss';

const ResultNoteControl = ({
  data,
  countyId,
  municipalityId,
  settlementId,
  electionUnitNumber,
  refresh,
}) => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const [formValues, setFormValues] = useState(data);
  useEffect(() => {
    setFormValues(data);
  }, [data]);

  const handleInputChange = ({ target: { name, value } }) => {
    setFormValues({ ...formValues, [name]: value });
  };

  const clearFormValues = () => {
    setFormValues({});
  };

  const updateNote = () => {
    if (!formValues.id) {
      dispatch(createNoteResult({
        data: {
          note: formValues.note,
          countyId,
          municipalityId,
          settlementId,
          electionUnitNumber,
        },
        callback: () => {
          refresh();
          clearFormValues();
        },
      }));
    } else if (data !== formValues) {
      dispatch(updateNoteResult({
        data: {
          id: formValues.id,
          note: formValues.note,
        },
        callback: () => {
          refresh();
          clearFormValues();
        },
      }));
    } else {
      clearFormValues();
    }
  };

  return (
    <form className={styles.container} autoComplete="off">
      <div className={styles.formControl}>
        <TextArea
          name="note"
          className={styles.input}
          placeholder={intl.formatMessage({
            id: 'RESULT.RESULT_DETAILS.TABS.NOTES.CONTROLS.NOTE',
          })}
          autoComplete="off"
          onChange={handleInputChange}
          value={formValues.note}
          rows="1"
        />
      </div>
      <div className={styles.actions}>
        <Button
          type="button"
          onClick={updateNote}
          className={styles.button}
          disabled={!formValues.note}
        >
          {!formValues.id ? intl.formatMessage({
            id: 'RESULT.RESULT_DETAILS.TABS.NOTES.CONTROLS.ADD',
          }) : intl.formatMessage({
            id: 'RESULT.RESULT_DETAILS.TABS.NOTES.CONTROLS.UPDATE',
          })}
        </Button><br />
        <Button
          type="button"
          onClick={clearFormValues}
          className={`${styles.button} ${styles.clearButton}`}
          disabled={!formValues.note}
        >
          {intl.formatMessage({
            id: 'RESULT.RESULT_DETAILS.TABS.NOTES.CONTROLS.CLEAR',
          })}
        </Button>
      </div>
    </form>
  );
};

ResultNoteControl.defaultProps = {
  data: null,
  countyId: undefined,
  municipalityId: undefined,
  settlementId: undefined,
  electionUnitNumber: undefined,
};

ResultNoteControl.propTypes = {
  data: PropTypes.object,
  countyId: PropTypes.number,
  municipalityId: PropTypes.number,
  settlementId: PropTypes.number,
  electionUnitNumber: PropTypes.number,
  refresh: PropTypes.func.isRequired,
};

export default memo(permissionsGuard(
  [PERMISSIONS.MODIFY_RESULT.value],
  ResultNoteControl,
  false,
));
