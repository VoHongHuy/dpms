export const ROLES = {
  ADMIN: {
    alias: 'ADMIN',
    displayName: 'USER_ACCOUNT.MODEL.ROLE.ADMIN',
  },
  MANAGER: {
    alias: 'MANAGER',
    displayName: 'USER_ACCOUNT.MODEL.ROLE.MANAGER',
  },
  USER: {
    alias: 'USER',
    displayName: 'USER_ACCOUNT.MODEL.ROLE.USER',
  },
};

export const STATUSES = {
  ACTIVE: {
    alias: 'ACTIVE',
    displayName: 'USER_ACCOUNT.STATUS.ACTIVE',
  },
  DEACTIVATED: {
    alias: 'DEACTIVATED',
    displayName: 'USER_ACCOUNT.STATUS.DEACTIVATED',
  },
  AWAITING_REGISTRATION: {
    alias: 'AWAITING_REGISTRATION',
    displayName: 'USER_ACCOUNT.STATUS.AWAITING_REGISTRATION',
  },
  DELETED: {
    alias: 'DELETED',
    displayName: 'USER_ACCOUNT.STATUS.DELETED',
  },
};

export const PERMISSIONS = {
  VIEW_RESULTS: { name: 'VIEW_RESULTS', value: 10021 },
  MODIFY_RESULT: { name: 'MODIFY_RESULT', value: 10022 },
  VIEW_MEMBERS: { name: 'VIEW_MEMBERS', value: 10023 },
  CREATE_MEMBER: { name: 'CREATE_MEMBER', value: 10024 },
  UPDATE_MEMBER: { name: 'UPDATE_MEMBER', value: 10029 },
  DELETE_MEMBER: { name: 'DELETE_MEMBER', value: 10030 },
  BULK_EMAIL: { name: 'BULK_EMAIL', value: 1034 },
  VIEW_STRUCTURE: { name: 'VIEW_STRUCTURE', value: 10025 },
  MODIFY_STRUCTURE: { name: 'MODIFY_STRUCTURE', value: 10026 },
  VIEW_TERRITORIAL_ORGANIZATION: {
    name: 'VIEW_TERRITORIAL_ORGANIZATION',
    value: 10027,
  },
  MODIFY_TERRITORIAL_ORGANIZATION: {
    name: 'MODIFY_TERRITORIAL_ORGANIZATION',
    value: 10028,
  },
  VIEW_PAYMENT: { name: 'VIEW_PAYMENT', value: 1031 },
  IMPORT_PAYMENT: { name: 'IMPORT_PAYMENT', value: 1032 },
  UPDATE_PAYMENT: { name: 'UPDATE_PAYMENT', value: 1033 },
};

export default { ROLES, STATUSES, PERMISSIONS };
