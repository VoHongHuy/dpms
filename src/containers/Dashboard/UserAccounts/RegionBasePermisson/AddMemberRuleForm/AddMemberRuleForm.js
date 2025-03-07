/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import lodash from 'lodash';
import { useSelector, useDispatch, connect } from 'react-redux';
import { useIntl } from 'react-intl';
import { Field, getFormValues, reduxForm, change } from 'redux-form';
import { Select, Option } from '@/components/Form';
import { getCountries, fetchCountries } from '@/redux/ducks/countries.duck';
import Button from '@/components/Button';
import { ADD_MEMBER_RULE_FORM } from '@/constants/forms';
import validate from './validate';

import styles from './addmemberRuleForm.module.scss';

const AddMemberRuleForm = ({ valid, submitting, onSubmit, reset }) => {
  const intl = useIntl();
  const dispatch = useDispatch();

  const [territorial, setTerritorial] = useState({
    countries: [],
    counties: [],
    municipalities: [],
    settlements: [],
  });

  const formValues = useSelector(getFormValues(ADD_MEMBER_RULE_FORM));

  const mapToOptions = entity => ({ label: entity.name, value: entity.id });
  const countriesLookup = useSelector(getCountries);

  useEffect(() => {
    dispatch(fetchCountries());
  }, []);

  useEffect(() => {
    const countryOptions = lodash.orderBy(countriesLookup.map(mapToOptions), ['label'], ['asc']);
    const countyLookup = countriesLookup.filter(
      country => formValues.countryId === `${country.id}`,
    ).reduce((countyLookupResult, selectedCountry) => ([
      ...countyLookupResult,
      ...selectedCountry.counties,
    ]), []);
    const countyOptions = lodash.orderBy(countyLookup.map(mapToOptions), ['label'], ['asc']);
    const municipalityLookup = countyLookup.filter(
      county => formValues.countyId === `${county.id}`,
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
        formValues.municipalityId === `${municipality.id}`,
    ).reduce((settlementLookupResult, selectedMunicipality) => ([
      ...settlementLookupResult,
      ...selectedMunicipality.settlements,
    ]), []);
    const settlementOptions = lodash.orderBy(
      settlementLookup.map(mapToOptions),
      ['label'],
      ['asc'],
    );
    setTerritorial({
      countries: countryOptions,
      counties: countyOptions,
      municipalities: municipalityOptions,
      settlements: settlementOptions,
    });
  }, [
    countriesLookup,
    formValues,
  ]);

  const resetForm = (fields) => {
    Object.keys(fields)
      .forEach(field => dispatch(change(ADD_MEMBER_RULE_FORM, field, fields[field])));
  };

  const handleCountryChange = () => {
    resetForm({
      countyId: 'All',
      municipalityId: 'All',
      settlementId: 'All',
    });
  };

  const handleCountyChange = () => {
    resetForm({
      municipalityId: 'All',
      settlementId: 'All',
    });
  };

  const handleMunicipalityChange = () => {
    resetForm({
      settlementId: 'All',
    });
  };

  const isCountyDisabled = useMemo(() =>
    !formValues.countryId, [formValues.countryId]);

  const isMunicipalityDisabled = useMemo(() =>
    !formValues.countyId, [formValues.countyId]);

  const isSettlementDisabled = useMemo(() =>
    !formValues.municipalityId, [formValues.municipalityId]);

  const onTerritorialFilterClick = (isDisabled) => {
    if (isDisabled) {
      // eslint-disable-next-line no-alert
      alert(intl.formatMessage({ id: 'MEMBERS.LIST_MEMBERS.FILTERS.ALERT_MESSAGE' }));
    }
  };

  const handleSubmit = () => {
    onSubmit(formValues, reset);
  };

  return (
    <div className={styles.container}>
      <Field
        component={Select}
        name="countryId"
        className={styles.input}
        onChange={handleCountryChange}
      >
        <Option value="" hidden>
          {intl.formatMessage({ id: 'MEMBERS.MODEL.COUNTRY' })}
        </Option>
        <Option value="All">
          {intl.formatMessage({ id: 'FORM.DROPDOWN.ALL_VALUE' })}
        </Option>
        {
          territorial.countries.map(country => (
            <Option key={country.value} value={country.value}>{country.label}</Option>
          ))
        }
      </Field>
      <Field
        component={Select}
        name="countyId"
        className={styles.input}
        onChange={handleCountyChange}
        disabled={isCountyDisabled}
        onClick={() => onTerritorialFilterClick(isCountyDisabled)}
      >
        <Option value="" hidden>
          {intl.formatMessage({ id: 'MEMBERS.MODEL.COUNTY' })}
        </Option>
        <Option value="All">
          {intl.formatMessage({ id: 'FORM.DROPDOWN.ALL_VALUE' })}
        </Option>
        {
          territorial.counties.map(county => (
            <Option key={county.value} value={county.value}>{county.label}</Option>
          ))
        }
      </Field>
      <Field
        component={Select}
        name="municipalityId"
        className={styles.input}
        onChange={handleMunicipalityChange}
        disabled={isMunicipalityDisabled}
        onClick={() => onTerritorialFilterClick(isMunicipalityDisabled)}
      >
        <Option value="" hidden>
          {intl.formatMessage({ id: 'MEMBERS.MODEL.CITY' })}
        </Option>
        <Option value="All">
          {intl.formatMessage({ id: 'FORM.DROPDOWN.ALL_VALUE' })}
        </Option>
        {
          territorial.municipalities.map(municipality => (
            <Option
              key={municipality.value}
              value={municipality.value}
            >
              {municipality.label}
            </Option>
          ))
        }
      </Field>
      <Field
        component={Select}
        name="settlementId"
        className={styles.input}
        disabled={isSettlementDisabled}
        onClick={() => onTerritorialFilterClick(isSettlementDisabled)}
      >
        <Option value="" hidden>
          {intl.formatMessage({ id: 'MEMBERS.MODEL.SETTLEMENT' })}
        </Option>
        <Option value="All">
          {intl.formatMessage({ id: 'FORM.DROPDOWN.ALL_VALUE' })}
        </Option>
        {
          territorial.settlements.map(settlement => (
            <Option
              key={settlement.value}
              value={settlement.value}
            >
              {settlement.label}
            </Option>
          ))
        }
      </Field>
      <Field
        component={Select}
        name="operator"
        className={styles.input}
      >
        <Option value="" hidden>
          {intl.formatMessage({ id: 'MEMBERS.PERMISSION_RULE.OPERATOR' })}
        </Option>
        <Option value={1}>
          {intl.formatMessage({ id: 'MEMBERS.PERMISSION_RULE.OPERATOR.ALLOW' })}
        </Option>
        <Option value={0}>
          {intl.formatMessage({ id: 'MEMBERS.PERMISSION_RULE.OPERATOR.DISALLOW' })}
        </Option>
      </Field>
      <Button
        type="button"
        disabled={submitting || !valid}
        className={styles.button}
        onClick={handleSubmit}
      >
        {intl.formatMessage({
          id: 'MEMBERS.PERMISSION_RULE.BUTTON.ADD_RULE',
        })}
      </Button>
    </div>
  );
};

AddMemberRuleForm.defaultProps = {
  submitting: undefined,
  valid: undefined,
};

AddMemberRuleForm.propTypes = {
  submitting: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
  valid: PropTypes.bool,
  reset: PropTypes.func.isRequired,
};

export default compose(
  connect(() => ({
    initialValues: {
    },
  })),
  reduxForm({
    form: ADD_MEMBER_RULE_FORM,
    validate,
    touchOnChange: true,
    destroyOnUnmount: true,
  }),
)(AddMemberRuleForm);
