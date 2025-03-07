import React, { memo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useIntl } from 'react-intl';
import { ROLES } from '@/constants/userAccounts';
import history from '@/history';
import { PATHS } from '@/containers/Dashboard/constants';
import { user } from '@/utils';

import styles from './actionsColumn.module.scss';

const ActionsColumn = ({ data }) => {
  if (
    data.role === ROLES.ADMIN.alias ||
    (user.getRole() === ROLES.MANAGER.alias &&
      data.role === ROLES.MANAGER.alias)
  ) {
    return null;
  }
  const intl = useIntl();

  const handleClick = e => {
    e.preventDefault();
    history.push(PATHS.USER_ACCOUNTS_EDIT.replace(':id', data.id));
  };

  return (
    <a
      href={PATHS.USER_ACCOUNTS_EDIT.replace(':id', data.id)}
      className={classNames(styles.action)}
      onClick={handleClick}
    >
      {intl.formatMessage({ id: 'USER_ACCOUNT.LIST_ACCOUNTS.ACTIONS.EDIT' })}
    </a>
  );
};

ActionsColumn.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
  }).isRequired,
};

export default memo(ActionsColumn);
