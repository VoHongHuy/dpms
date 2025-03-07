import React, { memo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useIntl } from 'react-intl';
import { permissionsGuard } from '@/HOCs';
import history from '@/history';
import { PATHS } from '@/containers/Dashboard/constants';
import { PERMISSIONS } from '@/constants/userAccounts';

import styles from './actionsColumn.module.scss';

const ActionsColumn = ({ data }) => {
  const intl = useIntl();

  const handleClick = e => {
    e.preventDefault();
    history.push(PATHS.MEMBERS_EDIT.replace(':id', data.id));
  };

  const DetailsMemberButton = permissionsGuard(
    [PERMISSIONS.VIEW_MEMBERS.value],
    () => (
      <a
        href={PATHS.MEMBERS_EDIT.replace(':id', data.id)}
        className={classNames(styles.action)}
        onClick={handleClick}
      >
        {intl.formatMessage({ id: 'MEMBERS.LIST_MEMBERS.ACTIONS.DETAILS' })}
      </a>
    ),
    false,
  );

  return (
    <DetailsMemberButton />
  );
};

ActionsColumn.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
};

export default memo(ActionsColumn);
