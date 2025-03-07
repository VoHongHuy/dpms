import React, { memo } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import styles from './permissionActions.module.scss';

const PermissionActions = ({ onSelectAllView, onDeselectAll }) => {
  const intl = useIntl();

  return (
    <div className={styles.actionsGroup}>
      <span
        role="presentation"
        className={styles.action}
        onClick={onSelectAllView}
      >
        {intl.formatMessage({
          id: 'USER_ACCOUNT.ADD_ACCOUNT.ACTIONS.SELECT_ALL_VIEW_PERMISSIONS',
        })}
      </span>
      <span
        role="presentation"
        className={styles.action}
        onClick={onDeselectAll}
      >
        {intl.formatMessage({
          id: 'USER_ACCOUNT.ADD_ACCOUNT.ACTIONS.DESELECT_ALL_PERMISSIONS',
        })}
      </span>
    </div>
  );
};

PermissionActions.propTypes = {
  onSelectAllView: PropTypes.func.isRequired,
  onDeselectAll: PropTypes.func.isRequired,
};

export default memo(PermissionActions);
