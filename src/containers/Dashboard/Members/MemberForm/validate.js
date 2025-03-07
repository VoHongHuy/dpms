import { validations } from '@/utils';

const validate = values => {
  const requiredMessage = 'FORM_VALIDATION.FIELD_REQUIRED';

  const errors = {
    name: !values.name && requiredMessage,
    surname: !values.surname && requiredMessage,
    dateOfBirth: !values.dateOfBirth && requiredMessage,
    placeOfBirth: !values.placeOfBirth && requiredMessage,
    sex: !values.sex && requiredMessage,
    contactNumber: !values.contactNumber && requiredMessage,
    country: !values.country && requiredMessage,
    county: !values.county && requiredMessage,
    municipality: !values.municipality && requiredMessage,
    settlement: !values.settlement && requiredMessage,
    postalCode: !values.postalCode && requiredMessage,
    streetAndNumber: !values.streetAndNumber && requiredMessage,
    profession: !values.profession && requiredMessage,
    schoolName: !values.schoolName && requiredMessage,
    workingStatus: !values.workingStatus && requiredMessage,
    maritalStatus: !values.maritalStatus && requiredMessage,
    cardProvidedByMember: !values.cardProvidedByMember && requiredMessage,
  };

  if (!values.email) {
    errors.email = requiredMessage;
  } else if (!validations.email(values.email)) {
    errors.email = 'FORM_VALIDATION.EMAIL_INVALID';
  }

  if (!values.ssn) {
    errors.ssn = requiredMessage;
  } else if (!validations.ssn(values.ssn)) {
    errors.ssn = 'FORM_VALIDATION.SSN_INVALID';
  }

  return errors;
};

export default validate;
