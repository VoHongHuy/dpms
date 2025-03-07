/**
 * Override localStorage functions avoids crash app on incognito mode
 */

const getItem = (key) => {
  let value;
  try {
    value = localStorage.getItem(key);
  } catch (e) {
    value = null;
  }

  return value;
};

const setItem = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    // Do nothing
  }
};

const removeItem = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    // Do nothing
  }
};

const clear = () => {
  try {
    localStorage.clear();
  } catch (e) {
    // Do nothing
  }
};

export default {
  getItem,
  setItem,
  removeItem,
  clear,
};
