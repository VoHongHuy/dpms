/* eslint-disable max-len */
import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { deleteAccount } from '@/redux/ducks/accounts.duck';
import { getCurrentUser } from '@/redux/ducks/auth.duck';
import { ROLES } from '@/constants/userAccounts';

import TemporaryPasswordStatus from '../TemporaryPasswordStatus';

import styles from './awaitingRegistration.module.scss';

const AwaitingRegistration = ({ id, createdByUserId }) => {
  const [isDeletingAccount, setDeleteAccountStatus] = useState(false);
  const intl = useIntl();
  const dispatch = useDispatch();
  const currentUser = useSelector(getCurrentUser);
  const isAllowedDeleteUser =
    currentUser.role === ROLES.ADMIN.alias ||
    (currentUser && currentUser.sub === createdByUserId);

  const handleCancelRegistration = () => {
    setDeleteAccountStatus(true);
    dispatch(
      deleteAccount({
        id,
        callback: () => {
          setDeleteAccountStatus(false);
        },
      }),
    );
  };

  return (
    <>
      <p className={styles.status}>
        {intl.formatMessage({
          id: 'USER_ACCOUNT.STATUS.AWAITING_REGISTRATION',
        })}
      </p>
      {isAllowedDeleteUser ? (
        <>
          <TemporaryPasswordStatus id={id} />
          <p className={styles.actionWrapper}>
            <span
              role="presentation"
              className={classNames(
                styles.action,
                isDeletingAccount && styles.fetching,
              )}
              onClick={handleCancelRegistration}
            >
              {intl.formatMessage({
                id:
                  'USER_ACCOUNT.EDIT_ACCOUNT.ACCOUNT_STATUS.ACTION.CANCEL_REGISTRATION_REQUEST',
              })}
            </span>
          </p>
        </>
      ) : null}
    </>
  );
};

AwaitingRegistration.propTypes = {
  id: PropTypes.string.isRequired,
  createdByUserId: PropTypes.string.isRequired,
};

export default memo(AwaitingRegistration);
