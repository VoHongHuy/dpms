import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import { useIntl } from 'react-intl';
import ElectionRoundResult from './ElectionRoundResult';

import styles from './electionYearResult.module.scss';

const ElectionYearResult = ({ data }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const intl = useIntl();

  const roundTabs = [];
  const roundTabPanels = [];
  Object.keys(data).forEach(key => {
    roundTabs.push(
      (
        <Tab key={`roundtab_${key}`}>{intl.formatMessage(
          {
            id: 'RESULT.RESULT_DETAILS.TABS.RESULT.REPORT.TABS.GENERAL.TABS.ROUND',
          })} {key}
        </Tab>
      ),
    );
    roundTabPanels.push(
      (
        <TabPanel key={`roundtabpanel_${key}`}>
          <ElectionRoundResult data={data[key]} />
        </TabPanel>
      ),
    );
  });

  return (
    <div className={styles.container}>
      <Tabs selectedIndex={tabIndex} onSelect={setTabIndex}>
        <TabList>{roundTabs}</TabList>
        {roundTabPanels}
      </Tabs>
    </div>
  );
};

ElectionYearResult.propTypes = {
  data: PropTypes.object.isRequired,
};

export default memo(ElectionYearResult);
