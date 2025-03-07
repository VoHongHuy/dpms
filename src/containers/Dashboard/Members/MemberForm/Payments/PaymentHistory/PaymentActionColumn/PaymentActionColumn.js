import React, { memo, useMemo } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { PAYMENT_TRANSACTION_STATUSES } from '@/constants/member';
import styles from './paymentActionColumn.module.scss';

const PaymentActionColumn = ({
  data,
  onStatusClick,
}) => {
  const intl = useIntl();
  const statusUpper = useMemo(() => data.status.toUpperCase(), [data]);

  const handleMarkReceived = e => {
    e.preventDefault();
    onStatusClick(data.id, PAYMENT_TRANSACTION_STATUSES.RECEIVED.value);
  };

  const handleMarkRefunded = e => {
    e.preventDefault();
    onStatusClick(data.id, PAYMENT_TRANSACTION_STATUSES.REFUNDED.value);
  };

  const handleMarkRemoved = e => {
    e.preventDefault();
    onStatusClick(data.id, PAYMENT_TRANSACTION_STATUSES.REMOVED.value);
  };

  return (
    <div>
      {statusUpper === PAYMENT_TRANSACTION_STATUSES.RECEIVED.alias ? null : (
        <a
          href="/"
          className={styles.receivedAction}
          onClick={handleMarkReceived}
        >
          {intl.formatMessage({
            id: 'PAYMENTS.LIST_PAYMENTS.ACTIONS.MARK_RECEIVED',
          })}
        </a>
      )}

      {statusUpper === PAYMENT_TRANSACTION_STATUSES.REFUNDED.alias ? null : (
        <a
          href="/"
          className={styles.refundedAction}
          onClick={handleMarkRefunded}
        >
          {intl.formatMessage({
            id: 'PAYMENTS.LIST_PAYMENTS.ACTIONS.MARK_REFUNDED',
          })}
        </a>
      )}

      {statusUpper === PAYMENT_TRANSACTION_STATUSES.REMOVED.alias ? null : (
        <a
          href="/"
          className={styles.removedAction}
          onClick={handleMarkRemoved}
        >
          {intl.formatMessage({
            id: 'PAYMENTS.LIST_PAYMENTS.ACTIONS.MARK_REMOVED',
          })}
        </a>
      )}
    </div>
  );
};

PaymentActionColumn.propTypes = {
  data: PropTypes.shape({
    status: PropTypes.number.isRequired,
    id: PropTypes.string.isRequired,
  }).isRequired,
  onStatusClick: PropTypes.func.isRequired,
};

export default memo(PaymentActionColumn);
