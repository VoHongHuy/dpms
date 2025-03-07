import React, { memo, useMemo, useEffect } from 'react';
import { useParams } from 'react-router';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { getCountriesLookup, fetchCountries } from '@/redux/ducks/countries.duck';
import { CROATIA_COUNTRY_NAME } from '@/constants/member';
import history from '@/history';
import TerritorialMap from '@/components/TerritorialMap';
import Loading from '@/components/Loading';
import { ORGANIZATION } from '@/constants';
import Switcher from '../Switcher';
import ResultDetails from '../ResultDetails';
import { PATHS } from '../../constants';

import styles from './countiesResults.module.scss';

const CountiesResults = () => {
  const { county, municipality, settlement } = useParams();
  const intl = useIntl();
  const dispatch = useDispatch();
  const countriesLookup = useSelector(getCountriesLookup);

  const croatiaCountry = useMemo(
    () => countriesLookup && countriesLookup[CROATIA_COUNTRY_NAME],
    [countriesLookup],
  );

  useEffect(() => {
    dispatch(fetchCountries());
  }, []);

  const selectFeatureHandler = (feature) => {
    const {
      county,
      municipality,
      name,
    } = feature.properties;

    const filters = {
      county: !county && !municipality ? name : county,
      municipality: county && !municipality ? name : municipality,
      settlement: county && municipality ? name : settlement,
    };

    if (filters.county && filters.county.toLowerCase() === ORGANIZATION.COUNTY.ZAGREB) {
      filters.county = ORGANIZATION.COUNTY.GRAD_ZAGREB;
    }

    const routes = [
      PATHS.RESULT_COUNTIES,
      filters.county,
      filters.municipality,
      filters.settlement,
    ];
    const path = routes.filter(r => r).join('/');

    history.push(path);
  };

  const handleSettlementClick = settlement => {
    const url = `${PATHS.RESULT_COUNTIES}/${county}/${municipality}/${settlement.name}`;
    history.push(url);
  };

  const generateLinks = () => {
    const path = PATHS.RESULT_COUNTIES;
    const links = [{
      name: intl.formatMessage({ id: 'ORGANIZATION.CROATIA' }),
      path,
    }];

    if (county) {
      const link = { name: county, path: `${path}/${county}` };
      links.push(link);
    }
    if (municipality) {
      const link = { name: municipality, path: `${path}/${county}/${municipality}` };
      links.push(link);
    }
    if (settlement) {
      const link = { name: settlement, path: `${path}/${county}/${municipality}/${settlement}` };
      links.push(link);
    }

    return links;
  };

  const links = useMemo(() => generateLinks(), [county, municipality, settlement]);

  return (
    <div className={styles.container}>
      <div className={styles.navbar}>
        <Switcher />
      </div>
      <div className={styles.content}>
        <div className={styles.leftSide}>
          <TerritorialMap
            county={county}
            municipality={municipality}
            settlement={settlement}
            onSelectFeature={selectFeatureHandler}
            links={links}
            onSettlementClick={handleSettlementClick}
            hasNonZagrebSettlement={false}
          />
        </div>
        <div className={styles.rightSide}>
          {croatiaCountry ? (
            <ResultDetails
              county={county}
              municipality={municipality}
              settlement={settlement}
            />
          ) : (
            <div className={styles.center}><Loading /></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(CountiesResults);
