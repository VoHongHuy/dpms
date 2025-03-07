import React, { memo } from 'react';
import { CallbackComponent } from 'redux-oidc';
import { userManager } from '@/providers/OidcProvider';
import { PATHS, STORAGE } from '@/constants';
import history from '@/history';

const Callback = () => {
  if (!window.location.search) {
    history.push(PATHS.NOT_FOUND);
  }

  const successCallback = () => {
    const previousPath = sessionStorage.getItem(STORAGE.SAVED_PATH);
    sessionStorage.removeItem(STORAGE.SAVED_PATH);
    history.push(previousPath || PATHS.DASHBOARD);
  };

  const errorCallback = () => {
    history.push(PATHS.NOT_FOUND);
  };

  return (
    <CallbackComponent
      userManager={userManager}
      successCallback={successCallback}
      errorCallback={errorCallback}
    >
      <div>Redirecting...</div>
    </CallbackComponent>
  );
};

export default memo(Callback);
