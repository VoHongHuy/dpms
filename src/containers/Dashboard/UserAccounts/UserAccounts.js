import React, { memo } from 'react';
import { Switch } from 'react-router';
import { useIntl } from 'react-intl';
import { generateRoutes } from '@/utils';
import SectionHeader from '@/components/SectionHeader';

import ROUTES from './routes';
import styles from './userAccounts.module.scss';

const UserAccounts = () => {
  const intl = useIntl();

  return (
    <div className={styles.container}>
      <SectionHeader
        className={styles.title}
        title={intl.formatMessage({ id: 'USER_ACCOUNT.LIST_ACCOUNTS.TITLE' })}
      />
      <div className={styles.content}>
        <Switch>{generateRoutes(ROUTES)}</Switch>
      </div>
    </div>
  );
};

export default memo(UserAccounts);
