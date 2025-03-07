import React, { memo } from 'react';
import { useIntl } from 'react-intl';
import LayoutWithLogo from '@/components/LayoutWithLogo';
import Button from '@/components/Button';
import { PATHS } from '@/constants';

import styles from './notFound.module.scss';

const NotFound = () => {
  const intl = useIntl();

  return (
    <LayoutWithLogo>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>404</h1>
          <p className={styles.description}>
            {intl.formatMessage({ id: 'NOT_FOUND.DESCRIPTION' })}
          </p>
          <Button tag="a" href={PATHS.DASHBOARD} className={styles.button}>
            {intl.formatMessage({ id: 'NOT_FOUND.BACK_TO_HOME' })}
          </Button>
        </div>
      </div>
    </LayoutWithLogo>
  );
};

export default memo(NotFound);
