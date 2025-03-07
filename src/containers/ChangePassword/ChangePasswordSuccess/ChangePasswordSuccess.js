import React, { memo } from 'react';
import { useIntl, FormattedHTMLMessage } from 'react-intl';
import Button from '@/components/Button';

import styles from './changePasswordSuccess.module.scss';

const ChangePasswordSuccess = () => {
  const intl = useIntl();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>
          {intl.formatMessage({ id: 'CHANGE_PASSWORD.SUCCESS.TITLE' })}
        </h1>
        <p className={styles.description}>
          <FormattedHTMLMessage id="CHANGE_PASSWORD.SUCCESS.DESCRIPTION" />
        </p>
        <Button tag="a" href="/sign-in" className={styles.button}>
          {intl.formatMessage({ id: 'CHANGE_PASSWORD.SUCCESS.BUTTON' })}
        </Button>
      </div>
    </div>
  );
};

export default memo(ChangePasswordSuccess);
