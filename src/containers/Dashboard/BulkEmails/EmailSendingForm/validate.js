const validate = values => {
  const requiredMessage = 'FORM_VALIDATION.FIELD_REQUIRED';

  const errors = {
    sender: !values.sender && requiredMessage,
    subject: !values.subject && requiredMessage,
    content: (!values.content || !values.content.getCurrentContent().hasText()) && requiredMessage,
  };

  return errors;
};

export default validate;
