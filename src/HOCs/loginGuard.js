import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { userManager } from '@/providers/OidcProvider';
import Loading from '@/components/Loading';
import { STORAGE } from '@/constants';
import { getCurrentUser, fetchUserInfo } from '@/redux/ducks/auth.duck';
import { getOidcUser } from '@/redux/ducks/oidc.duck';

/**
 * @function loginGuard
 * @param {*} Component
 * @description Not allow user access this component if they was not logged in
 * @returns React Component || Redirect to sign in page
 */
const loginGuard = Component => props => {
  const isLoadingUser = useSelector(state => state.oidc.isLoadingUser);
  const user = useSelector(getOidcUser);
  const currentUser = useSelector(getCurrentUser);
  const dispatch = useDispatch();

  // If user loaded and user is empty. Redirect them to login page
  if ((!isLoadingUser && !user) || (user && user.expired)) {
    sessionStorage.setItem(STORAGE.SAVED_PATH, window.location.pathname);
    userManager.signinRedirect();
  }

  // Load user info if not exists
  if (user && !currentUser) {
    dispatch(fetchUserInfo());
  }

  return !user || !currentUser ? <Loading /> : <Component {...props} />;
};

export default loginGuard;
