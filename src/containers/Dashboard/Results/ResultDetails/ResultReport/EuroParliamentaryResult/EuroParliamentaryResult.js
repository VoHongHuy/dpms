import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchEuroParliamentaryResult,
  getEuroParliamentaryResult,
} from '@/redux/ducks/results.duck';
import ParliamentaryResultDetails from '../ParliamentaryResult/ParliamentaryResultDetails.js';

const EuroParliamentaryResult = ({
  county,
  municipality,
  settlement,
  electionUnit,
}) => {
  const dispatch = useDispatch();
  const parliamentaryResult = useSelector(getEuroParliamentaryResult);
  const fetchParliamentaryResultData = filters => dispatch(fetchEuroParliamentaryResult(filters));
  return (
    <ParliamentaryResultDetails
      electionYear="2019"
      county={county}
      municipality={municipality}
      settlement={settlement}
      electionUnit={electionUnit}
      data={parliamentaryResult}
      fetchData={fetchParliamentaryResultData}
    />
  );
};

EuroParliamentaryResult.defaultProps = {
  county: undefined,
  municipality: undefined,
  settlement: undefined,
  electionUnit: undefined,
};

EuroParliamentaryResult.propTypes = {
  county: PropTypes.string,
  municipality: PropTypes.string,
  settlement: PropTypes.string,
  electionUnit: PropTypes.string,
};

export default memo(EuroParliamentaryResult);
