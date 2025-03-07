import React, { memo, useState } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import ParliamentaryResult from './ParliamentaryResult';
import PresidentialResult from './PresidentialResult';
import EuroParliamentaryResult from './EuroParliamentaryResult';
import LocalElectionResult from './LocalElectionResult';

import styles from './resultReport.module.scss';

const ResultReport = ({
  county,
  municipality,
  settlement,
  electionUnit,
}) => {
  const intl = useIntl();
  const [tabIndex, setTabIndex] = useState(0);
  return (
    <div className={styles.container}>
      <Tabs selectedIndex={tabIndex} onSelect={setTabIndex}>
        <TabList>
          <Tab>
            {intl.formatMessage({
              id: 'RESULT.RESULT_DETAILS.TABS.RESULT.REPORT.TABS.PARLIAMENTARY',
            })}
          </Tab>
          <Tab>
            {intl.formatMessage({
              id: 'RESULT.RESULT_DETAILS.TABS.RESULT.REPORT.TABS.PRESIDENTIAL',
            })} 2019
          </Tab>
          <Tab>
            {intl.formatMessage({
              id: 'RESULT.RESULT_DETAILS.TABS.RESULT.REPORT.TABS.EURO_PARLIAMENTARY',
            })} 2019
          </Tab>
          <Tab>
            {intl.formatMessage({
              id: 'RESULT.RESULT_DETAILS.TABS.RESULT.REPORT.TABS.LOCAL',
            })}
          </Tab>
        </TabList>
        <TabPanel>
          <ParliamentaryResult
            county={county}
            municipality={municipality}
            settlement={settlement}
            electionUnit={electionUnit}
          />
        </TabPanel>
        <TabPanel>
          <PresidentialResult
            county={county}
            municipality={municipality}
            settlement={settlement}
            electionUnit={electionUnit}
          />
        </TabPanel>
        <TabPanel>
          <EuroParliamentaryResult
            county={county}
            municipality={municipality}
            settlement={settlement}
            electionUnit={electionUnit}
          />
        </TabPanel>
        <TabPanel>
          <LocalElectionResult />
        </TabPanel>
      </Tabs>
    </div>
  );
};

ResultReport.defaultProps = {
  county: undefined,
  municipality: undefined,
  settlement: undefined,
  electionUnit: undefined,
};

ResultReport.propTypes = {
  county: PropTypes.string,
  municipality: PropTypes.string,
  settlement: PropTypes.string,
  electionUnit: PropTypes.string,
};

export default memo(ResultReport);
