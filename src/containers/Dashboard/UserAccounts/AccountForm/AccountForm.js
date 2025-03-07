import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector, useDispatch } from 'react-redux';
import { useIntl } from 'react-intl';
import { compose } from 'redux';
import { Form, reduxForm, getFormValues, change } from 'redux-form';
import { ROLES, PERMISSIONS } from '@/constants/userAccounts';
import { ACCOUNT_FORM } from '@/constants/forms';
import { MANAGEMENT_PERMISSIONS } from '@/constants/claimTypes';

import BasicInformation from './BasicInformation';
import RoleSelection from './RoleSelection';
import Permissions from './Permissions';
import validate from './validate';
import styles from './accountForm.module.scss';

const AccountForm = ({ className, handleSubmit, onSubmit }) => {
  const formValues = useSelector(getFormValues(ACCOUNT_FORM));
  const intl = useIntl();
  const dispatch = useDispatch();
  const fullPermissions = useMemo(
    () => [
      PERMISSIONS.VIEW_RESULTS.value,
      PERMISSIONS.MODIFY_RESULT.value,
      PERMISSIONS.VIEW_MEMBERS.value,
      PERMISSIONS.CREATE_MEMBER.value,
      PERMISSIONS.UPDATE_MEMBER.value,
      PERMISSIONS.DELETE_MEMBER.value,
      PERMISSIONS.VIEW_STRUCTURE.value,
      PERMISSIONS.MODIFY_STRUCTURE.value,
      PERMISSIONS.VIEW_TERRITORIAL_ORGANIZATION.value,
      PERMISSIONS.MODIFY_TERRITORIAL_ORGANIZATION.value,
    ],
    [],
  );

  const handlePermissionsChange = newPermissions => {
    dispatch(change(ACCOUNT_FORM, 'permissions', newPermissions));
  };

  const handleRoleChange = ({ target: { value: role } }) => {
    if (role !== ROLES.USER.alias) {
      handlePermissionsChange(fullPermissions);
    }
  };

  const submit = values => {
    onSubmit({
      ...values,
      permissions: {
        [MANAGEMENT_PERMISSIONS]: values.permissions,
      },
    });
  };

  return (
    <Form onSubmit={handleSubmit(submit)} className={className}>
      <BasicInformation />
      <RoleSelection onChange={handleRoleChange} />
      <Permissions
        permissions={formValues && formValues.permissions}
        territorialRegions={formValues.territorialRegions}
        onChange={handlePermissionsChange}
      />
      {formValues && formValues.role && formValues.role !== ROLES.USER.alias ? (
        <p className={styles.note}>
          {intl.formatMessage({ id: 'USER_ACCOUNT.EDIT_ACCOUNT.NOTE' })}
        </p>
      ) : null}
    </Form>
  );
};

AccountForm.defaultProps = { className: '' };
AccountForm.propTypes = {
  className: PropTypes.string,
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default compose(
  connect((state, props) => ({
    initialValues: {
      ...props.data,
      role: (props.data && props.data.role) || ROLES.USER.alias,
      permissions:
        (props.data &&
          props.data.permissions &&
          props.data.permissions[MANAGEMENT_PERMISSIONS] &&
          props.data.permissions[MANAGEMENT_PERMISSIONS].split('|').map(
            Number,
          )) ||
        [],
    },
  })),
  reduxForm({
    form: ACCOUNT_FORM,
    validate,
    touchOnChange: true,
    destroyOnUnmount: true,
  }),
)(AccountForm);
