/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { TextArea } from '@/components/Form';
import { hasPermissions } from '@/utils/user';
import { PERMISSIONS } from '@/constants/userAccounts';

import styles from './noteForm.module.scss';

const NoteForm = ({ notes, onUpdate }) => {
  const intl = useIntl();
  const [formValues, setFormValues] = useState({ notes });
  const [isDisabled, setIsDisabled] = useState(true);
  const [selectedNotes, setSelectedNote] = useState(notes);

  const saveNotes = (e) => {
    e.preventDefault();
    if (selectedNotes === formValues.notes) {
      setIsDisabled(true);
    } else {
      onUpdate(formValues.notes, () => {
        setIsDisabled(true);
        setSelectedNote(formValues.notes);
      });
    }
  };

  const handleInputChange = ({ target: { name, value } }) => {
    setFormValues({ ...formValues, [name]: value });
  };

  const editNotes = (e) => {
    e.preventDefault();
    setIsDisabled(false);
    setSelectedNote(formValues.notes);
  };

  return (
    <div className={styles.container}>
      <div className={styles.formLabel}>
        {intl.formatMessage(
          { id: 'ORGANIZATION.ALLOCATED_MEMBER.EDITOR.NOTE' },
        )} {hasPermissions([PERMISSIONS.MODIFY_TERRITORIAL_ORGANIZATION.value]) && (
          <>
            (
            <a
              href="#"
              onClick={isDisabled ? editNotes : saveNotes}
            >{isDisabled ? intl.formatMessage({
                id: 'ORGANIZATION.ALLOCATED_MEMBER.LIST.EDIT',
              }) : intl.formatMessage({
                id: 'ORGANIZATION.ALLOCATED_MEMBER.LIST.SAVE',
              })}
            </a>
            ):
          </>
        )}
      </div>
      <form className={styles.formControl}>
        <TextArea
          name="notes"
          className={styles.input}
          placeholder={intl.formatMessage({
            id: 'ORGANIZATION.ALLOCATED_MEMBER.EDITOR.NOTE',
          })}
          autoComplete="none"
          onChange={handleInputChange}
          value={formValues.notes}
          readOnly={isDisabled}
          disabled={isDisabled}
          rows="1"
        />
      </form>
    </div>
  );
};

NoteForm.defaultProps = {
  notes: null,
};

NoteForm.propTypes = {
  onUpdate: PropTypes.func.isRequired,
  notes: PropTypes.string,
};

export default memo(NoteForm);
