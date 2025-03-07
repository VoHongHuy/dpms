import { store } from '@/redux';
import { getCurrentUser } from '@/redux/ducks/auth.duck';
import { MANAGEMENT_PERMISSIONS } from '@/constants/claimTypes';

/**
 * @function hasPermissions
 * @param {Array} permissions - Array of permissions need checked
 * @description Check if current user has that permissions
 * @return boolean
 */
export const hasPermissions = permissions => {
  if (!permissions || permissions.length === 0) return false;

  const state = store.getState();
  const currentUser = getCurrentUser(state);
  const currentPesmissions =
    (currentUser && currentUser[MANAGEMENT_PERMISSIONS]) || [];

  return permissions.every(item => currentPesmissions.includes(item));
};

/**
 * @function getRole
 * @description Get role of current user
 * @return role as string
 */
export const getRole = () => {
  const state = store.getState();
  const currentUser = getCurrentUser(state);

  return currentUser && currentUser.role;
};

export default {
  hasPermissions,
  getRole,
};
