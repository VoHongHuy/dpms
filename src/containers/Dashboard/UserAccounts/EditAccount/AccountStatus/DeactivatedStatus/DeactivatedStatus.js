/* eslint-disable max-len */
import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';
import { setAccountStatus, softDeleteAccount } from '@/redux/ducks/accounts.duck';
import ConfirmModal from '@/components/ConfirmModal';

import styles from './deactivatedStatus.module.scss';

const DeactivatedStatus = ({ id }) => {
  const [isSettingAccoutnStatus, setAccountPasswordStatus] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const intl = useIntl();
  const dispatch = useDispatch();

  const toggleModal = () => {
    setOpenModal(!openModal);
  };

  const handleReactivateAccount = () => {
    setAccountPasswordStatus(true);
    dispatch(
      setAccountStatus({
        id,
        active: true,
        callback: () => {
          setAccountPasswordStatus(false);
        },
      }),
    );
  };

  const handleDeleteAccount = () => {
    setAccountPasswordStatus(true);
    dispatch(
      softDeleteAccount({
        id,
        callback: () => {
          setAccountPasswordStatus(false);
        },
      }),
    );
  };

  return (
    <>
      <p className={styles.status}>
        {intl.formatMessage({ id: 'USER_ACCOUNT.STATUS.DEACTIVATED' })}
      </p>
      <p className={styles.actionWrapper}>
        <span
          role="presentation"
          className={classNames(
            styles.action,
            isSettingAccoutnStatus && styles.fetching,
          )}
          onClick={handleReactivateAccount}
        >
          {intl.formatMessage({
            id:
              'USER_ACCOUNT.EDIT_ACCOUNT.ACCOUNT_STATUS.ACTION.REACTIVATE_ACCOUNT',
          })}
        </span>
      </p>
      <p className={styles.actionWrapper}>
        <span
          className={classNames(
            styles.action,
            isSettingAccoutnStatus && styles.fetching,
          )}
          role="presentation"
          onClick={toggleModal}
        >
          {intl.formatMessage({
            id:
              'USER_ACCOUNT.EDIT_ACCOUNT.ACCOUNT_STATUS.ACTION.DELETE_ACCOUNT',
          })}
        </span>
      </p>
      <ConfirmModal
        toggle={toggleModal}
        open={openModal}
        okButtonProps={{ onClick: handleDeleteAccount, loading: isSettingAccoutnStatus }}
      >
        {intl.formatMessage({
          id: 'USER_ACCOUNT.EDIT_ACCOUNT.ACCOUNT_STATUS.ACTION.DELETE_ACCOUNT_CONFIRM_MESSAGE',
        })}
      </ConfirmModal>
    </>
  );
};

DeactivatedStatus.propTypes = { id: PropTypes.string.isRequired };

export default memo(DeactivatedStatus);
