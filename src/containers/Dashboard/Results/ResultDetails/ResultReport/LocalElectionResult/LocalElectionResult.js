import {
  fetchLocalElectionResult,
  getFetching,
  getLocalElectionResult,
} from '@/redux/ducks/results.duck';
import React, { memo, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import Loading from '@/components/Loading';
import { getCountriesLookup } from '@/redux/ducks/countries.duck';
import { CROATIA_COUNTRY_NAME } from '@/constants/member';
import { useParams } from 'react-router';
import ElectionYearResult from './ElectionYearResult';
import styles from './localElectionResult.module.scss';

const LocalElectionResult = () => {
  const [tabIndex, setTabIndex] = useState(0);

  const { county, municipality, settlement, electionUnit } = useParams();

  const dispatch = useDispatch();
  const isFetching = useSelector(getFetching);
  const countriesLookup = useSelector(getCountriesLookup);
  const localElectionResult = useSelector(getLocalElectionResult);

  useEffect(() => {
    const countryObj = countriesLookup && countriesLookup[CROATIA_COUNTRY_NAME];
    const countyObj = countryObj
      && countryObj.counties
      && countryObj.counties[county?.toUpperCase()];
    const countyId = countyObj && countyObj.id;

    const municipalityObj = countyObj
      && countyObj.municipalities
      && countyObj.municipalities[municipality?.toUpperCase()];
    const municipalityId = municipalityObj && municipalityObj.id;

    const settlementObj = municipalityObj
      && municipalityObj.settlements
      && municipalityObj.settlements[settlement?.toUpperCase()];
    const settlementId = settlementObj && settlementObj.id;

    const filter = {
      electionUnitNumber: electionUnit,
      countyId,
      municipalityId,
      settlementId,
    };

    dispatch(fetchLocalElectionResult(filter));
  }, []);

  const tabs = useMemo(() => {
    const yearTabs = [];
    const yearTabPanels = [];
    Object.keys(localElectionResult).forEach(key => {
      yearTabs.push(<Tab key={`yeartab_${key}`}>{key}</Tab>);
      yearTabPanels.push(
        (
          <TabPanel key={`yeartabpanel_${key}`}>
            <ElectionYearResult data={localElectionResult[key]} />
          </TabPanel>
        ),
      );
    });

    return {
      yearTabs,
      yearTabPanels,
    };
  }, [localElectionResult]);

  return (
    <div className={styles.container}>
      {
        isFetching ? (
          <div className={styles.center}><Loading /></div>
        ) : (
          <Tabs selectedIndex={tabIndex} onSelect={setTabIndex}>
            <TabList>{tabs.yearTabs}</TabList>
            {tabs.yearTabPanels}
          </Tabs>
        )
      }
    </div>
  );
};

export default memo(LocalElectionResult);
