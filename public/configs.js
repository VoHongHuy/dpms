'use strict';

var configs = {
  REST_DOMAIN: 'https://localhost:44333',
  INDENTITY_DOMAIN: 'https://localhost:44322',
  FETCHING_TIMEOUT: 30000,
  INTL_LOCALE: 'hr',
  SUPPORTED_LANGUAGES: ['en', 'hr'],
  DATE_TIME_FORMAT: 'DD.MM.YYYY. hh:mm',
  NOTIFICATION_DURATION: 3000,
  CLIENT_ID: 'Management-UI',
  ENABLE_DUPLICATE_OIB_MODULE: true,
  get OIDC_SETTINGS() {
    return {
      authority: this.INDENTITY_DOMAIN,
      jwks_uri: this.INDENTITY_DOMAIN + '/.well-known/openid-configuration/jwks',
      authorization_endpoint: this.INDENTITY_DOMAIN + '/connect/authorize',
      token_endpoint: this.INDENTITY_DOMAIN + '/connect/token',
      end_session_endpoint: this.INDENTITY_DOMAIN + '/connect/endsession',
      userinfo_endpoint: this.INDENTITY_DOMAIN + '/connect/userinfo',
      client_id: this.CLIENT_ID,
      redirect_uri: window.location.protocol +
        '//' +
        window.location.hostname +
        (window.location.port ? ':' + window.location.port : '') +
        '/callback',
      response_type: 'code',
      scope: 'openid profile DPMS.ManagementAPI DPMS.IdentityAPI',
    };
  },
  EMAIL_SENDER: 'info@domovinski-pokret.hr',
  EMAIL_CONSTRAINT_NUMBER_ALLOW: 40000,
};