import React, { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { fetchPollingStations, getPollingStations } from '@/redux/ducks/organization.duck';
import PollingStationFilter from './PollingStationFilter';
import PollingStationList from './PollingStationList';

import styles from './pollingStations.module.scss';

const PollingStations = ({ onPollingStationClick }) => {
  const {
    electionRegion,
  } = useParams();

  const dispatch = useDispatch();
  const pollingStations = useSelector(getPollingStations, shallowEqual);
  const [filters, setFilters] = useState({ electionRegion });

  const handleFilterChange = filterValues => {
    setFilters(!filterValues ? { electionRegion } : { ...filters, ...filterValues });
  };

  useEffect(() => {
    dispatch(fetchPollingStations({ filters }));
  }, [filters]);

  return (
    <div className={styles.container}>
      <PollingStationFilter onChange={handleFilterChange} />
      <PollingStationList
        isFetching={pollingStations.fetching}
        data={pollingStations.data}
        onPollingStationClick={onPollingStationClick}
      />
    </div>
  );
};

PollingStations.propTypes = {
  onPollingStationClick: PropTypes.func.isRequired,
};

export default memo(PollingStations);
