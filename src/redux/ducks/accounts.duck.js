import { createAction, handleActions } from 'redux-actions';

/**
 * Setup state and prefix
 */
const initialStates = {
  fetching: false,
  success: false,
  error: null,
  data: [],
  total: 0,
  selectedAccount: null,
  temporaryPasswordData: null,
};
const PREFIX = 'ACCOUNTS';

/**
 * Actions - using for calling, getting, setting from component
 */
export const setFetching = createAction(`${PREFIX}/FETCHING`);
export const requestFailed = createAction(`${PREFIX}/REQUEST_FAILED`);
export const requestSuccess = createAction(`${PREFIX}/REQUEST_SUCCESS`);
export const fetchAccounts = createAction(`${PREFIX}/GET_ACCOUNTS`);
export const fetchAccount = createAction(`${PREFIX}/GET_ACCOUNT`);
export const addAccount = createAction(`${PREFIX}/ADD_ACCOUNT`);
export const updateAccount = createAction(`${PREFIX}/UPDATE_ACCOUNT`);
export const deleteAccount = createAction(`${PREFIX}/DELETE_ACCOUNT`);
export const setAccountStatus = createAction(`${PREFIX}/SET_ACCOUNT_STATUS`);
export const setPasswordChangeStatus = createAction(
  `${PREFIX}/SET_PASSWORD_CHANGE_STATUS`,
);
export const clearAccountSelected = createAction(
  `${PREFIX}/CLEAR_ACCOUNT_SELECTED`,
);
export const fecthTemporaryPassword = createAction(
  `${PREFIX}/GET_TEMPORARY_PASSWORD`,
);
export const resetTemporaryPassword = createAction(
  `${PREFIX}/RESET_TEMPORARY_PASSWORD`,
);
export const softDeleteAccount = createAction(`${PREFIX}/SOFT_DELETE_ACCOUNT`);

export const getFetching = state => state.accounts.fetching;
export const getSuccess = state => state.accounts.success;
export const getError = state => state.accounts.error;
export const getAccounts = state => state.accounts.data;
export const getTotalAccounts = state => state.accounts.total;
export const getTemporaryPasswordData = state =>
  state.accounts.temporaryPasswordData;
export const getAccountSelected = state => state.accounts.selectedAccount;

/**
 * Reducers - using for redux store
 */
export default handleActions(
  new Map([
    [
      setFetching,
      (state, { payload }) => ({
        ...state,
        fetching: true,
        success: false,
        error: null,
        ...payload,
      }),
    ],
    [
      requestFailed,
      (state, { payload = { error: {}, response: {} } }) => ({
        ...state,
        fetching: false,
        success: false,
        error: payload.error,
        ...payload.response,
      }),
    ],
    [
      requestSuccess,
      (state, { payload = { response: {} } }) => ({
        ...state,
        fetching: false,
        success: true,
        error: null,
        ...payload.response,
      }),
    ],
    [
      clearAccountSelected,
      state => ({
        ...state,
        selectedAccount: null,
      }),
    ],
  ]),
  {
    ...initialStates,
  },
);
