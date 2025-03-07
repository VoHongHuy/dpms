import React, { memo } from 'react';
import { Switch, Redirect } from 'react-router';
import { useSelector, shallowEqual } from 'react-redux';
import { generateRoutes } from '@/utils';
import { getCurrentUser } from '@/redux/ducks/auth.duck';
import { PATHS } from '@/constants';

import Sidebar from './Sidebar';
import { ROUTES } from './constants';
import styles from './dashboard.module.scss';

const Dashboard = () => {
  const user = useSelector(getCurrentUser, shallowEqual);

  return user && user.passwordChangeRequired ? (
    <Redirect to={PATHS.CHANGE_PASSWORD} />
  ) : (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.content}>
        <Switch>{generateRoutes(ROUTES)}</Switch>
      </div>
    </div>
  );
};

export default memo(Dashboard);
