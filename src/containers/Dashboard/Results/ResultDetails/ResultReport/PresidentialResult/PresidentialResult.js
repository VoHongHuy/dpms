import React, { memo, useState } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import PresidentialResultDetails from './PresidentialResultDetails';

const PresidentialResult = ({
  county,
  municipality,
  settlement,
  electionUnit,
}) => {
  const intl = useIntl();
  const [tabIndex, setTabIndex] = useState(0);
  return (
    <Tabs selectedIndex={tabIndex} onSelect={setTabIndex}>
      <TabList>
        <Tab>
          {intl.formatMessage({
            id: 'RESULT.RESULT_DETAILS.TABS.RESULT.REPORT.TABS.GENERAL.TABS.ROUND',
          })} 1
        </Tab>
        <Tab>
          {intl.formatMessage({
            id: 'RESULT.RESULT_DETAILS.TABS.RESULT.REPORT.TABS.GENERAL.TABS.ROUND',
          })} 2
        </Tab>
      </TabList>
      <TabPanel>
        <PresidentialResultDetails
          electionYear="2019"
          electionRound="1"
          county={county}
          municipality={municipality}
          settlement={settlement}
          electionUnit={electionUnit}
        />
      </TabPanel>
      <TabPanel>
        <PresidentialResultDetails
          electionYear="2019"
          electionRound="2"
          county={county}
          municipality={municipality}
          settlement={settlement}
          electionUnit={electionUnit}
        />
      </TabPanel>
    </Tabs>
  );
};

PresidentialResult.defaultProps = {
  county: undefined,
  municipality: undefined,
  settlement: undefined,
  electionUnit: undefined,
};

PresidentialResult.propTypes = {
  county: PropTypes.string,
  municipality: PropTypes.string,
  settlement: PropTypes.string,
  electionUnit: PropTypes.string,
};

export default memo(PresidentialResult);
