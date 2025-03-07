/* eslint-disable no-useless-escape */
import qs from 'qs';
import { REST_DOMAIN, INDENTITY_DOMAIN, FETCHING_TIMEOUT } from 'AppConfigs';
import { userManager } from '@/providers/OidcProvider';
import { store } from '@/redux';
import { getOidcUser } from '@/redux/ducks/oidc.duck';
import { ERROR_CODE_SCOPES } from '@/constants/errorCodes';
import { browserDetection } from '@/utils';

const buildURL = (path, domain = REST_DOMAIN) =>
  [domain.replace(/[\/]+$/, ''), path.replace(/^\/|\/$/g, '')].join('/');

const generateOptions = customOptions => {
  const defaultOptions = {
    mode: 'cors',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };
  const state = store.getState();
  const user = getOidcUser(state);
  const token = user && user.access_token;
  const options = { ...defaultOptions, ...customOptions };
  if (browserDetection.isIE()) {
    options.headers.Pragma = 'no-cache';
  }
  if (token) {
    options.headers.Authorization = `Bearer ${token}`;
  }

  return options;
};

const fetchWithTimeout = (args, timeout = FETCHING_TIMEOUT) =>
  Promise.race([
    fetch(...args),
    new Promise((_, rj) => {
      const timer = setTimeout(() => {
        clearTimeout(timer);
        rj(
          new Error(
            JSON.stringify({ code: 10001, scope: ERROR_CODE_SCOPES.LOCAL }),
          ),
        );
      }, timeout);
    }),
  ]);

const handleResponse = response => {
  if (response.redirected && response.url) {
    return Promise.resolve(response);
  }

  if (!response.ok) {
    if (response.status === 401) {
      const state = store.getState();
      const user = getOidcUser(state);
      const idToken = user && user.id_token;
      userManager.removeUser();
      userManager.signoutRedirect({ id_token_hint: idToken });
    }

    return Promise.reject(response);
  }

  if (response.status === 201) {
    const location = response.headers.get('Location');
    return location ? location.match('([^/]+$)')[1] : undefined;
  }

  if (response.status === 204) {
    return Promise.resolve(response);
  }

  const contentType = response.headers.get('content-type');

  if (contentType.indexOf('application/json') >= 0) {
    return response.json();
  }

  return response;
};

/**
 * @function apiGet
 * @description Make a GET request.
 * @param {string} path
 * @param {object} query
 * @param {object} options
 * @returns {promise}
 */
const apiGet = (
  domain,
  path,
  query = undefined,
  options = { timeout: undefined },
) =>
  fetchWithTimeout(
    [
      query
        ? `${buildURL(path, domain)}?${qs.stringify(query)}`
        : buildURL(path, domain),
      generateOptions({
        ...options,
        method: 'GET',
      }),
    ],
    options.timeout,
  )
    .then(handleResponse)
    .catch(handleResponse);

/**
 * @function apiPost
 * @description Make a POST request.
 * @param {string} path
 * @param {object} body
 * @param {object} options
 * @returns {promise}
 */
const apiPost = (
  domain,
  path,
  body,
  options = { keepBody: false, timeout: undefined },
) =>
  fetchWithTimeout(
    [
      buildURL(path, domain),
      generateOptions({
        ...options,
        method: 'POST',
        body: !options.keepBody ? JSON.stringify(body) : body,
      }),
    ],
    options.timeout,
  )
    .then(handleResponse)
    .catch(handleResponse);

/**
 * @function apiPut
 * @description Make a PUT request.
 * @param {string} path
 * @param {object} body
 * @param {object} options
 * @returns {promise}
 */
const apiPut = (
  domain,
  path,
  body,
  options = { keepBody: false, timeout: undefined },
) =>
  fetchWithTimeout(
    [
      buildURL(path, domain),
      generateOptions({
        ...options,
        method: 'PUT',
        body: !options.keepBody ? JSON.stringify(body) : body,
      }),
    ],
    options.timeout,
  )
    .then(handleResponse)
    .catch(handleResponse);

/**
 * @function apiDelete
 * @description Make a DELETE request.
 * @param {string} path
 * @param {object} body
 * @param {object} options
 * @returns {promise}
 */
const apiDelete = (
  domain,
  path,
  body,
  options = { keepBody: false, timeout: undefined },
) =>
  fetchWithTimeout(
    [
      buildURL(path, domain),
      generateOptions({
        ...options,
        method: 'DELETE',
        body: !options.keepBody ? JSON.stringify(body) : body,
      }),
    ],
    options.timeout,
  )
    .then(handleResponse)
    .catch(handleResponse);

/**
 * @function apiPatch
 * @description Make a PATCH request.
 * @param {string} path
 * @param {object} body
 * @param {object} options
 * @returns {promise}
 */
const apiPatch = (
  domain,
  path,
  body,
  options = { keepBody: false, timeout: undefined },
) =>
  fetchWithTimeout(
    [
      buildURL(path, domain),
      generateOptions({
        ...options,
        method: 'PATCH',
        body: !options.keepBody ? JSON.stringify(body) : body,
      }),
    ],
    options.timeout,
  )
    .then(handleResponse)
    .catch(handleResponse);

export default {
  get: (...args) => apiGet(REST_DOMAIN, ...args),
  post: (...args) => apiPost(REST_DOMAIN, ...args),
  put: (...args) => apiPut(REST_DOMAIN, ...args),
  delete: (...args) => apiDelete(REST_DOMAIN, ...args),
  patch: (...args) => apiPatch(REST_DOMAIN, ...args),
  identity: {
    get: (...args) => apiGet(INDENTITY_DOMAIN, ...args),
    post: (...args) => apiPost(INDENTITY_DOMAIN, ...args),
    put: (...args) => apiPut(INDENTITY_DOMAIN, ...args),
    delete: (...args) => apiDelete(INDENTITY_DOMAIN, ...args),
    patch: (...args) => apiPatch(INDENTITY_DOMAIN, ...args),
  },
};
