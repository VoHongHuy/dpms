import React, { memo, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { Input } from '@/components/Form';
import Button from '@/components/Button';
import MultiSelect from '@/components/Form/MultiSelect';

import styles from './filters.module.scss';

const Filters = ({ onChange }) => {
  const [filters, setFilters] = useState({});
  const intl = useIntl();
  const electionUnitOptions = useMemo(
    () => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    [],
  );

  const handleReset = e => {
    e.preventDefault();
    setFilters({});
    onChange(undefined);
  };

  const handleInputChange = ({ target: { name, value } }) => {
    setFilters({ ...filters, [name]: value });
    onChange({ [name]: value });
  };

  const handleElectionUnitChange = (selectedElectionUnits) => {
    const filterValue =
      Array.isArray(selectedElectionUnits) && selectedElectionUnits.length > 0
        ? selectedElectionUnits.map(m => m.value)
        : undefined;
    setFilters({ ...filters, electionUnit: filterValue });
    onChange({ electionUnit: filterValue });
  };

  return (
    <div className={styles.container}>
      <Input
        type="text"
        name="name"
        className={styles.input}
        placeholder={intl.formatMessage({ id: 'MEMBERS.MODEL.NAME' })}
        autoComplete="none"
        onChange={handleInputChange}
        value={filters.name}
      />
      <Input
        type="text"
        name="surname"
        className={styles.input}
        placeholder={intl.formatMessage({ id: 'MEMBERS.MODEL.SURNAME' })}
        autoComplete="none"
        onChange={handleInputChange}
        value={filters.surname}
      />
      <Input
        type="text"
        name="ssn"
        className={styles.input}
        placeholder={intl.formatMessage({ id: 'MEMBERS.MODEL.SSN' })}
        autoComplete="none"
        onChange={handleInputChange}
        value={filters.ssn}
      />
      <Input
        type="text"
        name="email"
        className={styles.input}
        placeholder={intl.formatMessage({ id: 'MEMBERS.MODEL.EMAIL' })}
        autoComplete="none"
        onChange={handleInputChange}
        value={filters.email}
      />
      <Input
        type="text"
        name="address"
        className={styles.input}
        placeholder={intl.formatMessage({ id: 'MEMBERS.MODEL.ADDRESS' })}
        autoComplete="none"
        onChange={handleInputChange}
        value={filters.address}
      />
      <MultiSelect
        name="electionUnit"
        className={styles.input}
        placeholder={intl.formatMessage({
          id: 'MEMBERS.LIST_MEMBERS.ELETION_UNIT',
        })}
        onChange={handleElectionUnitChange}
        options={electionUnitOptions.map(item => (
          { label: item, value: item }
        ))}
        value={filters.electionUnit}
      />
      <Button className={styles.button} onClick={handleReset}>
        {intl.formatMessage({
          id: 'MEMBERS.LIST_MEMBERS.BUTTON.CLEAR_FILTERS',
        })}
      </Button>
    </div>
  );
};

Filters.propTypes = { onChange: PropTypes.func.isRequired };

export default memo(Filters);
