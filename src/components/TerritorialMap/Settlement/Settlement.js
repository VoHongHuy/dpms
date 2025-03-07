import React, { memo, useMemo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import { getCountries } from '@/redux/ducks/countries.duck';
import { CROATIA_COUNTRY_NAME } from '@/constants/member';
import SettlementFilter from './SettlementFilter';
import TerritorialList from '../TerritorialList';

import styles from './settlement.module.scss';

const Settlement = ({
  county,
  municipality,
  settlement: selectedSettlement,
  onSettlementClick,
}) => {
  const intl = useIntl();
  const countriesData = useSelector(getCountries);
  const croatiaCountry = useMemo(() =>
    countriesData.find(c => c.name === CROATIA_COUNTRY_NAME),
  [countriesData]);
  const [filters, setFilters] = useState({});
  const [settlements, setSettlements] = useState([]);

  useEffect(() => {
    if (croatiaCountry) {
      const selectedCounty = croatiaCountry.counties
        .find(c => c.name.toLowerCase() === county.toLowerCase());
      if (selectedCounty) {
        const selectedMunicipality = selectedCounty.municipalities
          .find(m => m.name.toLowerCase() === municipality.toLowerCase());
        if (selectedMunicipality) {
          const selectedSettlements = selectedMunicipality.settlements;
          const filteredSettlements = selectedSettlements
            .filter(settlement => !filters.settlement
              || (filters.settlement
                && settlement.name.toLowerCase().includes(filters.settlement.toLowerCase())),
            );
          setSettlements([...filteredSettlements]);
        }
      }
    }
  }, [county, municipality, croatiaCountry, filters]);

  const isSelected = (settlementName) =>
    settlementName.toLowerCase() === selectedSettlement.toLowerCase();

  const handleFilterChange = filterValues => {
    setFilters(!filterValues ? {} : { ...filters, ...filterValues });
  };

  return (
    <div className={styles.container}>
      <SettlementFilter onChange={handleFilterChange} />
      <TerritorialList
        title={intl.formatMessage({ id: 'ORGANIZATION.SETTLEMENT.NAME' })}
        data={settlements}
        isSelected={isSelected}
        onRowClick={onSettlementClick}
      />
    </div>
  );
};

Settlement.defaultProps = {
  county: '',
  municipality: '',
  settlement: '',
};

Settlement.propTypes = {
  county: PropTypes.string,
  municipality: PropTypes.string,
  settlement: PropTypes.string,
  onSettlementClick: PropTypes.func.isRequired,
};

export default memo(Settlement);
