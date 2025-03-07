import React, { memo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useIntl, FormattedHTMLMessage } from 'react-intl';
import { Field } from 'redux-form';
import { ROLES } from '@/constants/userAccounts';
import { Select, Option, FormSection } from '@/components/Form';
import { user } from '@/utils';

import styles from './roleSelection.module.scss';

const RoleSelection = ({ className, onChange }) => {
  const intl = useIntl();
  const currentUserRole = user.getRole();

  return (
    <FormSection
      label={intl.formatMessage({
        id: 'USER_ACCOUNT.ADD_ACCOUNT.SECTION.ROLE_AND_PERMISSIONS.LABEL',
      })}
    >
      <Field
        component={Select}
        name="role"
        className={classNames(styles.select, className)}
        placeholder={intl.formatMessage({ id: 'USER_ACCOUNT.MODEL.ROLE' })}
        disabled={currentUserRole === ROLES.MANAGER.alias}
        onChange={onChange}
      >
        {currentUserRole === ROLES.ADMIN.alias ? (
          <Option value={ROLES.MANAGER.alias}>
            {intl.formatMessage({ id: ROLES.MANAGER.displayName })}
          </Option>
        ) : null}
        <Option value={ROLES.USER.alias}>
          {intl.formatMessage({ id: ROLES.USER.displayName })}
        </Option>
      </Field>
      <p className={styles.note}>
        <FormattedHTMLMessage id="USER_ACCOUNT.ADD_ACCOUNT.NOTE" />
      </p>
    </FormSection>
  );
};

RoleSelection.defaultProps = { className: '' };
RoleSelection.propTypes = {
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default memo(RoleSelection);
