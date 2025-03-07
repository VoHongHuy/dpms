import React, { memo } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import styles from './resultSubUnitsList.module.scss';

const ResultSubUnitsList = ({ data }) => {
  const intl = useIntl();
  return (
    <div className={styles.container}>
      {data.map(item => (
        <div key={item.id} className={styles.item}>
          <div className={styles.header}>{item.name}</div>
          <div className={styles.content}>
            <div className={styles.notes}>
              {
                intl.formatMessage({ id: 'RESULT.RESULT_DETAILS.TABS.SUB_UNIT.NOTES' })
              }: {item.notes}
            </div>
            <div className={styles.subUnitNotes}>
              {
                intl.formatMessage({ id: 'RESULT.RESULT_DETAILS.TABS.SUB_UNIT.SUB_UNIT_NOTES' })
              }: {item.subUnitNotes}
            </div>
            <div className={styles.actions}>
              <Link to={item.link}>
                {
                  intl.formatMessage({ id: 'RESULT.RESULT_DETAILS.TABS.SUB_UNIT.ACTIONS.SELECT' })
                }
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

ResultSubUnitsList.defaultProps = {
  data: [],
};

ResultSubUnitsList.propTypes = {
  data: PropTypes.array,
};

export default memo(ResultSubUnitsList);
