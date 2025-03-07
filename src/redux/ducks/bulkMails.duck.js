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
  sortOrder: {
    column: undefined,
    sortDirection: undefined,
  },
  totalMailSent: 0,
  totalMailSentInMonth: 0,
  statusMailSent: {
    data: {
      delivered: {},
      not_delivered: {},
    },
  },
};
const PREFIX = 'BULK_MAIL';

/**
 * Actions - using for calling, getting, setting from component
 */
export const setFetching = createAction(`${PREFIX}/FETCHING`);
export const requestFailed = createAction(`${PREFIX}/REQUEST_FAILED`);
export const requestSuccess = createAction(`${PREFIX}/REQUEST_SUCCESS`);
export const sendBulkMails = createAction(`${PREFIX}/SEND_BULK_MAILS`);
export const setSortOrder = createAction(`${PREFIX}/SET_SORT_ORDER`);
export const fetchBulkMails = createAction(`${PREFIX}/GET_BULK_MAILS`);
export const fetchTotalMailSent = createAction(`${PREFIX}/TOTAL_MAIL_SENT`);
export const fetchStatusMailSent = createAction(`${PREFIX}/GET_STATUS_MAIL_SENT`);
export const setFetchingStatusMailSent = createAction(`${PREFIX}/FETCHING_STATUS_MAIL_SENT`);
export const requestStatusMailSentSuccess = createAction(`${PREFIX}/REQUEST_STATUS_MAIL_SUCCESS`);
export const requestStatusMailSentFailed = createAction(`${PREFIX}/REQUEST_STATUS_MAIL_FAIL`);

/**
 * Selector
 */
export const getFetching = state => state.bulkMails.fetching;
export const getSuccess = state => state.bulkMails.success;
export const getError = state => state.bulkMails.error;
export const getBulkMails = state => state.bulkMails.data;
export const getTotalBulkMails = state => state.bulkMails.total;
export const getSortOrder = state => state.bulkMails.sortOrder;
export const getTotalMailSent = state => state.bulkMails.totalMailSent;
export const getTotalMailSentInMonth = state => state.bulkMails.totalMailSentInMonth;
export const getStatusMailSent = state => state.bulkMails.statusMailSent.data;

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
      setSortOrder,
      (state, { payload: { column, sortDirection } }) => ({
        ...state,
        sortOrder: {
          column,
          sortDirection,
        },
      }),
    ],
    [
      setFetchingStatusMailSent,
      (state, { payload }) => {
        const data = payload.delivered
          ? {
            delivered: {
              ...state.statusMailSent.data.delivered,
              ...payload.delivered,
            },
          }
          : {
            not_delivered: {
              ...state.statusMailSent.data.not_delivered,
              ...payload.not_delivered,
            },
          };
        return ({
          ...state,
          statusMailSent: {
            data: {
              ...state.statusMailSent.data,
              ...data,
            },
          },
        });
      },
    ],
    [
      requestStatusMailSentSuccess,
      (state, { payload = { response: {} } }) => {
        const data = payload.response.delivered
          ? {
            delivered: {
              ...state.statusMailSent.data.delivered,
              ...payload.response.delivered,
            },
          }
          : {
            not_delivered: {
              ...state.statusMailSent.data.not_delivered,
              ...payload.response.not_delivered,
            },
          };
        return ({
          ...state,
          statusMailSent: {
            data: {
              ...state.statusMailSent.data,
              ...data,
            },
          },
        });
      },
    ],
    [
      requestStatusMailSentFailed,
      (state, { payload = { error: {}, response: {} } }) => ({
        ...state,
        statusMailSent: {
          data: {
            ...state.statusMailSent.data,
            ...payload.response,
          },
        },
        error: payload.error,
      }),
    ],
  ]),
  {
    ...initialStates,
  },
);
