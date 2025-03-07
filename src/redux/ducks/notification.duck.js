import { createAction, handleActions } from 'redux-actions';

/**
 * Setup state and prefix
 */
const initialStates = { type: undefined, message: undefined };
const PREFIX = 'NOTIFICATION';

/**
 * Actions - using for calling, getting, setting from component
 */
export const emitNotification = createAction(`${PREFIX}/EMIT`);

export const getNotification = (state) => state.notification;

/**
 * Reducers - using for redux store
 */
export default handleActions(
  new Map([
    [
      emitNotification,
      (state, { payload }) => ({
        ...state,
        ...payload,
      }),
    ],
  ]),
  {
    ...initialStates,
  },
);
