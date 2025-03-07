const mock = (success, timeout) => new Promise((resolve, reject) => {
  setTimeout(() => {
    if (success) {
      resolve();
    } else {
      // eslint-disable-next-line prefer-promise-reject-errors
      reject({ message: 'Error' });
    }
  }, timeout);
});

export default mock;
