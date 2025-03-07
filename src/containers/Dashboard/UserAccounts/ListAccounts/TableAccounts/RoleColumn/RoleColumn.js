import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { ROLES } from '@/constants/userAccounts';

const RoleColumn = ({ role }) => {
  const intl = useIntl();

  return <span>{intl.formatMessage({ id: ROLES[role].displayName })}</span>;
};

RoleColumn.propTypes = { role: PropTypes.string.isRequired };

export default memo(RoleColumn);
