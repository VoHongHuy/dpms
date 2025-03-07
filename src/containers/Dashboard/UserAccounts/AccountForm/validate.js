import { validations } from '@/utils';

const validate = values => {
  const requiredMessage = 'FORM_VALIDATION.FIELD_REQUIRED';

  const errors = {
    name: !values.name && requiredMessage,
    surname: !values.surname && requiredMessage,
    role: !values.role && requiredMessage,
  };

  if (!values.email) {
    errors.email = requiredMessage;
  } else if (!validations.email(values.email)) {
    errors.email = 'FORM_VALIDATION.EMAIL_INVALID';
  }

  return errors;
};

export default validate;
