import React, { memo, useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import { v1 } from 'uuid';
import { withRouter } from 'react-router';
import { CROATIA_COUNTRY_NAME } from '@/constants/member';
import { getCroatiaData, getCountriesLookup } from '@/redux/ducks/countries.duck';
import { getNoteResult } from '@/redux/ducks/results.duck';
import { PATHS } from '@/containers/Dashboard/constants';
import electionUnits from '@/assets/geojson/election-units.json';
import electionRegions from '@/assets/geojson/election-regions.json';
import ResultSubUnitsFilter from './ResultSubUnitsFilter';
import ResultSubUnitsList from './ResultSubUnitsList';

import styles from './resultSubUnits.module.scss';

const ResultSubUnits = ({
  match,
  county,
  municipality,
  settlement,
  electionUnit,
  electionRegion,
}) => {
  const intl = useIntl();
  const { url } = match;
  const noteResult = useSelector(getNoteResult);
  const [filters, setFilters] = useState({});
  const [filteredData, setFilteredData] = useState([]);
  const handleFilterChange = filterValues => {
    setFilters(!filterValues ? { } : { ...filters, ...filterValues });
  };
  const croatiaLookup = useSelector(getCroatiaData);
  const countriesLookup = useSelector(getCountriesLookup);

  const generateNoteResultFilters = (
    county, municipality, settlement, electionUnit,
  ) => {
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
  };

  const initialData = useMemo(() => {
    const data = [];
    if (url.includes(PATHS.RESULT_ELECTIONS)) {
      const path = PATHS.RESULT_ELECTIONS;
      if (electionRegion) {
        return data;
      }

      if (electionUnit) {
        electionRegions.features.filter(
          electionRegion => electionRegion.properties.electionUnit === Number(electionUnit),
        ).forEach(electionRegion => {
          const {
            type,
            settlement,
            municipality,
            electionUnit,
            county,
          } = electionRegion.properties;
          const noteFilters = generateNoteResultFilters(
            county,
            municipality,
            settlement,
            electionUnit,
          );
          const regionName = type === 'MUNICIPALITY' ? municipality : settlement;
          data.push({
            id: v1(),
            name: regionName,
            link: `${path}/${electionUnit}/${regionName}`,
            notes: noteResult.filter(
              m => m.municipalityId === noteFilters.municipalityId
                && m.settlementId === noteFilters.settlementId,
            ).length,
            subUnitNotes: 0,
          });
        });
      } else {
        electionUnits.features.forEach(electionUnit => {
          data.push({
            id: v1(),
            name: `${electionUnit.properties.electionUnit}`,
            link: `${path}/${electionUnit.properties.electionUnit}`,
            notes: noteResult.filter(
              m => m.electionUnitNumber === electionUnit.properties.electionUnit
                && !m.county
                && !m.municipalityId
                && !m.settlementId,
            ).length,
            subUnitNotes: noteResult.filter(
              m => m.electionUnitNumber === electionUnit.properties.electionUnit
                && (m.county || m.municipalityId || m.settlementId),
            ).length,
          });
        });
      }
    } else {
      const path = PATHS.RESULT_COUNTIES;
      if (settlement) {
        return data;
      }

      if (municipality) {
        const selectedCounty = croatiaLookup
          && croatiaLookup.counties
          && croatiaLookup.counties.find(
            lookup => lookup.name?.toUpperCase() === county?.toUpperCase(),
          );
        const selectedMunicipality = selectedCounty
          && selectedCounty.municipalities
          && selectedCounty.municipalities.find(
            lookup => lookup.name?.toUpperCase() === municipality?.toUpperCase(),
          );
        if (selectedMunicipality && selectedMunicipality.settlements) {
          selectedMunicipality.settlements.forEach(currentSettlement => {
            const settlementName = currentSettlement.name;
            const noteFilters = generateNoteResultFilters(
              county,
              municipality,
              settlementName,
            );
            data.push({
              id: v1(),
              name: settlementName,
              link: `${path}/${county}/${municipality}/${settlementName}`,
              notes: noteResult.filter(
                m => m.countyId === noteFilters.countyId
                  && m.municipalityId === noteFilters.municipalityId
                  && m.settlementId === noteFilters.settlementId,
              ).length,
              subUnitNotes: 0,
            });
          });
        }
      } else if (county) {
        const selectedCounty = croatiaLookup
          && croatiaLookup.counties
          && croatiaLookup.counties.find(
            lookup => lookup.name?.toUpperCase() === county?.toUpperCase(),
          );
        if (selectedCounty && selectedCounty.municipalities) {
          selectedCounty.municipalities.forEach(currentMunicipality => {
            const municipalityName = currentMunicipality.name;
            const noteFilters = generateNoteResultFilters(
              county,
              municipalityName,
            );
            data.push({
              id: v1(),
              name: municipalityName,
              link: `${path}/${county}/${municipalityName}`,
              notes: noteResult.filter(
                m => m.countyId === noteFilters.countyId
                  && m.municipalityId === noteFilters.municipalityId
                  && !m.settlementId,
              ).length,
              subUnitNotes: noteResult.filter(
                m => m.countyId === noteFilters.countyId
                  && m.municipalityId === noteFilters.municipalityId
                  && m.settlementId,
              ).length,
            });
          });
        }
      } else {
        croatiaLookup.counties.forEach(currentCounty => {
          const countyName = currentCounty.name;
          const noteFilters = generateNoteResultFilters(
            countyName,
          );
          data.push({
            id: v1(),
            name: countyName,
            link: `${path}/${countyName}`,
            notes: noteResult.filter(
              m => m.countyId === noteFilters.countyId
                && !m.municipalityId
                && !m.settlementId,
            ).length,
            subUnitNotes: noteResult.filter(
              m => m.countyId === noteFilters.countyId
                && m.municipalityId
                && m.settlementId,
            ).length,
          });
        });
      }
    }

    return data;
  }, [noteResult]);

  useEffect(() => {
    const filteredData = initialData.filter(
      data => !filters.name || data.name.toUpperCase().includes(filters.name.toUpperCase()),
    );
    setFilteredData(filteredData);
  }, [filters, initialData]);

  return (
    <div className={styles.container}>
      {
        initialData.length > 0 ? (
          <>
            <ResultSubUnitsFilter onChange={handleFilterChange} />
            {filteredData.length > 0 ? (
              <ResultSubUnitsList data={filteredData} />
            ) : (
              <>
                {intl.formatMessage({ id: 'TABLE.EMPTY.TEXT' })}
              </>
            )}
          </>
        ) : (
          <>
            {intl.formatMessage({ id: 'TABLE.EMPTY.TEXT' })}
          </>
        )
      }
    </div>
  );
};

ResultSubUnits.defaultProps = {
  county: undefined,
  municipality: undefined,
  settlement: undefined,
  electionUnit: undefined,
  electionRegion: undefined,
};

ResultSubUnits.propTypes = {
  match: PropTypes.object.isRequired,
  county: PropTypes.string,
  municipality: PropTypes.string,
  settlement: PropTypes.string,
  electionUnit: PropTypes.string,
  electionRegion: PropTypes.string,
};

export default memo(withRouter(ResultSubUnits));
