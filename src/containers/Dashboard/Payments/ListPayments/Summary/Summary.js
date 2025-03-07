import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import styles from './summary.module.scss';

const Summary = ({ data }) => {
  const intl = useIntl();

  return (
    <div className={styles.container}>
      <span className={styles.title}>
        {intl.formatMessage({ id: 'PAYMENTS.LIST_PAYMENTS.SUMMARY.TITLE' })}:
      </span>
      <ul className={styles.summary}>
        <li className={styles.total}>{data.total}</li>
        <li className={styles.received}>{data.received}</li>
        <li className={styles.refunded}>{data.refunded}</li>
        <li className={styles.removed}>{data.removed}</li>
      </ul>
    </div>
  );
};

Summary.propTypes = {
  data: PropTypes.object.isRequired,
};

export default memo(Summary);
