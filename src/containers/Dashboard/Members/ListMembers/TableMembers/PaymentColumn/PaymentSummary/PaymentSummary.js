import React, { memo, useMemo } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { PAYMENT_TRANSACTION_STATUSES } from '@/constants/member';
import styles from './paymentSummary.module.scss';

const PaymentSummary = ({ payments, className }) => {
  if (!payments || payments.length === 0) {
    return null;
  }

  const intl = useIntl();

  const [summaries, total] = useMemo(() => {
    const groupedPayments = _.groupBy(payments, 'year');
    const keys = Object.keys(groupedPayments);
    const summaries = [];
    const total = { totalAllYear: 0, totalAllReceived: 0, totalAllRefunded: 0, totalAllRemoved: 0 };

    for (let index = 0; index < keys.length; index += 1) {
      const key = keys[index];
      const payments = groupedPayments[key];
      const summary = {
        year: key,
        totalReceived: 0,
        totalRefunded: 0,
        totalRemoved: 0,
      };

      payments.forEach(payment => {
        total.totalAllYear += payment.incomingAmount;

        const statusUpper = payment.status.toUpperCase();

        switch (statusUpper) {
          case PAYMENT_TRANSACTION_STATUSES.RECEIVED.alias:
            summary.totalReceived += payment.incomingAmount;
            total.totalAllReceived += payment.incomingAmount;
            break;

          case PAYMENT_TRANSACTION_STATUSES.REFUNDED.alias:
            summary.totalRefunded += payment.incomingAmount;
            total.totalAllRefunded += payment.incomingAmount;
            break;

          case PAYMENT_TRANSACTION_STATUSES.REMOVED.alias:
            summary.totalRemoved += payment.incomingAmount;
            total.totalAllRemoved += payment.incomingAmount;
            break;

          default:
            break;
        }
      });
      summaries.push(summary);
    }

    return [summaries, total];
  }, [payments]);

  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.contents}>
        <div className={styles.paymentYear}>
          {intl.formatMessage({
            id: 'MEMBERS.LIST_MEMBERS.PAYMENTS.TOTAL',
          })}
        </div>
        <div className={styles.totalByYear}>{total.totalAllYear}</div>
        <div className={styles.received}>{total.totalAllReceived}</div>
        <div className={styles.refunded}>{total.totalAllRefunded}</div>
        <div className={styles.removed}>{total.totalAllRemoved}</div>
      </div>

      <div className={styles.divider} />
      <div className={styles.divider} />
      <div className={styles.divider} />
      <div className={styles.divider} />
      <div className={styles.divider} />

      {summaries.map(payment => (
        <div key={payment.year} className={styles.contents}>
          <div className={styles.paymentYear}>{payment.year}:</div>
          <div className={styles.totalByYear}>
            {payment.totalReceived + payment.totalRefunded + payment.totalRemoved}
          </div>
          <div className={styles.received}>{payment.totalReceived}</div>
          <div className={styles.refunded}>{payment.totalRefunded}</div>
          <div className={styles.removed}>{payment.totalRemoved}</div>
        </div>
      ))}
    </div>
  );
};

PaymentSummary.defaultProps = {
  className: '',
};

PaymentSummary.propTypes = {
  payments: PropTypes.arrayOf(
    PropTypes.shape({
      year: PropTypes.number.isRequired,
      status: PropTypes.string.isRequired,
      incomingAmount: PropTypes.number.isRequired,
    }),
  ).isRequired,
  className: PropTypes.string,
};

export default memo(PaymentSummary);
