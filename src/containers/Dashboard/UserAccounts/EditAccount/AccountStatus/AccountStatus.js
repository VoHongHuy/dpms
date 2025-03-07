import React, { memo } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { DATE_TIME_FORMAT } from 'AppConfigs';
import { STATUSES } from '@/constants/userAccounts';

import StatusTitle from './StatusTitle';
import ActiveStatus from './ActiveStatus';
import DeactivatedStatus from './DeactivatedStatus';
import AwaitingRegistration from './AwaitingRegistration';
import styles from './accountStatus.module.scss';

const AccountStatus = props => {
  const { data } = props;
  if (!data || !data.status) return null;
  const {
    id,
    status,
    createdBy,
    createdDate,
    createdByUserId,
    passwordChangeRequired,
  } = data;
  const renderStatus = () => {
    switch (status) {
      case STATUSES.ACTIVE.alias:
        return (
          <ActiveStatus
            id={id}
            createdByUserId={createdByUserId}
            passwordChangeRequired={passwordChangeRequired}
          />
        );
      case STATUSES.DEACTIVATED.alias:
        return <DeactivatedStatus id={id} />;
      default:
        return (
          <AwaitingRegistration id={id} createdByUserId={createdByUserId} />
        );
    }
  };

  return (
    <div className={styles.container}>
      <StatusTitle
        createdBy={`${createdBy.name} ${createdBy.surname}`}
        email={createdBy.email}
        dateTime={moment(createdDate).format(DATE_TIME_FORMAT)}
      />
      {renderStatus()}
    </div>
  );
};

AccountStatus.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    passwordChangeRequired: PropTypes.bool.isRequired,
    createdBy: PropTypes.shape({
      name: PropTypes.string.isRequired,
      surname: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
    }).isRequired,
    createdByUserId: PropTypes.string.isRequired,
    createdDate: PropTypes.string.isRequired,
  }).isRequired,
};

export default memo(AccountStatus);
