const validate = values => {
  const errors = {
    currentPassword: !values.currentPassword,
    newPassword: !values.newPassword,
    newPasswordConfirm: !values.newPasswordConfirm,
  };

  return errors;
};

export default validate;
