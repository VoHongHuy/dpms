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
  settings: {},
  selectedPaymentsId: [],
  filteredPayments: [],
};
const PREFIX = 'PAYMENTS';

/**
 * Actions - using for calling, getting, setting from component
 */
export const setFetching = createAction(`${PREFIX}/FETCHING`);
export const requestFailed = createAction(`${PREFIX}/REQUEST_FAILED`);
export const requestSuccess = createAction(`${PREFIX}/REQUEST_SUCCESS`);
export const fetchPayments = createAction(`${PREFIX}/GET_PAYMENTS`);
export const importPayments = createAction(`${PREFIX}/IMPORT_PAYMENTS`);
export const fetchMembershipSettings = createAction(`${PREFIX}/GET_MEMBERSHIP_SETTINGS`);
export const updateMembershipSettings = createAction(`${PREFIX}/UPDATE_MEMBERSHIP_SETTINGS`);
export const fetchPaymentsByMember = createAction(`${PREFIX}/GET_PAYMENTS_BY_MEMBER`);
export const updatePaymentTransactionYear =
  createAction(`${PREFIX}/UPDATE_PAYMENT_TRANSACTION_YEAR`);
export const selectPayment = createAction(`${PREFIX}/SELECT_PAYMENT`);
export const deSelectPayment = createAction(`${PREFIX}/DESELECT_PAYMENT`);
export const exportPayments = createAction(`${PREFIX}/EXPORT_PAYMENTS`);
export const updatePaymentStatus = createAction(`${PREFIX}/UPDATE_PAYMENT_STATUS`);
export const setSortOrder = createAction(`${PREFIX}/SET_SORT_ORDER`);
export const fetchFilteredPayments = createAction(`${PREFIX}/FETCH_FILTERED_PAYMENTS_ID`);

export const getFetching = state => state.payments.fetching;
export const getSuccess = state => state.payments.success;
export const getError = state => state.payments.error;
export const getPayments = state => state.payments.data;
export const getTotalPayments = state => state.payments.total;
export const getMembershipSettings = state => state.payments.settings;
export const getMemberPayments = state => state.payments.memberPayments;
export const getSelectedPaymentsId = state => state.payments.selectedPaymentsId;
export const getFilteredPaymentsId = state => state.payments.filteredPayments.map(m => m.id);
export const getFilteredPayments = state => state.payments.filteredPayments;
export const getSortOrder = state => state.payments.sortOrder;

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
      selectPayment,
      (state, { payload }) => {
        const newPaymentsId = payload.filter(
          i => !state.selectedPaymentsId.includes(i),
        );
        const selectedPaymentsId = [...state.selectedPaymentsId, ...newPaymentsId];
        return {
          ...state,
          selectedPaymentsId,
        };
      },
    ],
    [
      deSelectPayment,
      (state, { payload }) => {
        const selectedPaymentsId = state.selectedPaymentsId.filter(
          i => !payload.includes(i),
        );
        return {
          ...state,
          selectedPaymentsId,
        };
      },
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
  ]),
  {
    ...initialStates,
  },
);
