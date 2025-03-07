import React, { useMemo, memo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import history from '@/history';
import TerritorialMap from '@/components/TerritorialMap';
import { fetchCountries, getCountriesLookup } from '@/redux/ducks/countries.duck';
import {
  fetchCountAllocatedMembersForTerritorialUnit,
  getCountAllocatedMembersForTerritorial,
} from '@/redux/ducks/organization.duck';
import { ORGANIZATION } from '@/constants';
import { CROATIA_COUNTRY_NAME } from '@/constants/member';
import OrganizationNav from '../OrganizationNav';
import AllocatedMembers from './AllocatedMembers';
import ExportToolbar from '../ExportToolbar';
import { PATHS } from '../../constants';

import styles from './territorialOrganization.module.scss';

const exportUrl = 'api/territorial/member/export';

const TerritorialOrganization = ({ match }) => {
  const { county, municipality, settlement, district } = match.params;
  const intl = useIntl();
  const dispatch = useDispatch();
  const countriesLookup = useSelector(getCountriesLookup);
  const allocatedMembersCount = useSelector(getCountAllocatedMembersForTerritorial);

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
      PATHS.TERRITORIAL_ORGANIZATION,
      filters.county,
      filters.municipality,
      filters.settlement,
    ];
    const path = routes.filter(r => r).join('/');

    history.push(path);
  };

  const requestAllocatedMembersCount = (event) => {
    const {
      county,
      municipality,
      name,
    } = event.target.feature.properties;
    const filters = {
      county: !county && !municipality ? name : county,
      municipality: county && !municipality ? name : municipality,
      settlement: county && municipality ? name : settlement,
    };
    if (filters.county && filters.county.toLowerCase() === ORGANIZATION.COUNTY.ZAGREB) {
      filters.county = ORGANIZATION.COUNTY.GRAD_ZAGREB;
    }
    dispatch(fetchCountAllocatedMembersForTerritorialUnit({ filters }));
  };

  const handleSettlementClick = settlement => {
    const url = `${PATHS.TERRITORIAL_ORGANIZATION}/${county}/${municipality}/${settlement.name}`;
    history.push(url);
  };

  const handleDistrictClick = district => {
    const url =
      `${PATHS.TERRITORIAL_ORGANIZATION}/${county}/${municipality}/${settlement}/${district.name}`;
    history.push(url);
  };

  const generateLinks = () => {
    const path = PATHS.TERRITORIAL_ORGANIZATION;
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
    if (district) {
      const link = {
        name: district, path: `${path}/${county}/${municipality}/${settlement}/${district}`,
      };
      links.push(link);
    }

    return links;
  };

  const links = useMemo(() => generateLinks(), [county, municipality, settlement, district]);

  const selectedRegion = useMemo(() => links[links.length - 1].name, [links]);

  const exportFilters = useMemo(() => {
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

    const districtObject = settlementObj
      && settlementObj.districts
      && settlementObj.districts[district?.toUpperCase()];
    const districtId = districtObject && districtObject.id;

    const filters = {
      countyId,
      municipalityId,
      settlementId,
      districtId,
    };

    return filters;
  }, [county, municipality, settlement, countriesLookup]);

  const hasSubunit = useMemo(() =>
    !settlement
    || (settlement.toLowerCase() === ORGANIZATION.SETTLEMENT.OSIJEK && !district),
  [settlement, district]);

  return (
    <div className={styles.container}>
      <div className={styles.navbar}>
        <OrganizationNav />
      </div>
      <div className={styles.content}>
        <div className={styles.leftSide}>
          <TerritorialMap
            isShowDistrict
            county={county}
            municipality={municipality}
            settlement={settlement}
            district={district}
            onSelectFeature={selectFeatureHandler}
            onClickFeature={requestAllocatedMembersCount}
            links={links}
            onSettlementClick={handleSettlementClick}
            onDistrictClick={handleDistrictClick}
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
                showSubUnit={hasSubunit}
                showAll={hasSubunit}
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

TerritorialOrganization.defaultProps = {
  match: undefined,
};

TerritorialOrganization.propTypes = {
  match: PropTypes.object,
};

export default memo(withRouter(TerritorialOrganization));
