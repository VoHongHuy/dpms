import { takeLatest, all, put, call } from 'redux-saga/effects';
import moment from 'moment';
import {
  setFetching,
  requestSuccess,
  requestFailed as requestFailedAction,
  importPayments,
  fetchMembershipSettings,
  updateMembershipSettings,
  fetchPaymentsByMember,
  updatePaymentTransactionYear,
  exportPayments,
  updatePaymentStatus,
  fetchPayments,
  fetchFilteredPayments,
} from '@/redux/ducks/payments.duck';
import { ERROR_CODE_SCOPES } from '@/constants/errorCodes';
import { api } from '@/services';
import { csvExporter, odataFilter } from '@/utils';
import { WORKING_STATUSES } from '@/constants/member';
import { ERROR_CODES } from '@/constants';

const requestFailed = args =>
  requestFailedAction({ ...args, scope: ERROR_CODE_SCOPES.MANAGEMENT });

function* onImportPaymentsFlow() {
  yield takeLatest(importPayments, function* onImportPayments({ payload: { files, intl } }) {
    yield put(setFetching());
    try {
      const formData = new FormData();
      formData.append('formFile', files[0]);
      const result = yield call(api.post, 'api/Payment/import', formData, {
        keepBody: true,
        headers: { Accept: 'application/json' },
      });
      if (result.isFailed) {
        const errorRows = result.errorRows.map(errorData => ({
          number: `${errorData.row.number}`,
          currencyDate: errorData.row.currencyDate
            && moment(errorData.row.currencyDate).format('DD.MM.YYYY.'),
          paymentDate: errorData.row.paymentDate
            && moment(errorData.row.paymentDate).format('DD.MM.YYYY.'),
          description: errorData.row.description,
          paidByAccountNumber: `${errorData.row.paidByAccountNumber}`,
          outgoingAmount: `${errorData.row.outgoingAmount}`,
          incomingAmount: `${errorData.row.incomingAmount}`,
          accountBalance: `${errorData.row.accountBalance}`,
          senderRefNumber: `${errorData.row.senderRefNumber}`,
          recipientReferenceNumber: `${errorData.row.recipientReferenceNumber}`,
          paidBy: `${errorData.row.paidBy}`,
          location: `${errorData.row.location}`,
          paymentReference: `${errorData.row.paymentReference}`,
          errors: errorData.errors.map(code => intl.formatMessage({
            id: ERROR_CODES[ERROR_CODE_SCOPES.MANAGEMENT][code],
          })).join('|'),
        }));
        const headers = {
          number: 'Redni broj',
          currencyDate: 'Datum valute',
          paymentDate: 'Datum izvršenja',
          description: 'Opis plaćanja, tečaj',
          paidByAccountNumber: 'Broj računa platitelja',
          outgoingAmount: 'Isplate',
          incomingAmount: 'Uplate',
          accountBalance: 'Stanje',
          senderRefNumber: 'PNB platitelja',
          recipientReferenceNumber: 'PNB primatelja',
          paidBy: 'Platitelj/primatelj',
          location: 'Mjesto',
          paymentReference: 'Referenca plaćanja',
          errors: 'Pogreške',
        };
        yield call(csvExporter.exportCSVFile, headers, errorRows, 'payment-errors');
        yield put(requestFailed());
      } else {
        yield put(
          requestSuccess(),
        );
      }
    } catch (error) {
      yield put(requestFailed({ error }));
    }
  });
}

function* onfetchMembershipSettingsFlow() {
  yield takeLatest(fetchMembershipSettings,
    function* onFetchMembershipSettings() {
      yield put(setFetching());
      try {
        const data = yield call(api.get, 'api/membershipsetting');
        const settings = data.reduce((result, item) => ({
          ...result,
          [item.workingStatus.toLowerCase()]: item.amount,
        }), {});
        yield put(
          requestSuccess({ response: { settings }, dismiss: true }),
        );
      } catch (error) {
        yield put(requestFailed({ error }));
      }
    });
}

function* onUpdateMembershipSettingsFlow() {
  yield takeLatest(updateMembershipSettings,
    function* onUpdateMembershipSettings({ payload: { data, callback } }) {
      yield put(setFetching());
      try {
        const membershipSettings = Object.keys(data).map(key => ({
          workingStatus: WORKING_STATUSES[key.toLocaleUpperCase()].value,
          amount: Number(data[key]),
        }));
        yield call(api.post, 'api/membershipsetting', { membershipSettings });
        callback();
        yield put(
          requestSuccess({ dismiss: true }),
        );
      } catch (error) {
        yield put(requestFailed({ error }));
      }
    });
}

function* onExportPaymentsFlow() {
  yield takeLatest(exportPayments, function* onExportPayments({
    payload: { ids },
  }) {
    yield put(setFetching());
    try {
      const response = yield call(api.post, 'api/payment/export', {
        ids,
      });
      response.blob()
        .then(blob => {
          const url = window.URL.createObjectURL(blob);

          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'Payments.xlsx');
          document.body.appendChild(link);
          link.click();
          link.parentNode.removeChild(link);
        });
      yield put(requestSuccess());
    } catch (error) {
      yield put(requestFailed({ error }));
    }
  });
}

function* onUpdatePaymentStatusFlow() {
  yield takeLatest(updatePaymentStatus,
    function* onUpdatePaymentStatus({ payload: { ids, status, callback } }) {
      yield put(setFetching());
      try {
        yield call(api.post, 'api/payment/transaction/update/status', { ids, status });
        callback();
        yield put(
          requestSuccess(),
        );
      } catch (error) {
        yield put(requestFailed({ error }));
      }
    });
}

function* onfetchPaymentsFlow() {
  yield takeLatest(fetchPayments,
    function* onfetchPayments({
      payload: { page, rowPerPage, filters = {}, sortOrder = {} } = {},
    }) {
      yield put(setFetching());
      try {
        const customFilter = {
          ...filters,
          year: filters.year && Number(filters.year),
          dateFrom: filters.dateFrom?.toISOString(),
          memberId: filters.memberId?.value,
        };
        const filtersOdata = odataFilter.compile(customFilter, {
          year: odataFilter.types.equal,
          minimalAmount: odataFilter.types.ge,
          maxAmount: odataFilter.types.le,
          status: odataFilter.types.equal,
          dateFrom: odataFilter.types.ge,
          memberId: odataFilter.types.equal,
          memberCountryId: odataFilter.types.equal,
          memberCountyId: odataFilter.types.equal,
          memberMunicipalityId: odataFilter.types.equal,
          memberSettlementId: odataFilter.types.equal,
          memberDistrictId: odataFilter.types.equal,
          memberElectionUnit: odataFilter.types.equal,
        }, {
          minimalAmount: 'incomingAmount',
          maxAmount: 'incomingAmount',
          dateFrom: 'paymentDate',
        });
        const data = yield call(api.get, 'api/PaymentTransaction', {
          ...filtersOdata,
          $orderby: sortOrder.column
            ? `${sortOrder.column} ${sortOrder.sortDirection}`
            : 'paymentDate',
          $skip: page && rowPerPage && (page - 1) * rowPerPage,
          $top: rowPerPage,
          $count: true,
        });
        yield put(
          requestSuccess({
            response: {
              data: data.value,
              total: data['@odata.count'],
            },
            dismiss: true,
          }),
        );
      } catch (error) {
        yield put(requestFailed({ error }));
      }
    });
}

function* onfetchFilteredPaymentsFlow() {
  yield takeLatest(fetchFilteredPayments,
    function* onfetchFilteredPayments({
      payload: { filters },
    }) {
      yield put(setFetching());
      try {
        const customFilter = {
          ...filters,
          year: filters.year && Number(filters.year),
          dateFrom: filters.dateFrom?.toISOString(),
          memberId: filters.memberId?.value,
        };
        const filtersOdata = odataFilter.compile(customFilter, {
          year: odataFilter.types.equal,
          minimalAmount: odataFilter.types.ge,
          maxAmount: odataFilter.types.le,
          status: odataFilter.types.equal,
          dateFrom: odataFilter.types.ge,
          memberId: odataFilter.types.equal,
          memberCountryId: odataFilter.types.equal,
          memberCountyId: odataFilter.types.equal,
          memberMunicipalityId: odataFilter.types.equal,
          memberSettlementId: odataFilter.types.equal,
          memberDistrictId: odataFilter.types.equal,
          memberElectionUnit: odataFilter.types.equal,
        }, {
          minimalAmount: 'incomingAmount',
          maxAmount: 'incomingAmount',
          dateFrom: 'paymentDate',
        });
        const data = yield call(api.get, 'api/PaymentTransaction', {
          ...filtersOdata,
          $select: 'id,status,incomingAmount',
        });
        yield put(
          requestSuccess({
            response: { filteredPayments: data.value },
            dismiss: true,
          }),
        );
      } catch (error) {
        yield put(requestFailed({ error }));
      }
    });
}

function* onfetchPaymentsByMemberFlow() {
  yield takeLatest(fetchPaymentsByMember,
    function* onFetchPaymentsByMember({ payload: { memberId } }) {
      yield put(setFetching());
      try {
        const filters = {
          memberId,
        };
        const filtersOdata = odataFilter.compile(filters, {
          memberId: odataFilter.types.equal,
        });

        const data = yield call(api.get, 'api/paymenttransaction', filtersOdata);

        yield put(
          requestSuccess({ response: { memberPayments: data.value }, dismiss: true }),
        );
      } catch (error) {
        yield put(requestFailed({ error }));
      }
    });
}

function* onUpdatePaymentTransactionYearFlow() {
  yield takeLatest(updatePaymentTransactionYear,
    function* onUpdatePaymentTransactionYear({ payload: { paymentId, data, callback } }) {
      yield put(setFetching());
      try {
        yield call(api.post, `api/payment/transaction/${paymentId}/year`, data);

        yield put(
          requestSuccess({ dismiss: true }),
        );

        callback();
      } catch (error) {
        yield put(requestFailed({ error }));
      }
    });
}

export default function* paymentsSaga() {
  yield all([
    onImportPaymentsFlow(),
    onfetchMembershipSettingsFlow(),
    onUpdateMembershipSettingsFlow(),
    onfetchPaymentsByMemberFlow(),
    onUpdatePaymentTransactionYearFlow(),
    onExportPaymentsFlow(),
    onUpdatePaymentStatusFlow(),
    onfetchPaymentsFlow(),
    onfetchFilteredPaymentsFlow(),
  ]);
}
