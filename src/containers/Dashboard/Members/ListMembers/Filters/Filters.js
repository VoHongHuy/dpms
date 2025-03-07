import React, { useState, useMemo, useEffect } from 'react';
import { compose } from 'redux';
import { reduxForm, change, getFormValues, Field } from 'redux-form';
import { useSelector, useDispatch, connect } from 'react-redux';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { getCountries, fetchCountries } from '@/redux/ducks/countries.duck';
import { Input, Select, Option, DatePicker } from '@/components/Form';
import Button from '@/components/Button';
import MultiSelect from '@/components/Form/MultiSelect';

import { MEMBER_FILTER_FORM } from '@/constants/forms';

import { PAYMENT_STATUSES } from '@/constants/member';
import styles from './filters.module.scss';

const Filters = ({ reset }) => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const filters = useSelector(getFormValues(MEMBER_FILTER_FORM));
  const [territorial, setTerritorial] = useState({
    countries: [],
    counties: [],
    municipalities: [],
    settlements: [],
    districts: [],
  });

  const electionUnitOptions = useMemo(
    () => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    [],
  );

  const invitedOptions = useMemo(
    () => [
      {
        key: 'yes',
        value: true,
        displayName: intl.formatMessage({
          id: 'MEMBERS.LIST_MEMBERS.FILTERS.INTERNAL_NOTE.YES',
        }),
      },
      {
        key: 'no',
        value: false,
        displayName: intl.formatMessage({
          id: 'MEMBERS.LIST_MEMBERS.FILTERS.INTERNAL_NOTE.NO',
        }),
      },
    ],
    [],
  );

  const ascendingOptionsCompare = (a, b) => {
    const labelA = a?.label?.toUpperCase();
    const labelB = b?.label?.toUpperCase();
    let comparison = 0;
    if (labelA > labelB) {
      comparison = 1;
    } else if (labelA < labelB) {
      comparison = -1;
    }
    return comparison;
  };

  const mapToOptions = entity => ({ label: entity.name, value: entity.id });

  const countriesLookup = useSelector(getCountries);

  useEffect(() => {
    dispatch(fetchCountries());
  }, []);

  useEffect(() => {
    const countryOptions = countriesLookup.map(mapToOptions).sort(ascendingOptionsCompare);
    const countyLookup = countriesLookup.filter(
      country => filters.countryId && filters.countryId.includes(country.id),
    ).reduce((countyLookupResult, selectedCountry) => ([
      ...countyLookupResult,
      ...selectedCountry.counties,
    ]), []);
    const countyOptions = countyLookup.map(mapToOptions).sort(ascendingOptionsCompare);
    const municipalityLookup = countyLookup.filter(
      county => filters.countyId && filters.countyId.includes(county.id),
    ).reduce((municipalityLookupResult, selectedCounty) => ([
      ...municipalityLookupResult,
      ...selectedCounty.municipalities,
    ]), []);
    const municipalityOptions = municipalityLookup.map(mapToOptions).sort(ascendingOptionsCompare);
    const settlementLookup = municipalityLookup.filter(
      municipality =>
        filters.municipalityId
        && filters.municipalityId.includes(municipality.id),
    ).reduce((settlementLookupResult, selectedMunicipality) => ([
      ...settlementLookupResult,
      ...selectedMunicipality.settlements,
    ]), []);
    const settlementOptions = settlementLookup.map(mapToOptions).sort(ascendingOptionsCompare);
    const districtLookup = settlementLookup.filter(
      settlement =>
        filters.settlementId
        && filters.settlementId.includes(settlement.id),
    ).reduce((districtLookupResult, selectedSettlement) => ([
      ...districtLookupResult,
      ...selectedSettlement.districts,
    ]), []);
    const districtOptions = districtLookup.map(mapToOptions).sort(ascendingOptionsCompare);
    setTerritorial({
      countries: countryOptions,
      counties: countyOptions,
      municipalities: municipalityOptions,
      settlements: settlementOptions,
      districts: districtOptions,
    });
  }, [
    countriesLookup,
    filters.countryId,
    filters.countyId,
    filters.municipalityId,
    filters.settlementId,
  ]);

  const handleReset = e => {
    e.preventDefault();
    reset({});
  };

  const resetForm = (fields) => {
    Object.keys(fields)
      .forEach(field => dispatch(change(MEMBER_FILTER_FORM, field, fields[field])));
  };

  const handleCountryChange = () => {
    resetForm({
      countyId: undefined,
      municipalityId: undefined,
      settlementId: undefined,
      districtId: undefined,
    });
  };

  const handleCountyChange = () => {
    resetForm({
      municipalityId: undefined,
      settlementId: undefined,
      districtId: undefined,
    });
  };

  const handleMunicipalityChange = () => {
    resetForm({
      settlementId: undefined,
      districtId: undefined,
    });
  };

  const handleSettlementChange = () => {
    resetForm({
      districtId: undefined,
    });
  };

  const isCountyDisabled = useMemo(() => !filters.countryId
    || (filters.countryId && filters.countryId.length === 0),
  [filters.countryId]);

  const isMunicipalityDisabled = useMemo(() => !filters.countyId
    || (filters.countyId && filters.countyId.length === 0),
  [filters.countyId]);

  const isSettlementDisabled = useMemo(() => !filters.municipalityId
    || (filters.municipalityId && filters.municipalityId.length === 0),
  [filters.municipalityId]);

  const hasDistrict = useMemo(() => territorial.districts.length > 0, [territorial]);

  const onTerritorialFilterClick = (isDisabled) => {
    if (isDisabled) {
      // eslint-disable-next-line no-alert
      alert(intl.formatMessage({ id: 'MEMBERS.LIST_MEMBERS.FILTERS.ALERT_MESSAGE' }));
    }
  };

  const handleBlur = event => event.preventDefault();

  return (
    <form className={styles.container}>
      <Field
        component={Input}
        type="text"
        name="name"
        className={styles.input}
        placeholder={intl.formatMessage({ id: 'MEMBERS.MODEL.NAME' })}
        autoComplete="none"
        onBlur={handleBlur}
      />
      <Field
        component={Input}
        type="text"
        name="surname"
        className={styles.input}
        placeholder={intl.formatMessage({ id: 'MEMBERS.MODEL.SURNAME' })}
        autoComplete="none"
        onBlur={handleBlur}
      />
      <Field
        component={Input}
        type="text"
        name="ssn"
        className={styles.input}
        placeholder={intl.formatMessage({ id: 'MEMBERS.MODEL.SSN' })}
        autoComplete="none"
        onBlur={handleBlur}
      />
      <Field
        component={Input}
        type="text"
        name="cardNumber"
        className={styles.input}
        placeholder={intl.formatMessage({ id: 'MEMBERS.MODEL.CARD_NUMBER' })}
        autoComplete="none"
        onBlur={handleBlur}
      />
      <Field
        component={Input}
        type="text"
        name="email"
        className={styles.input}
        placeholder={intl.formatMessage({ id: 'MEMBERS.MODEL.EMAIL' })}
        autoComplete="none"
        onBlur={handleBlur}
      />
      <Field
        component={Input}
        type="text"
        name="internalNote"
        className={styles.input}
        placeholder={intl.formatMessage({ id: 'MEMBERS.MODEL.INTERNAL_NOTE' })}
        autoComplete="none"
        onBlur={handleBlur}
      />
      <Field
        component={Input}
        type="text"
        name="address"
        className={styles.input}
        placeholder={intl.formatMessage({ id: 'MEMBERS.MODEL.ADDRESS' })}
        autoComplete="none"
        onBlur={handleBlur}
      />
      <Field
        component={MultiSelect}
        name="countryId"
        className={styles.input}
        placeholder={intl.formatMessage({
          id: 'MEMBERS.MODEL.COUNTRY',
        })}
        onChange={handleCountryChange}
        onBlur={handleBlur}
        options={territorial.countries}
      />
      <Field
        component={MultiSelect}
        name="countyId"
        className={styles.input}
        placeholder={intl.formatMessage({
          id: 'MEMBERS.MODEL.COUNTY',
        })}
        onChange={handleCountyChange}
        onBlur={handleBlur}
        options={territorial.counties}
        isDisabled={isCountyDisabled}
        onClick={() => onTerritorialFilterClick(isCountyDisabled)}
      />
      <Field
        component={MultiSelect}
        name="municipalityId"
        className={styles.input}
        placeholder={intl.formatMessage({
          id: 'MEMBERS.MODEL.CITY',
        })}
        onChange={handleMunicipalityChange}
        onBlur={handleBlur}
        options={territorial.municipalities}
        isDisabled={isMunicipalityDisabled}
        onClick={() => onTerritorialFilterClick(isMunicipalityDisabled)}
      />
      <Field
        component={MultiSelect}
        onBlur={handleBlur}
        onChange={handleSettlementChange}
        name="settlementId"
        className={styles.input}
        placeholder={intl.formatMessage({
          id: 'MEMBERS.MODEL.SETTLEMENT',
        })}
        options={territorial.settlements}
        isDisabled={isSettlementDisabled}
        onClick={() => onTerritorialFilterClick(isSettlementDisabled)}
      />
      {hasDistrict && (
        <Field
          component={MultiSelect}
          onBlur={handleBlur}
          name="districtId"
          className={styles.input}
          placeholder={intl.formatMessage({
            id: 'MEMBERS.MODEL.DISTRICT',
          })}
          options={territorial.districts}
        />
      )}
      <Field
        component={MultiSelect}
        onBlur={handleBlur}
        name="electionUnit"
        className={styles.input}
        placeholder={intl.formatMessage({
          id: 'MEMBERS.LIST_MEMBERS.ELETION_UNIT',
        })}
        options={electionUnitOptions.map(item => (
          { label: item, value: item }
        ))}
      />
      <Field
        component={Select}
        onBlur={handleBlur}
        name="invited"
        className={styles.input}
        placeholder={intl.formatMessage({ id: 'MEMBERS.LIST_MEMBERS.INVITED' })}
      >
        {invitedOptions.map(item => (
          <Option key={`filters-invited-${item.key}`} value={item.value}>
            {item.displayName}
          </Option>
        ))}
      </Field>
      <Field
        component={DatePicker}
        onBlur={handleBlur}
        type="text"
        name="joinedDateFrom"
        className={styles.input}
        placeholderText={intl.formatMessage({ id: 'MEMBERS.MODEL.JOINED_DATE_FROM' })}
      />
      <Field
        component={DatePicker}
        onBlur={handleBlur}
        type="text"
        name="joinedDateTo"
        className={styles.input}
        placeholderText={intl.formatMessage({ id: 'MEMBERS.MODEL.JOINED_DATE_TO' })}
      />
      <Field
        component={(props) => <DatePicker showYearPicker showMonthDropdown={false} {...props} />}
        onBlur={handleBlur}
        type="text"
        name="PaymentTransactions.year"
        className={styles.input}
        placeholderText={intl.formatMessage({ id: 'MEMBERS.MODEL.PAYMENT_YEAR' })}
      />
      <Field
        component={Select}
        onBlur={handleBlur}
        name="PaymentTransactions.status"
        className={styles.input}
        placeholder={intl.formatMessage({ id: 'MEMBERS.MODEL.PAYMENT_STAUTUS' })}
      >
        {Object.keys(PAYMENT_STATUSES).map(key => (
          <Option
            key={key}
            value={PAYMENT_STATUSES[key].alias}
          >
            {intl.formatMessage({
              id: PAYMENT_STATUSES[key].displayName,
            })}
          </Option>
        ))}
      </Field>
      <Button className={styles.button} onClick={handleReset}>
        {intl.formatMessage({
          id: 'MEMBERS.LIST_MEMBERS.BUTTON.CLEAR_FILTERS',
        })}
      </Button>
    </form>
  );
};

Filters.propTypes = {
  reset: PropTypes.func.isRequired,
};

export default compose(
  connect(() => ({
    initialValues: {},
  })),
  reduxForm({
    form: MEMBER_FILTER_FORM,
    touchOnChange: true,
    destroyOnUnmount: false,
  }),
)(Filters);
