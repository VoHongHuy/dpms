/* eslint-disable max-len */
import React, { memo, useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import {
  setAccountStatus,
  resetTemporaryPassword,
  getTemporaryPasswordData,
  fecthTemporaryPassword,
  setPasswordChangeStatus,
} from '@/redux/ducks/accounts.duck';
import CheckBox from '@/components/CheckBox';
import { ROLES } from '@/constants/userAccounts';
import { getCurrentUser } from '@/redux/ducks/auth.duck';
import Loading from '@/components/Loading';

import TemporaryPasswordStatus from '../TemporaryPasswordStatus';

import styles from './activeStatus.module.scss';

const ActiveStatus = ({ id, createdByUserId, passwordChangeRequired }) => {
  const [
    isFetchingTemporaryPassword,
    setFetchTemporaryPasswordStatus,
  ] = useState(true);
  const [isFetchingPasswordChange, setFetchPasswordChangeStatus] = useState(
    false,
  );
  const [isResettingPassword, setResetPasswordStatus] = useState(false);
  const [isSettingAccoutnStatus, setAccountPasswordStatus] = useState(false);
  const intl = useIntl();
  const dispatch = useDispatch();
  const checkBoxRef = useRef();
  const currentUser = useSelector(getCurrentUser);
  const temporaryPasswordData = useSelector(getTemporaryPasswordData);
  const isAllowedResetPassword =
    currentUser.role === ROLES.ADMIN.alias ||
    (currentUser && currentUser.sub === createdByUserId);

  useEffect(() => {
    dispatch(
      fecthTemporaryPassword({
        id,
        callback: () => {
          setFetchTemporaryPasswordStatus(false);
        },
      }),
    );
  }, []);

  const handleDeactivateAccount = () => {
    setAccountPasswordStatus(true);
    dispatch(
      setAccountStatus({
        id,
        active: false,
        callback: () => {
          setAccountPasswordStatus(false);
        },
      }),
    );
  };

  const handleResetTemporaryPassword = () => {
    setResetPasswordStatus(true);
    dispatch(
      resetTemporaryPassword({
        id,
        callback: () => setResetPasswordStatus(false),
      }),
    );
  };

  const handleRequestResetPasword = e => {
    e.stopPropagation();
    const { checked } = e.target;
    if (!temporaryPasswordData) {
      setFetchPasswordChangeStatus(true);
      checkBoxRef.current.disabled = true;
      dispatch(
        setPasswordChangeStatus({
          id,
          active: checked,
          callback: () => {
            setFetchPasswordChangeStatus(false);
            checkBoxRef.current.disabled = false;
          },
        }),
      );
    }
  };

  const renderActions = () => {
    if (isAllowedResetPassword) {
      if (isFetchingTemporaryPassword) {
        return <Loading className={styles.loading} />;
      }

      return (
        <>
          {!temporaryPasswordData ? (
            <p className={styles.actionWrapper}>
              <span
                role="presentation"
                className={classNames(
                  styles.action,
                  isResettingPassword && styles.fetching,
                )}
                onClick={handleResetTemporaryPassword}
              >
                {intl.formatMessage({
                  id:
                    'USER_ACCOUNT.EDIT_ACCOUNT.ACCOUNT_STATUS.ACTION.SET_TEMPORARY_PASSWORD',
                })}
              </span>
            </p>
          ) : (
            <TemporaryPasswordStatus id={id} />
          )}
          <CheckBox
            ref={checkBoxRef}
            name="requestResetPassword"
            className={classNames(
              styles.checkbox,
              isFetchingPasswordChange && styles.fetching,
            )}
            label={intl.formatMessage({
              id:
                'USER_ACCOUNT.EDIT_ACCOUNT.ACCOUNT_STATUS.ACTION.REQUEST_RESET_PASSWORD_NEXT_LOGIN',
            })}
            onClick={handleRequestResetPasword}
            onChange={() => {}}
            checked={temporaryPasswordData || passwordChangeRequired}
            disabled={temporaryPasswordData || passwordChangeRequired}
          />
        </>
      );
    }

    return null;
  };

  return (
    <>
      <p className={styles.status}>
        {intl.formatMessage({ id: 'USER_ACCOUNT.STATUS.ACTIVE' })}
      </p>
      <p className={styles.actionWrapper}>
        <span
          className={classNames(
            styles.action,
            isSettingAccoutnStatus && styles.fetching,
          )}
          role="presentation"
          onClick={handleDeactivateAccount}
        >
          {intl.formatMessage({
            id:
              'USER_ACCOUNT.EDIT_ACCOUNT.ACCOUNT_STATUS.ACTION.DEACTIVATE_ACCOUNT',
          })}
        </span>
      </p>
      {renderActions()}
    </>
  );
};

ActiveStatus.defaultProps = {
  passwordChangeRequired: false,
};
ActiveStatus.propTypes = {
  id: PropTypes.string.isRequired,
  createdByUserId: PropTypes.string.isRequired,
  passwordChangeRequired: PropTypes.bool,
};

export default memo(ActiveStatus);
