import React, { memo, useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import { CROATIA_COUNTRY_NAME } from '@/constants/member';
import { getCountriesLookup } from '@/redux/ducks/countries.duck';
import { fetchNoteResult, getNoteResult } from '@/redux/ducks/results.duck';
import ResultNotes from './ResultNotes';
import ResultReport from './ResultReport';
import ResultSubUnits from './ResultSubUnits';

import styles from './resultDetails.module.scss';
import ContactInformation from './ContactInformation';

const ResultDetails = ({
  county,
  municipality,
  settlement,
  electionUnit,
  electionRegion,
}) => {
  const [tabIndex, setTabIndex] = useState(0);
  const dispatch = useDispatch();
  const intl = useIntl();
  const countriesLookup = useSelector(getCountriesLookup);
  const noteResult = useSelector(getNoteResult);

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

    const filters = {
      countyId,
      municipalityId,
      settlementId,
      electionUnitNumber: electionUnit,
    };

    return filters;
  }, [countriesLookup, county, municipality, settlement, electionUnit]);

  const fetchNoteResultData = () => {
    dispatch(fetchNoteResult(filters));
  };

  useEffect(() => {
    fetchNoteResultData();
  }, []);

  return (
    <div className={styles.container}>
      <Tabs selectedIndex={tabIndex} onSelect={setTabIndex}>
        <TabList>
          <Tab>{intl.formatMessage({ id: 'RESULT.RESULT_DETAILS.TABS.RESULT' })}</Tab>
          <Tab>{intl.formatMessage({ id: 'RESULT.RESULT_DETAILS.TABS.SUB_UNIT' })}</Tab>
          <Tab>
            {intl.formatMessage({ id: 'RESULT.RESULT_DETAILS.TABS.NOTES' })} ({noteResult.length})
          </Tab>
          {
            (county || municipality || settlement) && (
              <Tab>
                {intl.formatMessage({ id: 'RESULT.RESULT_DETAILS.TABS.CONTACT' })}
              </Tab>
            )
          }
        </TabList>
        <TabPanel>
          <ResultReport
            county={county}
            municipality={municipality}
            settlement={settlement}
            electionUnit={electionUnit}
          />
        </TabPanel>
        <TabPanel>
          <ResultSubUnits
            county={county}
            municipality={municipality}
            settlement={settlement}
            electionUnit={electionUnit}
            electionRegion={electionRegion}
          />
        </TabPanel>
        <TabPanel>
          <ResultNotes
            data={noteResult}
            county={county}
            municipality={municipality}
            settlement={settlement}
            electionUnit={electionUnit}
            refresh={fetchNoteResultData}
          />
        </TabPanel>
        {
          (county || municipality || settlement) && (
            <TabPanel>
              <ContactInformation
                county={county}
                municipality={municipality}
                settlement={settlement}
              />
            </TabPanel>
          )
        }
      </Tabs>
    </div>
  );
};

ResultDetails.defaultProps = {
  county: undefined,
  municipality: undefined,
  settlement: undefined,
  electionUnit: undefined,
  electionRegion: undefined,
};

ResultDetails.propTypes = {
  county: PropTypes.string,
  municipality: PropTypes.string,
  settlement: PropTypes.string,
  electionUnit: PropTypes.string,
  electionRegion: PropTypes.string,
};

export default memo(ResultDetails);
