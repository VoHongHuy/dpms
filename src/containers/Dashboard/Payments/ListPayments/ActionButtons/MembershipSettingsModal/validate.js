const validate = values => {
  const requiredMessage = 'FORM_VALIDATION.FIELD_REQUIRED';

  const errors = {
    pupil: !values.pupil && requiredMessage,
    student: !values.student && requiredMessage,
    employed: !values.employed && requiredMessage,
    unemployed: !values.unemployed && requiredMessage,
    retired: !values.retired && requiredMessage,
  };

  return errors;
};

export default validate;
