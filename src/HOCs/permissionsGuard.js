import React from 'react';
import { Redirect } from 'react-router';
import { PATHS } from '@/constants';
import { useSelector } from 'react-redux';
import { getCurrentUser } from '@/redux/ducks/auth.duck';
import { MANAGEMENT_PERMISSIONS } from '@/constants/claimTypes';

/**
 * @function permissionsGuard
 * @param {Array} permissions - Array of permissions need checked
 * @param {*} Component
 * @description Not allow user access this component
 * if they doesnot have enough permissions
 * @returns React Component || Redirect to root page
 */
const permissionsGuard = (permissions, Component, redirect = true) => props => {
  const currentUser = useSelector(getCurrentUser);
  const currentPesmissions =
    (currentUser && currentUser[MANAGEMENT_PERMISSIONS]) || [];

  if (!permissions.every(item => currentPesmissions.includes(item))) {
    return redirect ? <Redirect to={PATHS.DASHBOARD} /> : null;
  }

  return <Component {...props} />;
};

export default permissionsGuard;
