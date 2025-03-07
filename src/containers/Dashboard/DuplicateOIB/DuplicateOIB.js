import React, { memo } from 'react';
import { useIntl } from 'react-intl';
import SectionHeader from '@/components/SectionHeader';
import ListDuplicateOIBMember from './ListDuplicateOIBMember';

import styles from './duplicateOIB.module.scss';

const DuplicateOIB = () => {
  const intl = useIntl();

  return (
    <div className={styles.container}>
      <SectionHeader
        className={styles.title}
        title={intl.formatMessage({ id: 'DUPLICATE_OIBS.LIST_MEMBERS.TITLE' })}
      />
      <div className={styles.content}>
        <ListDuplicateOIBMember />
      </div>
    </div>
  );
};

export default memo(DuplicateOIB);
