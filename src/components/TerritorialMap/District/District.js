import React, { memo, useMemo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import { getCountries } from '@/redux/ducks/countries.duck';
import { CROATIA_COUNTRY_NAME } from '@/constants/member';
import TerritorialList from '../TerritorialList';

import styles from './district.module.scss';

const District = ({
  county,
  municipality,
  settlement,
  district: selectedDistrict,
  onDistrictClick,
}) => {
  const intl = useIntl();
  const countriesData = useSelector(getCountries);
  const croatiaCountry = useMemo(() =>
    countriesData.find(c => c.name === CROATIA_COUNTRY_NAME),
  [countriesData]);
  const [districts, setDistricts] = useState([]);

  useEffect(() => {
    if (croatiaCountry) {
      const selectedCounty = croatiaCountry.counties
        .find(c => c.name.toLowerCase() === county.toLowerCase());
      if (selectedCounty) {
        const selectedMunicipality = selectedCounty.municipalities
          .find(m => m.name.toLowerCase() === municipality.toLowerCase());
        if (selectedMunicipality) {
          const selectedSettlement = selectedMunicipality.settlements
            .find(s => s.name.toLowerCase() === settlement.toLowerCase());
          if (selectedSettlement) {
            const filteredDistricts = selectedSettlement.districts;
            setDistricts([...filteredDistricts]);
          }
        }
      }
    }
  }, [county, municipality, settlement, croatiaCountry]);

  const isSelected = (districtName) =>
    districtName.toLowerCase() === selectedDistrict.toLowerCase();

  return (
    <div className={styles.container}>
      <TerritorialList
        title={intl.formatMessage({ id: 'ORGANIZATION.DISTRICT.NAME' })}
        data={districts}
        isSelected={isSelected}
        onRowClick={onDistrictClick}
      />
    </div>
  );
};

District.defaultProps = {
  county: '',
  municipality: '',
  settlement: '',
  district: '',
  onDistrictClick: () => {},
};

District.propTypes = {
  county: PropTypes.string,
  municipality: PropTypes.string,
  settlement: PropTypes.string,
  district: PropTypes.string,
  onDistrictClick: PropTypes.func,
};

export default memo(District);
