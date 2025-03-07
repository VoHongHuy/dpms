import React from 'react';
import { PATHS } from '@/constants';
import { Redirect } from 'react-router';
import { useSelector } from 'react-redux';
import { getCurrentUser } from '@/redux/ducks/auth.duck';

/**
 * @function rolesGuard
 * @param {Array} roles - Array roles accessible
 * @param {*} Component
 * @description Not allow user access this component
 * if they's role does not included
 * @returns React Component || Redirect to root page
 */
const rolesGuard = (roles, Component, redirect = true) => props => {
  const currentUser = useSelector(getCurrentUser);
  const currentUserRole = currentUser && currentUser.role;

  if (!currentUserRole || !roles.includes(currentUserRole)) {
    return redirect ? <Redirect to={PATHS.DASHBOARD} /> : null;
  }

  return <Component {...props} />;
};

export default rolesGuard;
