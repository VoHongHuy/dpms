import React from 'react';
import {
  OidcProvider as RxOidcProvider,
  createUserManager,
  // processSilentRenew,
  loadUser as RxLoadUser,
} from 'redux-oidc';
import { OIDC_SETTINGS } from 'AppConfigs';

const userManager = createUserManager({
  authority: OIDC_SETTINGS.authority,
  client_id: OIDC_SETTINGS.client_id,
  redirect_uri: OIDC_SETTINGS.redirect_uri,
  response_type: OIDC_SETTINGS.response_type,
  scope: OIDC_SETTINGS.scope,
  automaticSilentRenew: false,
  loadUserInfo: false,
  staleStateAge: 5,
  metadata: {
    issuer: OIDC_SETTINGS.authority,
    jwks_uri: OIDC_SETTINGS.jwks_uri,
    token_endpoint: OIDC_SETTINGS.token_endpoint,
    authorization_endpoint: OIDC_SETTINGS.authorization_endpoint,
    end_session_endpoint: OIDC_SETTINGS.end_session_endpoint,
    userinfo_endpoint: OIDC_SETTINGS.userinfo_endpoint,
  },
});

// Loads potentially existing user data into the redux store,
// thus eliminating a new authentication roundtrip to the authentication server
// when a tab is closed or a new tab is opened.
const loadUser = store => RxLoadUser(store, userManager);

// Processes the silent renewal of tokens.
// processSilentRenew();

const OidcProvider = props => (
  <RxOidcProvider {...props} userManager={userManager} />
);

export { userManager, loadUser };
export default OidcProvider;
