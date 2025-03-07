import React, { memo, useMemo } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { formatter } from '@/utils';

import styles from './generalResult.module.scss';

const GeneralResult = ({
  data: {
    totalVoterCount,
    votersVotedCount,
    voterCountByBallots,
    validBallotsCount,
    invalidBallotsCount,
  },
}) => {
  const intl = useIntl();

  const calculatePercent = (value) => ((value * 100) / (totalVoterCount)).toFixed(2);

  const percentData = useMemo(() => ({
    votersVotedCountPercent: totalVoterCount && calculatePercent(votersVotedCount),
    voterCountByBallotsPercent: totalVoterCount && calculatePercent(voterCountByBallots),
    validBallotsCountPercent: totalVoterCount && calculatePercent(validBallotsCount),
    invalidBallotsCountPercent: totalVoterCount && calculatePercent(invalidBallotsCount),
  }), [
    totalVoterCount,
    votersVotedCount,
    voterCountByBallots,
    validBallotsCount,
    invalidBallotsCount]);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.flexContainer}>
          <div
            title={intl.formatMessage({
              id: 'RESULT.RESULT_DETAILS.GENERAL_INFO.TOTAL_VOTER_COUNT',
            })}
            className={styles.heading}
          >
            {intl.formatMessage({
              id: 'RESULT.RESULT_DETAILS.GENERAL_INFO.TOTAL_VOTER_COUNT',
            })}:
          </div>
          <div className={styles.numeric}>{formatter.number.hr(totalVoterCount)}</div>
          <div />
        </div>
        <div className={styles.flexContainer}>
          <div
            title={intl.formatMessage({
              id: 'RESULT.RESULT_DETAILS.GENERAL_INFO.VOTERS_VOTED_COUNT',
            })}
            className={styles.heading}
          >
            {intl.formatMessage({
              id: 'RESULT.RESULT_DETAILS.GENERAL_INFO.VOTERS_VOTED_COUNT',
            })}:
          </div>
          <div className={styles.numeric}>{formatter.number.hr(votersVotedCount)}</div>
          <div className={styles.percent}>
            {formatter.number.hr(percentData.votersVotedCountPercent)}%
          </div>
        </div>
        <div className={styles.flexContainer}>
          <div
            title={intl.formatMessage({
              id: 'RESULT.RESULT_DETAILS.GENERAL_INFO.VOTER_COUNT_BY_BALLOTS',
            })}
            className={styles.heading}
          >
            {intl.formatMessage({
              id: 'RESULT.RESULT_DETAILS.GENERAL_INFO.VOTER_COUNT_BY_BALLOTS',
            })}:
          </div>
          <div className={styles.numeric}>{formatter.number.hr(voterCountByBallots)}</div>
          <div className={styles.percent}>
            {formatter.number.hr(percentData.voterCountByBallotsPercent)}%
          </div>
        </div>
        <div className={styles.flexContainer}>
          <div
            title={intl.formatMessage({
              id: 'RESULT.RESULT_DETAILS.GENERAL_INFO.VALID_BALLOTS_COUNT',
            })}
            className={styles.heading}
          >
            {intl.formatMessage({
              id: 'RESULT.RESULT_DETAILS.GENERAL_INFO.VALID_BALLOTS_COUNT',
            })}:
          </div>
          <div className={styles.numeric}>{formatter.number.hr(validBallotsCount)}</div>
          <div className={styles.percent}>
            {formatter.number.hr(percentData.validBallotsCountPercent)}%
          </div>
        </div>
        <div className={styles.flexContainer}>
          <div
            title={intl.formatMessage({
              id: 'RESULT.RESULT_DETAILS.GENERAL_INFO.INVALID_BALLOTS_COUNT',
            })}
            className={styles.heading}
          >
            {intl.formatMessage({
              id: 'RESULT.RESULT_DETAILS.GENERAL_INFO.INVALID_BALLOTS_COUNT',
            })}:
          </div>
          <div className={styles.numeric}>{formatter.number.hr(invalidBallotsCount)}</div>
          <div className={styles.percent}>
            {formatter.number.hr(percentData.invalidBallotsCountPercent)}%
          </div>
        </div>
      </div>
    </div>
  );
};

GeneralResult.propTypes = {
  data: PropTypes.shape({
    totalVoterCount: PropTypes.number,
    votersVotedCount: PropTypes.number,
    voterCountByBallots: PropTypes.number,
    validBallotsCount: PropTypes.number,
    invalidBallotsCount: PropTypes.number,
  }).isRequired,
};

export default memo(GeneralResult);
