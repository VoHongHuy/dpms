import React, { memo, useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import { getCountriesLookup } from '@/redux/ducks/countries.duck';
import { CROATIA_COUNTRY_NAME } from '@/constants/member';
import ResultNoteList from './ResultNoteList';

import styles from './resultNotes.module.scss';

const ResultNotes = ({
  data,
  county,
  municipality,
  settlement,
  electionUnit,
  refresh,
}) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [notes, setNotes] = useState(data);
  const countriesLookup = useSelector(getCountriesLookup);

  const filters = useMemo(() => {
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

    return {
      countyId,
      municipalityId,
      settlementId,
      electionUnitNumber: electionUnit ? Number(electionUnit) : undefined,
    };
  }, [
    county,
    municipality,
    settlement,
    electionUnit,
  ]);

  useEffect(() => {
    const {
      countyId,
      municipalityId,
      settlementId,
      electionUnitNumber,
    } = filters;

    switch (tabIndex) {
      case 0:
        setNotes(data);
        break;
      case 1:
        if (!electionUnitNumber && !countyId && !municipalityId && !settlementId) {
          const newData = data.filter(
            m => !m.electionUnitNumber
            && !m.countyId
            && !m.municipalityId
            && !m.settlementId,
          );
          setNotes(newData);
        } else {
          const newData = data.filter(
            m => (!electionUnitNumber || m.electionUnitNumber === electionUnitNumber)
            && m.countyId === countyId
            && m.municipalityId === municipalityId
            && m.settlementId === settlementId,
          );
          setNotes(newData);
        }
        break;
      case 2:
        if (settlementId) {
          setNotes([]);
        } else if (municipalityId) {
          const newData = data.filter(
            m => m.municipalityId === municipalityId
            && m.settlementId,
          );
          setNotes(newData);
        } else if (countyId) {
          const newData = data.filter(
            m => m.countyId === countyId
            && m.municipalityId,
          );
          setNotes(newData);
        } else if (electionUnitNumber) {
          const newData = data.filter(
            m => m.electionUnitNumber === electionUnitNumber
            && m.countyId,
          );
          setNotes(newData);
        } else {
          const newData = data.filter(
            m => m.electionUnitNumber
            || m.countyId,
          );
          setNotes(newData);
        }
        break;
      default:
        break;
    }
  }, [
    data,
    tabIndex,
    filters,
  ]);
  const intl = useIntl();

  return (
    <div className={styles.container}>
      <Tabs selectedIndex={tabIndex} onSelect={setTabIndex}>
        <TabList>
          <Tab>{intl.formatMessage({ id: 'RESULT.RESULT_DETAILS.TABS.NOTES.All_TAB' })}</Tab>
          <Tab>{intl.formatMessage({ id: 'RESULT.RESULT_DETAILS.TABS.NOTES.UNIT_TAB' })}</Tab>
          <Tab>
            {intl.formatMessage({ id: 'RESULT.RESULT_DETAILS.TABS.NOTES.SUB_UNIT_TAB' })}
          </Tab>
        </TabList>
        <TabPanel>
          <ResultNoteList
            {...filters}
            data={notes}
            refresh={refresh}
          />
        </TabPanel>
        <TabPanel>
          <ResultNoteList
            {...filters}
            data={notes}
            refresh={refresh}
          />
        </TabPanel>
        <TabPanel>
          <ResultNoteList
            {...filters}
            data={notes}
            refresh={refresh}
          />
        </TabPanel>
      </Tabs>
    </div>
  );
};

ResultNotes.defaultProps = {
  data: [],
  county: undefined,
  municipality: undefined,
  settlement: undefined,
  electionUnit: undefined,
};

ResultNotes.propTypes = {
  data: PropTypes.array,
  county: PropTypes.string,
  municipality: PropTypes.string,
  settlement: PropTypes.string,
  electionUnit: PropTypes.string,
  refresh: PropTypes.func.isRequired,
};

export default memo(ResultNotes);
