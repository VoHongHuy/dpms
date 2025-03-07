import React, { memo, useMemo } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { PAYMENT_TRANSACTION_STATUSES } from '@/constants/member';
import styles from './paymentTransactionStatusColumn.module.scss';

const PaymentTransactionStatusColumn = ({ data }) => {
  const intl = useIntl();
  const transationStatus = useMemo(() => {
    const statusUppper = data.status.toUpperCase();

    switch (statusUppper) {
      case PAYMENT_TRANSACTION_STATUSES.RECEIVED.alias:
        return {
          style: styles.received,
          displayName: PAYMENT_TRANSACTION_STATUSES.RECEIVED.displayName,
        };

      case PAYMENT_TRANSACTION_STATUSES.REFUNDED.alias:
        return {
          style: styles.refunded,
          displayName: PAYMENT_TRANSACTION_STATUSES.REFUNDED.displayName,
        };

      case PAYMENT_TRANSACTION_STATUSES.REMOVED.alias:
        return {
          style: styles.removed,
          displayName: PAYMENT_TRANSACTION_STATUSES.REMOVED.displayName,
        };

      default:
        return {};
    }
  }, [data]);
  const userName = useMemo(() => {
    const statusUpdate = new Date(data.lastStatusUpdatedTime);
    const yearUpdate = new Date(data.lastYearUpdatedTime);
    if (statusUpdate > yearUpdate) {
      return data.lastStatusUpdatedByUserName;
    }

    return data.lastYearUpdatedByUserName;
  }, [data]);

  return (
    <div className={transationStatus.style}>
      <div>{intl.formatMessage({ id: transationStatus.displayName })}</div>
      <div>{userName}</div>
    </div>
  );
};

PaymentTransactionStatusColumn.propTypes = {
  data: PropTypes.shape({
    status: PropTypes.number.isRequired,
    lastYearUpdatedByUserName: PropTypes.string.isRequired,
    lastYearUpdatedTime: PropTypes.string.isRequired,
    lastStatusUpdatedByUserName: PropTypes.string.isRequired,
    lastStatusUpdatedTime: PropTypes.string.isRequired,
  }).isRequired,
};

export default memo(PaymentTransactionStatusColumn);
