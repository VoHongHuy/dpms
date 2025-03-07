import { getTotalMailSent, getTotalMailSentInMonth } from '@/redux/ducks/bulkMails.duck';
import React, { memo } from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { EMAIL_CONSTRAINT_NUMBER_ALLOW } from 'AppConfigs';

import styles from './statusText.module.scss';

const StatusText = () => {
  const totalMailSent = useSelector(getTotalMailSent);
  const totalMailSentInMonth = useSelector(getTotalMailSentInMonth);
  const intl = useIntl();

  return (
    <div className={styles.container}>
      <div className={styles.statusText}>
        {intl.formatMessage({ id: 'BULK_EMAIL.STATUS.MONTHLY_EMAIL_COUNT' })}:&nbsp;
        <span className={styles.textBold}>
          {totalMailSentInMonth}/{EMAIL_CONSTRAINT_NUMBER_ALLOW}
        </span>
      </div>
      <div className={styles.statusText}>
        {intl.formatMessage({ id: 'BULK_EMAIL.STATUS.TOTAL_EMAIL_COUNT' })}:&nbsp;
        <span className={styles.textBold}>{totalMailSent}</span>
      </div>
    </div>
  );
};

export default memo(StatusText);
