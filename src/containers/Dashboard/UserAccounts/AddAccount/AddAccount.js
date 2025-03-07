import React, { memo, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { submit, isDirty } from 'redux-form';
import PATHS from '@/containers/Dashboard/constants/paths';
import history from '@/history';
import { addAccount } from '@/redux/ducks/accounts.duck';
import SectionHeader from '@/components/SectionHeader';
import { ACCOUNT_FORM } from '@/constants/forms';
import { MANAGEMENT_PERMISSIONS } from '@/constants/claimTypes';
import ConfirmModal from '@/components/ConfirmModal';

import AccountForm from '../AccountForm';

import styles from './addAccount.module.scss';

const AddAccount = () => {
  const [openModal, setOpenModal] = useState(false);
  const [isAdding, setAddStatus] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const intl = useIntl();
  const dispatch = useDispatch();
  const isFormDirty = useSelector(isDirty(ACCOUNT_FORM));

  const toggleModal = () => {
    setOpenModal(!openModal);
  };

  const handleBackButtonClick = () => {
    if (isFormDirty) {
      toggleModal();
    } else {
      history.push(PATHS.USER_ACCOUNTS);
    }
  };

  const handleSubmitButtonClick = e => {
    e.preventDefault();
    dispatch(submit(ACCOUNT_FORM));
  };

  const handleFormSubmit = formValues => {
    if (
      formValues.permissions &&
      formValues.permissions[MANAGEMENT_PERMISSIONS] &&
      formValues.permissions[MANAGEMENT_PERMISSIONS].length === 0
    ) {
      setErrorMessage('USER_ACCOUNT.ADD_ACCOUNT.ERROR.PERMISSIONS.INVALID');
    } else {
      setErrorMessage('');
      setAddStatus(true);
      dispatch(
        addAccount({ data: formValues, callback: () => setAddStatus(false) }),
      );
    }
  };

  const handleModalOk = () => {
    history.push(PATHS.USER_ACCOUNTS);
  };

  return (
    <>
      <div className={styles.container}>
        <SectionHeader
          title={intl.formatMessage({ id: 'USER_ACCOUNT.ADD_ACCOUNT.TITLE' })}
          actions={{
            closeButtonProps: {
              children: intl.formatMessage({
                id: 'USER_ACCOUNT.ADD_ACCOUNT.ACTIONS.CLOSE',
              }),
              onClick: handleBackButtonClick,
            },
            submitButtonProps: {
              children: intl.formatMessage({
                id: 'USER_ACCOUNT.ADD_ACCOUNT.ACTIONS.SUBMIT',
              }),
              onClick: handleSubmitButtonClick,
              disabled: isAdding || !isFormDirty,
            },
          }}
        />
        <div className={styles.content}>
          <AccountForm onSubmit={handleFormSubmit} />
          {errorMessage ? (
            <p className={styles.error}>
              {intl.formatMessage({ id: errorMessage })}
            </p>
          ) : null}
        </div>
      </div>
      <ConfirmModal
        toggle={toggleModal}
        open={openModal}
        okButtonProps={{ onClick: handleModalOk }}
      >
        {intl.formatMessage({
          id: 'FORM.CONFIRM_MODAL_UNSAVED.DESCRIPTION',
        })}
      </ConfirmModal>
    </>
  );
};

export default memo(AddAccount);
