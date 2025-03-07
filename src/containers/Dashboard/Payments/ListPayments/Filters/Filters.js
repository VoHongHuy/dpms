import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { useIntl } from 'react-intl';
import lodash, { debounce } from 'lodash';
import { connect, useDispatch, useSelector } from 'react-redux';
import { change, Field, getFormValues, reduxForm } from 'redux-form';
import { DatePicker, Input } from '@/components/Form';
import MultiSelect from '@/components/Form/MultiSelect';
import AutoCompleteSelect from '@/components/Form/AutoCompleteSelect';
import Button from '@/components/Button';
import { fetchProviders, getProviders } from '@/redux/ducks/members.duck';
import { fetchCountries, getCountries } from '@/redux/ducks/countries.duck';
import { PAYMENT_FILTER_FORM } from '@/constants/forms';
import { PAYMENT_TRANSACTION_STATUSES } from '@/constants/member';

import styles from './filters.module.scss';

const Filters = ({ reset }) => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const filters = useSelector(getFormValues(PAYMENT_FILTER_FORM));
  const countriesLookup = useSelector(getCountries);
  const providers = useSelector(getProviders);

  const [territorial, setTerritorial] = useState({
    countries: [],
    counties: [],
    municipalities: [],
    settlements: [],
    districts: [],
  });

  const statusOptions = useMemo(
    () => Object.keys(PAYMENT_TRANSACTION_STATUSES).map(key => {
      const status = PAYMENT_TRANSACTION_STATUSES[key];
      const option = {
        label: intl.formatMessage({ id: status.displayName }),
        value: `DPMS.ManagementAPI.Models.PaymentTransactionStatus'${status.alias}'`,
      };

      return option;
    }),
    [],
  );

  const electionUnitOptions = useMemo(
    () => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    [],
  );

  const mapToOptions = entity => ({ label: entity.name, value: entity.id });

  useEffect(() => {
    dispatch(fetchCountries());
  }, []);

  useEffect(() => {
    const countryOptions = lodash.orderBy(countriesLookup.map(mapToOptions), ['label'], ['asc']);
    const countyLookup = countriesLookup.filter(
      country => filters.memberCountryId && filters.memberCountryId.includes(country.id),
    ).reduce((countyLookupResult, selectedCountry) => ([
      ...countyLookupResult,
      ...selectedCountry.counties,
    ]), []);
    const countyOptions = lodash.orderBy(countyLookup.map(mapToOptions), ['label'], ['asc']);
    const municipalityLookup = countyLookup.filter(
      county => filters.memberCountyId && filters.memberCountyId.includes(county.id),
    ).reduce((municipalityLookupResult, selectedCounty) => ([
      ...municipalityLookupResult,
      ...selectedCounty.municipalities,
    ]), []);
    const municipalityOptions = lodash.orderBy(
      municipalityLookup.map(mapToOptions),
      ['label'],
      ['asc'],
    );
    const settlementLookup = municipalityLookup.filter(
      municipality =>
        filters.memberMunicipalityId
        && filters.memberMunicipalityId.includes(municipality.id),
    ).reduce((settlementLookupResult, selectedMunicipality) => ([
      ...settlementLookupResult,
      ...selectedMunicipality.settlements,
    ]), []);
    const settlementOptions = lodash.orderBy(
      settlementLookup.map(mapToOptions),
      ['label'],
      ['asc'],
    );
    const districtLookup = settlementLookup.filter(
      settlement =>
        filters.memberSettlementId
        && filters.memberSettlementId.includes(settlement.id),
    ).reduce((districtLookupResult, selectedSettlement) => ([
      ...districtLookupResult,
      ...selectedSettlement.districts,
    ]), []);
    const districtOptions = lodash.orderBy(
      districtLookup.map(mapToOptions),
      ['label'],
      ['asc'],
    );

    setTerritorial({
      countries: countryOptions,
      counties: countyOptions,
      municipalities: municipalityOptions,
      settlements: settlementOptions,
      districts: districtOptions,
    });
  }, [
    countriesLookup,
    filters.memberCountryId,
    filters.memberCountyId,
    filters.memberMunicipalityId,
    filters.memberSettlementId,
  ]);

  const memberOptions = useMemo(() => providers.map(m => ({
    label: `${m.name} ${m.surname}`,
    value: m.id,
  })), [providers]);

  const handleReset = e => {
    e.preventDefault();
    reset({});
  };

  const resetForm = (fields) => {
    Object.keys(fields)
      .forEach(field => dispatch(change(PAYMENT_FILTER_FORM, field, fields[field])));
  };

  const handleCountryChange = () => {
    resetForm({
      memberCountyId: undefined,
      memberMunicipalityId: undefined,
      memberSettlementId: undefined,
      memberDistrictId: undefined,
    });
  };

  const handleCountyChange = () => {
    resetForm({
      memberMunicipalityId: undefined,
      memberSettlementId: undefined,
      memberDistrictId: undefined,
    });
  };

  const handleMunicipalityChange = () => {
    resetForm({
      memberSettlementId: undefined,
      memberDistrictId: undefined,
    });
  };

  const handleSettlementChange = () => {
    resetForm({
      memberDistrictId: undefined,
    });
  };

  const handleMemberChange = debounce(value => {
    dispatch(fetchProviders({ name: value }));
  }, 500);

  const isCountyDisabled = useMemo(() => !filters.memberCountryId
    || (filters.memberCountryId && filters.memberCountryId.length === 0),
  [filters.memberCountryId]);

  const isMunicipalityDisabled = useMemo(() => !filters.memberCountyId
    || (filters.memberCountyId && filters.memberCountyId.length === 0),
  [filters.memberCountyId]);

  const isSettlementDisabled = useMemo(() => !filters.memberMunicipalityId
    || (filters.memberMunicipalityId && filters.memberMunicipalityId.length === 0),
  [filters.memberMunicipalityId]);

  const hasDistrict = useMemo(() => territorial.districts.length > 0, [territorial]);

  const onTerritorialFilterClick = (isDisabled) => {
    if (isDisabled) {
      // eslint-disable-next-line no-alert
      alert(intl.formatMessage({ id: 'PAYMENTS.FILTERS.RULES.INVALID_REGION' }));
    }
  };

  const handleBlur = event => event.preventDefault();

  return (
    <form autoComplete="off" className={styles.container}>
      <Field
        component={Input}
        type="number"
        name="year"
        className={styles.input}
        placeholder={intl.formatMessage({ id: 'PAYMENTS.MODEL.YEAR' })}
        onBlur={handleBlur}
      />
      <Field
        component={Input}
        type="number"
        name="minimalAmount"
        className={styles.input}
        placeholder={intl.formatMessage({ id: 'PAYMENTS.MODEL.MINIMAL_AMOUNT' })}
        onBlur={handleBlur}
      />
      <Field
        component={Input}
        type="number"
        name="maxAmount"
        className={styles.input}
        placeholder={intl.formatMessage({ id: 'PAYMENTS.MODEL.MAX_AMOUNT' })}
        onBlur={handleBlur}
      />
      <Field
        component={MultiSelect}
        name="status"
        className={styles.input}
        placeholder={intl.formatMessage({
          id: 'PAYMENTS.MODEL.STATUS',
        })}
        onBlur={handleBlur}
        options={statusOptions}
      />
      <Field
        component={Input}
        type="text"
        name="paidBy"
        className={styles.input}
        placeholder={intl.formatMessage({ id: 'PAYMENTS.MODEL.PAID_BY' })}
        onBlur={handleBlur}
      />
      <Field
        component={Input}
        type="text"
        name="description"
        className={styles.input}
        placeholder={intl.formatMessage({ id: 'PAYMENTS.MODEL.DESCRIPTION' })}
        onBlur={handleBlur}
      />
      <Field
        component={DatePicker}
        onBlur={handleBlur}
        type="text"
        name="dateFrom"
        className={styles.input}
        placeholderText={intl.formatMessage({ id: 'PAYMENTS.MODEL.DATE_FROM' })}
      />
      <Field
        component={AutoCompleteSelect}
        name="memberId"
        className={styles.input}
        placeholder={intl.formatMessage({
          id: 'PAYMENTS.MODEL.MEMBER',
        })}
        options={memberOptions}
        onInputChange={handleMemberChange}
      />
      <Field
        component={Input}
        type="text"
        name="memberName"
        className={styles.input}
        placeholder={intl.formatMessage({ id: 'MEMBERS.MODEL.NAME' })}
        autoComplete="none"
        onBlur={handleBlur}
      />
      <Field
        component={Input}
        type="text"
        name="memberSurname"
        className={styles.input}
        placeholder={intl.formatMessage({ id: 'MEMBERS.MODEL.SURNAME' })}
        autoComplete="none"
        onBlur={handleBlur}
      />
      <Field
        component={Input}
        type="text"
        name="memberOib"
        className={styles.input}
        placeholder={intl.formatMessage({ id: 'MEMBERS.MODEL.SSN' })}
        autoComplete="none"
        onBlur={handleBlur}
      />
      <Field
        component={MultiSelect}
        name="memberCountryId"
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
        name="memberCountyId"
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
        name="memberMunicipalityId"
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
        name="memberSettlementId"
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
          name="memberDistrictId"
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
        name="memberElectionUnit"
        className={styles.input}
        placeholder={intl.formatMessage({
          id: 'MEMBERS.MODEL.ELECTION_UNIT',
        })}
        options={electionUnitOptions.map(item => (
          { label: item, value: item }
        ))}
      />
      <Button className={styles.button} onClick={handleReset}>
        {intl.formatMessage({
          id: 'PAYMENTS.FILTERS.BUTTON.CLEAR',
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
    form: PAYMENT_FILTER_FORM,
    touchOnChange: true,
    destroyOnUnmount: true,
  }),
)(Filters);
