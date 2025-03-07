/* eslint-disable max-len */
import React, { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useIntl, FormattedHTMLMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import copy from 'copy-to-clipboard';
import moment from 'moment';
import {
  fecthTemporaryPassword,
  getTemporaryPasswordData,
  resetTemporaryPassword,
} from '@/redux/ducks/accounts.duck';
import Loading from '@/components/Loading';

import styles from './temporaryPasswordStatus.module.scss';

const TemporaryPasswordStatus = ({ id }) => {
  const [
    isFetchingTemporaryPassword,
    setFetchTemporaryPasswordStatus,
  ] = useState(true);
  const [isShownPassword, setShowPassword] = useState(false);
  const [isCopied, setCopyStatus] = useState(false);
  const [isPasswordGenerated, setPasswordStatus] = useState(false);
  const [isGeneratingPassword, setGeneratePasswordStatus] = useState(false);
  const [expired, setExpired] = useState({
    hours: 0,
    minutes: 0,
  });
  const intl = useIntl();
  const dispatch = useDispatch();
  const temporaryPasswordData = useSelector(getTemporaryPasswordData);

  const getExpiredTimeFromNow = expiredTime => {
    const now = moment(Date.now());
    const expiration = moment(expiredTime);
    const diff = expiration.diff(now);
    const diffDuration = moment.duration(diff);
    return {
      hours: diffDuration.hours(),
      minutes: diffDuration.minutes(),
    };
  };

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

  useEffect(() => {
    if (temporaryPasswordData && temporaryPasswordData.expirationDate) {
      setExpired(getExpiredTimeFromNow(temporaryPasswordData.expirationDate));
    }
  }, [temporaryPasswordData]);

  const togglePassword = () => {
    setShowPassword(!isShownPassword);
  };

  const handleCopyPassword = () => {
    if (isCopied) return;
    if (temporaryPasswordData && temporaryPasswordData.temporaryPassword) {
      copy(temporaryPasswordData.temporaryPassword);
      setCopyStatus(true);
      setTimeout(() => {
        setCopyStatus(false);
      }, 5000);
    }
  };

  const handleGeneratePassword = () => {
    if (isPasswordGenerated) return;
    setGeneratePasswordStatus(true);
    dispatch(
      resetTemporaryPassword({
        id,
        callback: success => {
          setGeneratePasswordStatus(false);
          if (success) {
            setPasswordStatus(true);
            setTimeout(() => {
              setPasswordStatus(false);
            }, 5000);
          }
        },
      }),
    );
  };

  return isFetchingTemporaryPassword ? (
    <Loading className={styles.loading} />
  ) : (
    <p className={styles.temporaryPasswordInfo}>
      {expired.hours >= 0 ? (
        <FormattedHTMLMessage
          id="USER_ACCOUNT.EDIT_ACCOUNT.ACCOUNT_STATUS.ACTION.TEMPORARY_PASSWORD_INFO"
          values={{
            temporaryPassword: isShownPassword
              ? temporaryPasswordData && temporaryPasswordData.temporaryPassword
              : '********',
            hoursExpired: expired.hours,
            minutesExpired: expired.minutes,
          }}
        />
      ) : (
        <FormattedHTMLMessage
          id="USER_ACCOUNT.EDIT_ACCOUNT.ACCOUNT_STATUS.ACTION.TEMPORARY_PASSWORD_EXPIRED"
          values={{
            temporaryPassword: isShownPassword
              ? temporaryPasswordData && temporaryPasswordData.temporaryPassword
              : '********',
          }}
        />
      )}
      &nbsp;&nbsp;
      <span
        role="presentation"
        className={styles.action}
        onClick={togglePassword}
      >
        {intl.formatMessage({
          id: isShownPassword
            ? 'USER_ACCOUNT.EDIT_ACCOUNT.ACCOUNT_STATUS.ACTION.HIDE_TEMPORARY_PASSWORD'
            : 'USER_ACCOUNT.EDIT_ACCOUNT.ACCOUNT_STATUS.ACTION.SHOW_TEMPORARY_PASSWORD',
        })}
      </span>
      &nbsp;&nbsp;
      <span
        role="presentation"
        className={styles.action}
        onClick={handleCopyPassword}
      >
        {intl.formatMessage({
          id: isCopied
            ? 'USER_ACCOUNT.EDIT_ACCOUNT.ACCOUNT_STATUS.ACTION.COPY_TEMPORARY_PASSWORD.COPIED'
            : 'USER_ACCOUNT.EDIT_ACCOUNT.ACCOUNT_STATUS.ACTION.COPY_TEMPORARY_PASSWORD.TEXT',
        })}
      </span>
      &nbsp;&nbsp;
      <span
        role="presentation"
        className={classNames(
          styles.action,
          isGeneratingPassword && styles.fetching,
        )}
        onClick={handleGeneratePassword}
      >
        {intl.formatMessage({
          id: isPasswordGenerated
            ? 'USER_ACCOUNT.EDIT_ACCOUNT.ACCOUNT_STATUS.ACTION.TEMPORARY_PASSWORD.GENERATED'
            : 'USER_ACCOUNT.EDIT_ACCOUNT.ACCOUNT_STATUS.ACTION.TEMPORARY_PASSWORD.GENERATE_NEW',
        })}
      </span>
    </p>
  );
};

TemporaryPasswordStatus.propTypes = { id: PropTypes.string.isRequired };

export default memo(TemporaryPasswordStatus);
