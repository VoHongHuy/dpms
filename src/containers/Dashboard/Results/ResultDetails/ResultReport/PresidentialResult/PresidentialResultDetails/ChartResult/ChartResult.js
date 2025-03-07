import React, { memo } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import Progress from '@/components/Progress';
import { formatter } from '@/utils';

import styles from './chartResult.module.scss';

const ChartResult = ({ data }) => {
  const intl = useIntl();

  return (
    <div className={styles.container}>
      <div className={styles.heading}>
        {intl.formatMessage({ id: 'RESULT.RESULT_DETAILS.CHART.TITLE' })}
      </div>
      <div className={styles.content}>
        {data.map((item) => (
          <div
            key={item.key}
            className={styles.item}
            title={`${formatter.number.hr(item.percent)}% - ${item.text}`}
          >
            <Progress percent={item.percent} primary>
              <span>{formatter.number.hr(item.percent)}% - {item.text}</span>
            </Progress>
          </div>
        ))}
      </div>
    </div>
  );
};

ChartResult.defaultProps = {
  data: [],
};

ChartResult.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string.isRequired,
    percent: PropTypes.string.isRequired,
  })),
};

export default memo(ChartResult);
