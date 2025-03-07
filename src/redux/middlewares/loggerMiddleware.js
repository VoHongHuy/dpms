import 'clientjs';

const client = new window.ClientJS();
const log = [];
let previousAction = null;

const loggerMiddleware = store => next => action => {
  if (/\/REQUEST_FAILED$/.test(action.type)) {
    const { payload: { error } } = action;
    log.push({
      action: previousAction.type,
      payload: JSON.stringify(previousAction.payload),
      error: error && (error.toString() || JSON.stringify(error)),
      state: JSON.stringify(store.getState()),
      os: `${client.getOS()}@${client.getOSVersion()}`,
      browser: `${client.getBrowser()}@${client.getBrowserVersion()}`,
      device: `${client.getDevice()}:${client.getDeviceType()}`,
      fingerprint: client.getFingerprint(),
      timestamp: new Date().toUTCString(),
    });
  }

  if (
    !/\/FETCHING$/.test(action.type) &&
    !/\/REQUEST_FAILED$/.test(action.type) &&
    !/\/REQUEST_SUCCESS$/.test(action.type)
  ) {
    previousAction = action;
  }
  next(action);
};

export default loggerMiddleware;
