import React, { useState, useMemo } from 'react';
import { Input, Select, Option } from '@/components/Form';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

const Filters = ({ onChange }) => {
  const intl = useIntl();
  const [filters, setFilters] = useState({});
  const electionUnitOptions = useMemo(
    () => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    [],
  );

  const handleInputChange = ({ target: { name, value } }) => {
    setFilters({ ...filters, [name]: value });
    onChange({ [name]: value });
  };

  const handleElectionUnitChange = ({ target: { name, value } }) => {
    setFilters({ ...filters, [name]: value });
    onChange({ [name]: Number(value) });
  };

  return (
    <>
      <Input
        type="text"
        name="name"
        placeholder={intl.formatMessage({ id: 'MEMBERS.MODEL.NAME' })}
        autoComplete="none"
        onChange={handleInputChange}
        value={filters.name}
      />
      <Input
        type="text"
        name="surname"
        placeholder={intl.formatMessage({ id: 'MEMBERS.MODEL.SURNAME' })}
        autoComplete="none"
        onChange={handleInputChange}
        value={filters.surname}
      />
      <Input
        type="text"
        name="ssn"
        placeholder={intl.formatMessage({ id: 'MEMBERS.MODEL.SSN' })}
        autoComplete="none"
        onChange={handleInputChange}
        value={filters.ssn}
      />
      <Input
        type="text"
        name="address"
        placeholder={intl.formatMessage({ id: 'MEMBERS.MODEL.ADDRESS' })}
        autoComplete="none"
        onChange={handleInputChange}
        value={filters.address}
      />
      <Select
        name="electionUnit"
        placeholder={intl.formatMessage({
          id: 'MEMBERS.LIST_MEMBERS.ELETION_UNIT',
        })}
        onChange={handleElectionUnitChange}
        value={filters.electionUnit}
      >
        {electionUnitOptions.map(item => (
          <Option key={`filters-electionUnit-${item}`} value={item}>
            {item}
          </Option>
        ))}
      </Select>
    </>
  );
};

Filters.propTypes = { onChange: PropTypes.func.isRequired };

export default Filters;
