import React, { memo } from 'react';
import { Switch } from 'react-router';
import { useIntl } from 'react-intl';
import SectionHeader from '@/components/SectionHeader';
import { generateRoutes } from '@/utils';
import ROUTES from './routes';

import styles from './organization.module.scss';

const Organization = () => {
  const intl = useIntl();

  return (
    <div className={styles.container}>
      <SectionHeader
        className={styles.title}
        title={intl.formatMessage({ id: 'ORGANIZATION.TITLE' })}
      />
      <div className={styles.content}>
        <Switch>{generateRoutes(ROUTES)}</Switch>
      </div>
    </div>
  );
};

export default memo(Organization);
