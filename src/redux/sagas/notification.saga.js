import { takeEvery, all, put, call } from 'redux-saga/effects';
import { emitNotification } from '@/redux/ducks/notification.duck';
import { generateId } from '@/utils';
import { ERROR_CODES } from '@/constants';

const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

function* handleRequestSuccessFlow() {
  yield takeEvery(
    action => /\/REQUEST_SUCCESS$/.test(action.type),
    function* onRequestSuccess({ payload = { dismiss: false } }) {
      if (payload.dismiss) return;

      const data = {
        id: payload.id || generateId(),
        type: NOTIFICATION_TYPES.SUCCESS,
        message: payload.message || 'NOTIFICATION.SUCCESS.MESSAGE.DEFAULT',
      };

      yield put(emitNotification(data));
    },
  );
}

function* handleRequestFailedFlow() {
  yield takeEvery(
    action => /\/REQUEST_FAILED$/.test(action.type),
    function* onRequestFailed({ payload = { dismiss: false } }) {
      if (payload.dismiss) return;
      let serverErrorMessage;

      if (payload.error) {
        try {
          if (payload.error instanceof Error) {
            const error = JSON.parse(payload.error.message);
            serverErrorMessage = ERROR_CODES[error.scope][error.code];
          } else {
            const response = yield call(async () => {
              const response = await payload.error.text();
              return JSON.parse(response);
            });
            if (response && response.errors[0]) {
              serverErrorMessage =
                ERROR_CODES[payload.scope][response.errors[0]];
            } else {
              throw new Error('Cannot read errors property');
            }
          }
        } catch (e) {
          serverErrorMessage = '';
        }
      }

      const data = {
        id: payload.id || generateId(),
        type: NOTIFICATION_TYPES.ERROR,
        message:
          serverErrorMessage ||
          payload.message ||
          'NOTIFICATION.ERROR.MESSAGE.DEFAULT',
      };

      yield put(emitNotification(data));
    },
  );
}

export default function* notificationSaga() {
  yield all([handleRequestSuccessFlow(), handleRequestFailedFlow()]);
}
