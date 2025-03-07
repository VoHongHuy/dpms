import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { useIntl, FormattedHTMLMessage } from 'react-intl';

import styles from './statusTitle.module.scss';

const StatusTitle = ({ createdBy, email, dateTime }) => {
  const intl = useIntl();

  return (
    <>
      <p className={styles.subTitle}>
        <FormattedHTMLMessage
          id="USER_ACCOUNT.EDIT_ACCOUNT.ACCOUNT_STATUS.SUB_TITLE"
          values={{ createdBy, email, dateTime }}
        />
      </p>
      <p className={styles.title}>
        {intl.formatMessage({
          id: 'USER_ACCOUNT.EDIT_ACCOUNT.ACCOUNT_STATUS.TITLE',
        })}
      </p>
    </>
  );
};

StatusTitle.propTypes = {
  createdBy: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  dateTime: PropTypes.string.isRequired,
};

export default memo(StatusTitle);
