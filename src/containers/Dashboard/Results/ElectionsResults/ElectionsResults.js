import React, { memo, useMemo, useEffect } from 'react';
import { shallowEqual, useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import { useIntl } from 'react-intl';
import { getPollingStations } from '@/redux/ducks/organization.duck';
import { getCountriesLookup, fetchCountries } from '@/redux/ducks/countries.duck';
import { CROATIA_COUNTRY_NAME } from '@/constants/member';
import history from '@/history';
import ElectionMap from '@/components/ElectionMap';
import Loading from '@/components/Loading';
import { ORGANIZATION } from '@/constants';
import electionRegions from '@/assets/geojson/election-regions.json';
import Switcher from '../Switcher';
import ResultDetails from '../ResultDetails';
import { PATHS } from '../../constants';

import styles from './electionsResults.module.scss';

const ElectionsResults = () => {
  const {
    electionUnit,
    electionRegion,
  } = useParams();
  const intl = useIntl();
  const dispatch = useDispatch();
  const countriesLookup = useSelector(getCountriesLookup);

  const croatiaCountry = useMemo(
    () => countriesLookup && countriesLookup[CROATIA_COUNTRY_NAME],
    [countriesLookup],
  );

  const filters = useMemo(() => {
    const filterResults = { electionUnit, electionRegion };
    if (electionRegion) {
      const selectedElectionRegion = electionRegions.features.find(feature =>
        feature.properties.municipality.toLowerCase() === electionRegion.toLowerCase() ||
        feature.properties.settlement?.toLowerCase() === electionRegion.toLowerCase());
      const { county, municipality, settlement } = selectedElectionRegion.properties;
      filterResults.county = county;
      filterResults.municipality = municipality;
      filterResults.settlement = settlement;
    }
    return filterResults;
  }, [electionUnit, electionRegion, electionRegion]);

  useEffect(() => {
    dispatch(fetchCountries());
  }, []);

  const pollingStations = useSelector(getPollingStations, shallowEqual);

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
      PATHS.RESULT_ELECTIONS,
      filters.electionUnit,
      filters.electionRegion,
    ];
    const path = routes.filter(r => r).join('/');

    history.push(path);
  };

  const generateLinks = () => {
    const path = PATHS.RESULT_ELECTIONS;
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

    return links;
  };

  const links = useMemo(() => generateLinks(),
    [electionUnit, electionRegion, pollingStations]);

  return (
    <div className={styles.container}>
      <div className={styles.navbar}>
        <Switcher />
      </div>
      <div className={styles.content}>
        <div className={styles.leftSide}>
          <ElectionMap
            electionUnit={electionUnit}
            electionRegion={electionRegion}
            links={links}
            onSelectFeature={selectFeatureHandler}
            hasPollingStation={false}
          />
        </div>
        <div className={styles.rightSide}>
          {croatiaCountry ? (
            <ResultDetails {...filters} />
          ) : (
            <div className={styles.center}><Loading /></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(ElectionsResults);
