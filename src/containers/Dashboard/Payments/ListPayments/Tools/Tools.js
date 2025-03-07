/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { memo } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import {
  deSelectPayment,
  exportPayments,
  getFetching,
  getSelectedPaymentsId,
  updatePaymentStatus,
} from '@/redux/ducks/payments.duck';
import { PAYMENT_TRANSACTION_STATUSES } from '@/constants/member';
import { hasPermissions } from '@/utils/user';
import { PERMISSIONS } from '@/constants/userAccounts';

import styles from './tools.module.scss';

const Tools = ({ onStatusChanged }) => {
  const intl = useIntl();
  const isFetching = useSelector(getFetching);
  const dispatch = useDispatch();
  const selectedPaymentsId = useSelector(getSelectedPaymentsId);

  const handleExport = event => {
    event.preventDefault();
    dispatch(exportPayments({
      ids: selectedPaymentsId,
    }));
  };

  const handleUpdateStatus = status => event => {
    event.preventDefault();
    dispatch(updatePaymentStatus({
      ids: selectedPaymentsId,
      status,
      callback: onStatusChanged,
    }));
  };

  const handleClearSelection = e => {
    e.preventDefault();
    dispatch(deSelectPayment(selectedPaymentsId));
  };

  return (
    <div className={styles.container}>
      <ul className={styles.tools}>
        <li>
          <a
            href="#"
            className={classNames(styles.export, isFetching && styles.isDisabled)}
            onClick={handleExport}
          >
            {intl.formatMessage({
              id: 'PAYMENTS.LIST_PAYMENTS.TOOLS.EXPORT_TO_EXCEL',
            })}
          </a>
        </li>
        {hasPermissions([PERMISSIONS.UPDATE_PAYMENT.value]) && (
          <>
            <li>
              <a
                href="#"
                className={classNames(styles.received, isFetching && styles.isDisabled)}
                onClick={handleUpdateStatus(PAYMENT_TRANSACTION_STATUSES.RECEIVED.value)}
              >
                {intl.formatMessage({
                  id: 'PAYMENTS.LIST_PAYMENTS.TOOLS.MARK_AS_RECEIVED',
                })}
              </a>
            </li>
            <li>
              <a
                href="#"
                className={classNames(styles.refunded, isFetching && styles.isDisabled)}
                onClick={handleUpdateStatus(PAYMENT_TRANSACTION_STATUSES.REFUNDED.value)}
              >
                {intl.formatMessage({
                  id: 'PAYMENTS.LIST_PAYMENTS.TOOLS.MARK_AS_REFUNDED',
                })}
              </a>
            </li>
            <li>
              <a
                href="#"
                className={classNames(styles.removed, isFetching && styles.isDisabled)}
                onClick={handleUpdateStatus(PAYMENT_TRANSACTION_STATUSES.REMOVED.value)}
              >
                {intl.formatMessage({
                  id: 'PAYMENTS.LIST_PAYMENTS.TOOLS.MARK_AS_REMOVED',
                })}
              </a>
            </li>
          </>
        )}
        <li>
          <a
            href="#"
            className={classNames(styles.clear, isFetching && styles.isDisabled)}
            onClick={handleClearSelection}
          >
            {intl.formatMessage({
              id: 'PAYMENTS.LIST_PAYMENTS.TOOLS.CLEAR_SELECTION',
            })}
          </a>
        </li>
      </ul>
    </div>
  );
};

Tools.propTypes = {
  onStatusChanged: PropTypes.func.isRequired,
};

export default memo(Tools);
