const validate = values => {
  const requiredMessage = 'FORM_VALIDATION.FIELD_REQUIRED';

  const errors = {
    operator: !values.operator && requiredMessage,
    countryId: !values.countryId && requiredMessage,
    countyId: !values.countyId && requiredMessage,
    municipalityId: !values.municipalityId && requiredMessage,
    settlementId: !values.settlementId && requiredMessage,
  };

  return errors;
};

export default validate;
