import {
  takeLatest,
  all,
  put,
  call,
  takeEvery,
} from 'redux-saga/effects';
import {
  setFetching,
  requestSuccess,
  requestFailed as requestFailedAction,
  sendBulkMails,
  fetchBulkMails,
  fetchTotalMailSent,
  fetchStatusMailSent,
  setFetchingStatusMailSent,
  requestStatusMailSentSuccess,
  requestStatusMailSentFailed,
} from '@/redux/ducks/bulkMails.duck';
import { ERROR_CODE_SCOPES } from '@/constants/errorCodes';
import { api } from '@/services';
import { odataFilter } from '@/utils';

const requestFailed = args =>
  requestFailedAction({ ...args, scope: ERROR_CODE_SCOPES.MANAGEMENT });

function* onSendBulkMailsFlow() {
  yield takeLatest(sendBulkMails, function* onSendBulkMails({
    payload: { bulkMails, callback = () => {} },
  }) {
    yield put(setFetching());
    try {
      yield call(api.post, 'api/BulkMail', bulkMails);
      yield callback();
      yield put(
        requestSuccess(),
      );
    } catch (error) {
      yield put(requestFailed({ error }));
    }
  });
}

const generateBulkMailFilters = filters => {
  const {
    members: memberFilters,
    ...restFilters
  } = filters;
  const filtersOdata = odataFilter.compile(restFilters, {
    dateFrom: odataFilter.types.ge,
    dateTo: odataFilter.types.le,
  }, {
    dateFrom: 'sendDate',
    dateTo: 'sendDate',
  });
  if (memberFilters && memberFilters.length > 0) {
    const query = memberFilters
      .map(id => `m/id eq ${id}`)
      .join(' or ');
    const memberFiltersExpression = `Members/any(m:${query})`;
    if (filtersOdata.$filter) {
      filtersOdata.$filter += ` and ${memberFiltersExpression}`;
    } else {
      filtersOdata.$filter = memberFiltersExpression;
    }
  }

  return filtersOdata;
};

function* onGetBulkMailsFlow() {
  yield takeLatest(fetchBulkMails, function* onGetBulkMails({
    payload: { page, rowPerPage, filters = {}, sortOrder = {} } = {},
  }) {
    yield put(setFetching());
    try {
      const filtersOdata = generateBulkMailFilters(filters);
      const data = yield call(api.get, 'api/BulkMail', {
        ...filtersOdata,
        $expand: 'Members',
        $orderby: sortOrder.column
          ? `${sortOrder.column} ${sortOrder.sortDirection}`
          : 'sendDate desc',
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

function getNextMonthDate(date) {
  const nextMonthDate = new Date(date);
  nextMonthDate.setMonth(date.getMonth() + 1);
  return nextMonthDate;
}

function* onGetTotalMailSentFlow() {
  yield takeLatest(fetchTotalMailSent, function* onGetTotalMailSent() {
    yield put(setFetching());
    try {
      const data = yield call(api.get, 'api/BulkMail', {
        $expand: 'Members($select=id;$count=true)',
        $select: 'sendDate',
      });
      const current = new Date();
      const currentMonth = new Date(current.getFullYear(), current.getMonth(), 1);
      const nextMonth = getNextMonthDate(currentMonth);
      const total = data.value
        .reduce((bulkMail, currentValue) => {
          const sendDate = new Date(currentValue.sendDate);
          return {
            totalMailSent: bulkMail.totalMailSent + currentValue['members@odata.count'],
            totalMailSentInMonth:
                sendDate >= currentMonth && sendDate < nextMonth
                  ? bulkMail.totalMailSentInMonth + currentValue['members@odata.count']
                  : bulkMail.totalMailSentInMonth,
          };
        }, { totalMailSent: 0, totalMailSentInMonth: 0 });
      yield put(
        requestSuccess({
          response: {
            ...total,
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

function* onGetMailStatusList() {
  yield takeEvery(fetchStatusMailSent, function* onGetStatusMailSent({
    payload: { status, messageIds },
  }) {
    const messageParams = messageIds.reduce((accumulator, currentValue) => ({
      ...accumulator,
      messageIds: currentValue,
    }), {});
    yield put(setFetchingStatusMailSent({
      [status]: {
        [messageIds.join('|')]: {
          fetching: true,
        },
      },
    }));
    try {
      const params = {
        status,
        ...messageParams,
      };
      const data = yield call(api.get, 'api/mailactivities', {
        ...params,
      });
      yield put(requestStatusMailSentSuccess({
        response: {
          [status]: {
            [messageIds.join('|')]: {
              ...data,
              fetching: false,
            },
          },
        },
      }));
    } catch (error) {
      yield put(requestStatusMailSentFailed({ error }));
    }
  });
}

export default function* bulkMailsSaga() {
  yield all([
    onSendBulkMailsFlow(),
    onGetBulkMailsFlow(),
    onGetTotalMailSentFlow(),
    onGetMailStatusList(),
  ]);
}
