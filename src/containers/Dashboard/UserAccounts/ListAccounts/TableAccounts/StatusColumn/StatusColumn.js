import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { STATUSES } from '@/constants/userAccounts';

import styles from './statusColumn.module.scss';

const StatusColumn = ({ status }) => {
  const intl = useIntl();
  const style = useMemo(() => {
    switch (status) {
      case STATUSES.ACTIVE.alias:
        return styles.active;
      case STATUSES.DEACTIVATED.alias:
        return styles.deactivated;
      case STATUSES.AWAITING_REGISTRATION.alias:
        return styles.awaiting;
      default:
        return styles.awaiting;
    }
  }, []);

  return (
    <span className={style}>
      {intl.formatMessage({ id: STATUSES[status].displayName })}
    </span>
  );
};

StatusColumn.propTypes = { status: PropTypes.string.isRequired };

export default memo(StatusColumn);
