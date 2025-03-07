import React, { memo, useMemo, useEffect } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import { useIntl } from 'react-intl';
import { getCountriesLookup, fetchCountries } from '@/redux/ducks/countries.duck';
import {
  getPollingStations,
  getCountAllocatedMembersParliamentary,
  fetchCountAllocatedMembersForParliamentaryUnit,
} from '@/redux/ducks/organization.duck';
import history from '@/history';
import ElectionMap from '@/components/ElectionMap';
import { ORGANIZATION } from '@/constants';
import { CROATIA_COUNTRY_NAME } from '@/constants/member';
import electionRegions from '@/assets/geojson/election-regions.json';
import OrganizationNav from '../OrganizationNav';
import AllocatedMembers from './AllocatedMembers';
import ExportToolbar from '../ExportToolbar';
import { PATHS } from '../../constants';

import styles from './parliamentaryElection.module.scss';

const exportUrl = 'api/parliamentary/member/export';

const ParliamentaryElection = () => {
  const {
    electionUnit,
    electionRegion,
    pollingStation,
  } = useParams();
  const intl = useIntl();
  const dispatch = useDispatch();

  const countriesLookup = useSelector(getCountriesLookup);
  const allocatedMembersCount = useSelector(getCountAllocatedMembersParliamentary);
  const pollingStations = useSelector(getPollingStations, shallowEqual);

  const requestAllocatedMembersCount = (event) => {
    const {
      municipality,
      settlement,
      type,
      electionUnit: selectedElectionUnit,
    } = event.target.feature.properties;
    const filters = {
      electionUnit: selectedElectionUnit,
      pollingStation,
    };
    if (type) {
      if (type === ORGANIZATION.TYPE.MUNICIPALITY) {
        filters.electionRegion = municipality;
      } else {
        filters.electionRegion = settlement;
      }
    }
    dispatch(fetchCountAllocatedMembersForParliamentaryUnit({ filters }));
  };

  const selectFeatureHandler = (feature) => {
    const {
      municipality,
      settlement,
      type,
      electionUnit,
    } = feature.properties;

    const filters = {
      electionUnit,
    };

    if (type) {
      filters.electionRegion = type === ORGANIZATION.TYPE.MUNICIPALITY ? municipality : settlement;
    }

    const routes = [
      PATHS.PARLIAMENTARY_ELECTION,
      filters.electionUnit,
      filters.electionRegion,
    ];
    const path = routes.filter(r => r).join('/');

    history.push(path);
  };

  const generateLinks = () => {
    const path = PATHS.PARLIAMENTARY_ELECTION;
    const links = [{
      name: intl.formatMessage({ id: 'ORGANIZATION.CROATIA' }),
      path,
    }];

    if (electionUnit) {
      const link = {
        name: intl.formatMessage({ id: 'ORGANIZATION.ELECTION_UNIT' }, { electionUnit }),
        path: `${path}/${electionUnit}`,
      };
      links.push(link);
    }
    if (electionRegion) {
      const selectedElectionRegion = electionRegions.features.find(feature =>
        feature.properties.municipality.toLowerCase() === electionRegion.toLowerCase() ||
        feature.properties.settlement?.toLowerCase() === electionRegion.toLowerCase());
      const { type, municipality, settlement } = selectedElectionRegion.properties;
      const link = {
        name: type === ORGANIZATION.TYPE.MUNICIPALITY ?
          municipality : `${settlement} (${municipality})`,
        path: `${path}/${electionUnit}/${electionRegion}`,
      };
      links.push(link);
    }
    if (pollingStation) {
      const pollingStationData = pollingStations.data.find(m => m.id === Number(pollingStation));
      if (pollingStationData) {
        const link = {
          name: `(${pollingStationData.number}) ${pollingStationData.name}`,
          path: `${path}/${electionUnit}/${electionRegion}/${pollingStation}`,
        };
        links.push(link);
      }
    }

    return links;
  };

  const links = useMemo(() => generateLinks(),
    [electionUnit, electionRegion, pollingStation, pollingStations]);

  const selectedRegion = useMemo(() => links[links.length - 1].name, [links]);

  const handlePollingStationClick = (pollingStation) => {
    // eslint-disable-next-line max-len
    const url = `${PATHS.PARLIAMENTARY_ELECTION}/${electionUnit}/${electionRegion}/${pollingStation.id}`;
    history.push(url);
  };

  useEffect(() => dispatch(fetchCountries()), []);

  const exportFilters = useMemo(() => {
    const filters = {
      electionUnit: electionUnit && Number(electionUnit),
      pollingStationId: pollingStation && Number(pollingStation),
    };

    if (electionRegion) {
      const selectedElectionRegion = electionRegions.features.find(feature =>
        feature.properties.municipality.toLowerCase() === electionRegion.toLowerCase() ||
        feature.properties.settlement?.toLowerCase() === electionRegion.toLowerCase());
      const { county, municipality, settlement } = selectedElectionRegion.properties;
      const countryObj = countriesLookup && countriesLookup[CROATIA_COUNTRY_NAME];

      const countyObj = countryObj
        && countryObj.counties
        && countryObj.counties[county?.toUpperCase()];
      const countyId = countyObj && countyObj.id;
      filters.countyId = countyId;

      const municipalityObj = countyObj
        && countyObj.municipalities
        && countyObj.municipalities[municipality?.toUpperCase()];
      const municipalityId = municipalityObj && municipalityObj.id;
      filters.municipalityId = municipalityId;

      const settlementObj = municipalityObj
        && municipalityObj.settlements
        && municipalityObj.settlements[settlement?.toUpperCase()];
      const settlementId = settlementObj && settlementObj.id;
      filters.settlementId = settlementId;
    }

    return filters;
  }, [electionUnit, electionRegion, pollingStation, countriesLookup]);

  return (
    <div className={styles.container}>
      <div className={styles.navbar}>
        <OrganizationNav />
      </div>
      <div className={styles.content}>
        <div className={styles.leftSide}>
          <ElectionMap
            electionUnit={electionUnit}
            electionRegion={electionRegion}
            pollingStation={pollingStation}
            links={links}
            onSelectFeature={selectFeatureHandler}
            onClickFeature={requestAllocatedMembersCount}
            onPollingStationClick={handlePollingStationClick}
            popupContent={(
              <div>
                <div>
                  {
                    intl.formatMessage({
                      id: 'ORGANIZATION.TERRITORIAL.POPUP.UNIT_MESSAGE' })
                  } <strong>{allocatedMembersCount.unit}</strong>
                </div>
                <div>
                  {
                    intl.formatMessage({
                      id: 'ORGANIZATION.TERRITORIAL.POPUP.SUBUNIT_MESSAGE' })
                  } <strong>{allocatedMembersCount.subunit}</strong>
                </div>
              </div>
            )}
            tools={(
              <ExportToolbar
                exportUrl={exportUrl}
                filters={exportFilters}
                showSubUnit={!exportFilters.pollingStationId}
                showAll={!exportFilters.pollingStationId}
              />
            )}
          />
        </div>
        <div className={styles.rightSide}>
          <AllocatedMembers selectedRegion={selectedRegion} />
        </div>
      </div>
    </div>
  );
};

export default memo(ParliamentaryElection);
