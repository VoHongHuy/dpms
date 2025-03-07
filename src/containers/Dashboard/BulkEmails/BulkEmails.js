import React, { memo } from 'react';
import { useIntl } from 'react-intl';
import SectionHeader from '@/components/SectionHeader';
import ListBulkEmails from './ListBulkEmails';

import styles from './bulkEmails.module.scss';

const DuplicateOIB = () => {
  const intl = useIntl();

  return (
    <div className={styles.container}>
      <SectionHeader
        className={styles.title}
        title={intl.formatMessage({ id: 'BULK_EMAIL.TITLE' })}
      />
      <div className={styles.content}>
        <ListBulkEmails />
      </div>
    </div>
  );
};

export default memo(DuplicateOIB);
