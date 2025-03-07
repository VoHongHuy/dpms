import React, { memo } from 'react';
import { useIntl } from 'react-intl';
import SectionHeader from '@/components/SectionHeader';
import ListPayments from './ListPayments';

import styles from './payments.module.scss';

const Payments = () => {
  const intl = useIntl();

  return (
    <div className={styles.container}>
      <SectionHeader
        className={styles.title}
        title={intl.formatMessage({ id: 'PAYMENTS.LIST_PAYMENTS.TITLE' })}
      />
      <div className={styles.content}>
        <ListPayments />
      </div>
    </div>
  );
};

export default memo(Payments);
