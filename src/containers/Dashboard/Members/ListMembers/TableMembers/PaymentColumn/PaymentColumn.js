import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';
import { v1 } from 'uuid';

import { STYLES } from '@/constants';
import styles from './paymentColumn.module.scss';
import PaymentSummary from './PaymentSummary';

const PaymentColumn = ({ data, membershipSettings }) => {
  if (!data.paymentTransactions || data.paymentTransactions.length === 0) {
    return null;
  }

  const id = useMemo(() => v1(), []);
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  const currentYearReceived = useMemo(() => {
    const trans = data.paymentTransactions.find(element => element.year === currentYear);
    if (trans) {
      return trans.incomingAmount;
    }

    return 0;
  }, [data]);

  const amountSetting = useMemo(() => {
    const keys = Object.keys(membershipSettings);
    let amount = 0;
    keys.forEach(key => {
      if (key.toUpperCase() === data.workingStatus.toUpperCase()) {
        amount = membershipSettings[key];
      }
    });

    return amount;
  }, [data, membershipSettings]);

  let iconColor = '';
  if (currentYearReceived >= amountSetting) {
    iconColor = styles.memberFullyPay;
  } else if (currentYearReceived > 0) {
    iconColor = styles.memberPartialPay;
  } else {
    iconColor = styles.memberNotPay;
  }

  return (
    <>
      <i
        data-tip
        data-for={id}
        className={`fa fa-info-circle ${iconColor}`}
        aria-hidden="true"
      />
      <ReactTooltip
        type="light"
        place="top"
        border
        delayHide={200}
        effect="solid"
        className={styles.tooltipContainer}
        borderColor={STYLES.BORDER_COLOR}
        id={id}
      >
        <PaymentSummary payments={data.paymentTransactions} />
      </ReactTooltip>
    </>
  );
};

PaymentColumn.propTypes = {
  data: PropTypes.shape({
    paymentTransactions: PropTypes.arrayOf(
      PropTypes.shape({
        year: PropTypes.number.isRequired,
        incomingAmount: PropTypes.number.isRequired,
      }),
    ),
    workingStatus: PropTypes.string.isRequired,
  }).isRequired,
  membershipSettings: PropTypes.shape({}).isRequired,
};

export default memo(PaymentColumn);
