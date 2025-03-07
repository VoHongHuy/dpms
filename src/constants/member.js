export const SEX = {
  MALE: {
    alias: 'MALE',
    displayName: 'MEMBERS.MODEL.SEX.MALE',
  },
  FEMALE: {
    alias: 'FEMALE',
    displayName: 'MEMBERS.MODEL.SEX.FEMALE',
  },
};

export const WORKING_STATUSES = {
  PUPIL: {
    alias: 'PUPIL',
    displayName: 'MEMBERS.MODEL.WORKING_STATUS.PUPIL',
    value: 0,
  },
  STUDENT: {
    alias: 'STUDENT',
    displayName: 'MEMBERS.MODEL.WORKING_STATUS.STUDENT',
    value: 1,
  },
  EMPLOYED: {
    alias: 'EMPLOYED',
    displayName: 'MEMBERS.MODEL.WORKING_STATUS.EMPLOYED',
    value: 2,
  },
  UNEMPLOYED: {
    alias: 'UNEMPLOYED',
    displayName: 'MEMBERS.MODEL.WORKING_STATUS.UNEMPLOYED',
    value: 3,
  },
  RETIRED: {
    alias: 'RETIRED',
    displayName: 'MEMBERS.MODEL.WORKING_STATUS.RETIRED',
    value: 4,
  },
};

export const CROATIA_COUNTRY_NAME = 'Hrvatska';

export default { SEX, WORKING_STATUSES, CROATIA_COUNTRY_NAME };

export const PAYMENT_STATUSES = {
  PAID: {
    alias: 'PAID',
    displayName: 'MEMBERS.MODEL.PAYMENT_STATUS.PAID',
    value: 0,
  },
  PARTIAL: {
    alias: 'PARTIAL',
    displayName: 'MEMBERS.MODEL.PAYMENT_STATUS.PARTIAL',
    value: 1,
  },
  NOTPAID: {
    alias: 'NOTPAID',
    displayName: 'MEMBERS.MODEL.PAYMENT_STATUS.NOTPAID',
    value: 2,
  },
};

export const PAYMENT_TRANSACTION_STATUSES = {
  RECEIVED: {
    alias: 'RECEIVED',
    displayName: 'PAYMENTS.MODEL.STATUS.RECEIVED',
    value: 1,
  },
  REFUNDED: {
    alias: 'REFUNDED',
    displayName: 'PAYMENTS.MODEL.STATUS.REFUNDED',
    value: 2,
  },
  REMOVED: {
    alias: 'REMOVED',
    displayName: 'PAYMENTS.MODEL.STATUS.REMOVED',
    value: 3,
  },
};
