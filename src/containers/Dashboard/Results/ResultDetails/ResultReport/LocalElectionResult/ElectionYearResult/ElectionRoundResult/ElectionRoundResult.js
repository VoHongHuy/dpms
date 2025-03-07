import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import { useIntl } from 'react-intl';
import { RESULT } from '@/constants';
import ElectionTypeResult from './ElectionTypeResult';
import styles from './electionRoundResult.module.scss';

const ElectionRoundResult = ({ data }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const intl = useIntl();

  const getLocalElectionTypeMsgId = (value) => {
    switch (value) {
      case RESULT.LOCAL_ELECTION_TYPE.COUNTY_PARLIAMENT:
        return 'RESULT.RESULT_DETAILS.TABS.RESULT.REPORT.TABS.LOCAL.TYPE.COUNTY_PARLIAMENT';
      case RESULT.LOCAL_ELECTION_TYPE.COUNTY_MAJOR:
        return 'RESULT.RESULT_DETAILS.TABS.RESULT.REPORT.TABS.LOCAL.TYPE.COUNTY_MAJOR';
      case RESULT.LOCAL_ELECTION_TYPE.MUNICIPALITY_PARLIAMENT:
        return 'RESULT.RESULT_DETAILS.TABS.RESULT.REPORT.TABS.LOCAL.TYPE.MUNICIPALITY_PARLIAMENT';
      case RESULT.LOCAL_ELECTION_TYPE.MUNICIPALITY_MAJOR:
        return 'RESULT.RESULT_DETAILS.TABS.RESULT.REPORT.TABS.LOCAL.TYPE.MUNICIPALITY_MAJOR';
      default:
        return '';
    }
  };

  const typeTabs = [];
  const typeTabPanels = [];
  Object.keys(data).forEach(key => {
    typeTabs.push(
      (
        <Tab key={`typetab_${key}`}>{intl.formatMessage(
          {
            id: getLocalElectionTypeMsgId(key),
          })}
        </Tab>
      ),
    );
    typeTabPanels.push(
      (
        <TabPanel key={`typetab_${key}`}>
          <ElectionTypeResult data={data[key]} />
        </TabPanel>
      ),
    );
  });

  return (
    <div className={styles.container}>
      <Tabs selectedIndex={tabIndex} onSelect={setTabIndex}>
        <TabList>{typeTabs}</TabList>
        {typeTabPanels}
      </Tabs>
    </div>
  );
};

ElectionRoundResult.propTypes = {
  data: PropTypes.object.isRequired,
};

export default memo(ElectionRoundResult);
