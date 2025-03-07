import React, { memo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import { getParliamentaryResult, fetchParliamentaryResult } from '@/redux/ducks/results.duck.js';
import ParliamentaryResultDetails from './ParliamentaryResultDetails.js';

import styles from './parliamentaryResult.module.scss';

const ParliamentaryResult = ({
  county,
  municipality,
  settlement,
  electionUnit,
}) => {
  const [tabIndex, setTabIndex] = useState(0);
  const dispatch = useDispatch();
  const parliamentaryResult = useSelector(getParliamentaryResult);
  const fetchParliamentaryResultData = filters => dispatch(fetchParliamentaryResult(filters));
  return (
    <div className={styles.container}>
      <Tabs selectedIndex={tabIndex} onSelect={setTabIndex}>
        <TabList>
          <Tab>2020</Tab>
          <Tab>2016</Tab>
        </TabList>
        <TabPanel>
          <ParliamentaryResultDetails
            electionYear="2020"
            county={county}
            municipality={municipality}
            settlement={settlement}
            electionUnit={electionUnit}
            data={parliamentaryResult}
            fetchData={fetchParliamentaryResultData}
          />
        </TabPanel>
        <TabPanel>
          <ParliamentaryResultDetails
            electionYear="2016"
            county={county}
            municipality={municipality}
            settlement={settlement}
            electionUnit={electionUnit}
            data={parliamentaryResult}
            fetchData={fetchParliamentaryResultData}
          />
        </TabPanel>
      </Tabs>
    </div>
  );
};

ParliamentaryResult.defaultProps = {
  county: undefined,
  municipality: undefined,
  settlement: undefined,
  electionUnit: undefined,
};

ParliamentaryResult.propTypes = {
  county: PropTypes.string,
  municipality: PropTypes.string,
  settlement: PropTypes.string,
  electionUnit: PropTypes.string,
};

export default memo(ParliamentaryResult);
