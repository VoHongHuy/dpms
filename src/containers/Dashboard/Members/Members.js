import React, { memo } from 'react';
import { Switch } from 'react-router';
import { useIntl } from 'react-intl';
import { generateRoutes } from '@/utils';
import SectionHeader from '@/components/SectionHeader';

import ROUTES from './routes';
import styles from './members.module.scss';

const Members = () => {
  const intl = useIntl();

  return (
    <div className={styles.container}>
      <SectionHeader
        className={styles.title}
        title={intl.formatMessage({ id: 'MEMBERS.LIST_MEMBERS.TITLE' })}
      />
      <div className={styles.content}>
        <Switch>{generateRoutes(ROUTES)}</Switch>
      </div>
    </div>
  );
};

export default memo(Members);
