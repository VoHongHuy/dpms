import { createAction, handleActions } from 'redux-actions';

/**
 * Setup state and prefix
 */
const initialStates = {
  fetching: false,
  success: false,
  error: null,
  data: [],
};
const PREFIX = 'DUPLICATE_OIBS';

/**
 * Actions - using for calling, getting, setting from component
 */
export const setFetching = createAction(`${PREFIX}/FETCHING`);
export const requestFailed = createAction(`${PREFIX}/REQUEST_FAILED`);
export const requestSuccess = createAction(`${PREFIX}/REQUEST_SUCCESS`);
export const fetchDuplicateOibMembers = createAction(`${PREFIX}/GET_DUPLICATE_OIB_MEMBERS`);

/**
 * Selector
 */
export const getFetching = state => state.duplicateOibMembers.fetching;
export const getSuccess = state => state.duplicateOibMembers.success;
export const getError = state => state.duplicateOibMembers.error;
export const getDuplicateOibMembers = state => state.duplicateOibMembers.data;

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
  ]),
  {
    ...initialStates,
  },
);
