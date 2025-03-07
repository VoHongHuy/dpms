import React, { memo, useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { useParams } from 'react-router';
import { submit, isDirty, initialize } from 'redux-form';
import PATHS from '@/containers/Dashboard/constants/paths';
import history from '@/history';
import {
  updateAccount,
  fetchAccount,
  getAccountSelected,
  clearAccountSelected,
} from '@/redux/ducks/accounts.duck';
import Loading from '@/components/Loading';
import SectionHeader from '@/components/SectionHeader';
import { ACCOUNT_FORM } from '@/constants/forms';
import { MANAGEMENT_PERMISSIONS } from '@/constants/claimTypes';
import ConfirmModal from '@/components/ConfirmModal';

import AccountForm from '../AccountForm';

import AccountStatus from './AccountStatus';
import styles from './editAccount.module.scss';

const EditAccount = () => {
  const [isFetching, setFetchStatus] = useState(false);
  const [isUpdating, setUpdateStatus] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const { id } = useParams();
  const [errorMessage, setErrorMessage] = useState('');
  const intl = useIntl();
  const dispatch = useDispatch();
  const data = useSelector(getAccountSelected, shallowEqual);
  const isFormDirty = useSelector(isDirty(ACCOUNT_FORM));

  useEffect(() => {
    dispatch(fetchAccount({ id, callback: () => setFetchStatus(false) }));

    return () => {
      dispatch(clearAccountSelected());
    };
  }, []);

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
      setUpdateStatus(true);
      setErrorMessage('');
      dispatch(
        updateAccount({
          data: formValues,
          callback: () => {
            setUpdateStatus(false);
            dispatch(
              initialize(
                ACCOUNT_FORM,
                {
                  ...formValues,
                  permissions: formValues.permissions[MANAGEMENT_PERMISSIONS],
                },
                false,
              ),
            );
          },
        }),
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
          title={intl.formatMessage({ id: 'USER_ACCOUNT.EDIT_ACCOUNT.TITLE' })}
          actions={{
            closeButtonProps: {
              children: intl.formatMessage({
                id: 'USER_ACCOUNT.EDIT_ACCOUNT.ACTIONS.CLOSE',
              }),
              onClick: handleBackButtonClick,
            },
            submitButtonProps: {
              children: intl.formatMessage({
                id: 'USER_ACCOUNT.EDIT_ACCOUNT.ACTIONS.SUBMIT',
              }),
              onClick: handleSubmitButtonClick,
              disabled: isUpdating || !isFormDirty,
            },
          }}
        />
        {isFetching || !data ? (
          <Loading />
        ) : (
          <div className={styles.content}>
            <AccountStatus data={data} />
            <AccountForm data={data} onSubmit={handleFormSubmit} />
            {errorMessage ? (
              <p className={styles.error}>
                {intl.formatMessage({ id: errorMessage })}
              </p>
            ) : null}
          </div>
        )}
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

export default memo(EditAccount);
