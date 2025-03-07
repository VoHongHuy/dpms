import React, { memo, useState, useMemo } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Field, change, untouch, getFormValues } from 'redux-form';
import { useDispatch, useSelector } from 'react-redux';
import { FormSection, Input, Select, Option } from '@/components/Form';
import CheckBox from '@/components/CheckBox';
import { MEMBER_FORM } from '@/constants/forms';
import { CROATIA_COUNTRY_NAME } from '@/constants/member';
import { getCroatiaData } from '@/redux/ducks/countries.duck';

import styles from './address.module.scss';

const Address = ({ readOnly }) => {
  const formValues = useSelector(getFormValues(MEMBER_FORM));
  const [isResidentOfCroatia, setCheckBoxStatus] = useState(
    formValues && formValues.country === CROATIA_COUNTRY_NAME,
  );
  const intl = useIntl();
  const dispatch = useDispatch();
  const croatiaData = useSelector(getCroatiaData);

  const InputDynamicType = useMemo(
    () => (isResidentOfCroatia ? Select : Input),
    [isResidentOfCroatia],
  );

  const listCounties = useMemo(
    () =>
      (isResidentOfCroatia
        && croatiaData
        && croatiaData.counties
      ) || [],
    [croatiaData, isResidentOfCroatia],
  );

  const listMunicipalities = useMemo(() => {
    if (
      !isResidentOfCroatia ||
      (formValues && !formValues.county) ||
      !listCounties.length
    ) {
      return [];
    }
    const selectedCountry = listCounties.find(
      country => country.name === formValues.county,
    );

    return (selectedCountry && selectedCountry.municipalities) || [];
  }, [listCounties, formValues && formValues.county]);

  const listSettlements = useMemo(() => {
    if (
      !isResidentOfCroatia ||
      (formValues && !formValues.municipality) ||
      !listMunicipalities.length
    ) {
      return [];
    }
    const selectedMunicipality = listMunicipalities.find(
      municipality => municipality.name === formValues.municipality,
    );

    return (
      selectedMunicipality
      && selectedMunicipality.settlements
    ) || [];
  }, [listMunicipalities, formValues && formValues.municipality]);

  const listDistricts = useMemo(() => {
    if (
      !isResidentOfCroatia ||
      (formValues && !formValues.settlement) ||
      !listSettlements.length
    ) {
      return [];
    }
    const selectedSettlement = listSettlements.find(
      district => district.name === formValues.settlement,
    );

    return (selectedSettlement && selectedSettlement.districts) || [];
  }, [listSettlements, formValues && formValues.settlement]);

  const resetFields = fieldsObj => {
    Object.keys(fieldsObj).forEach(fieldKey => {
      dispatch(change(MEMBER_FORM, fieldKey, fieldsObj[fieldKey]));
      dispatch(untouch(MEMBER_FORM, fieldKey));
    });
  };

  const handleCheckBoxChange = ({ target: { checked } }) => {
    setCheckBoxStatus(checked);
    resetFields({
      country: checked ? CROATIA_COUNTRY_NAME : '',
      county: '',
      municipality: '',
      settlement: '',
      district: '',
      electionUnit: checked ? 0 : 11,
    });
  };

  const handleCountyChange = () => {
    if (isResidentOfCroatia) {
      resetFields({ municipality: '', settlement: '', district: '', electionUnit: 0 });
    }
  };

  const handleMunicipalityChange = () => {
    if (isResidentOfCroatia) {
      resetFields({ settlement: '', district: '', electionUnit: 0 });
    }
  };

  const getSettlementData = (county, municipality, settlement) => {
    const countyData = croatiaData.counties.find(i => i.name === county);
    const municipalityData = countyData.municipalities.find(
      i => i.name === municipality,
    );
    const settlementData = municipalityData.settlements.find(
      i => i.name === settlement,
    );

    return settlementData;
  };

  const handleSettlementChange = ({ target: { value } }) => {
    if (isResidentOfCroatia) {
      const { county, municipality } = formValues;
      if (county && municipality && value) {
        const settlementData = getSettlementData(county, municipality, value);
        resetFields({ district: '', electionUnit: settlementData.electionUnitNumber });
      } else {
        resetFields({ district: '', electionUnit: 0 });
      }
    }
  };

  const renderOptions = options => {
    if (options && options.length > 0) {
      const emptyOption = <Option key="empty" value="" hidden />;
      const results = options.map(item => (
        <Option key={`${item.id}-${item.name}`} value={item.name}>
          {item.name}
        </Option>
      ));

      return [emptyOption, ...results];
    }

    return [];
  };

  const renderElectionUnitError = () => (
    <>
      <p className={styles.electionUnitError}>
        {intl.formatMessage({
          id: 'MEMBERS.DETAILS.SECTION.ADDRESS.ELETION_UNIT.ERROR',
        }, {
          importedAddress: formValues.importedAddress,
        })}
      </p>
      <p className={styles.electionUnitError}>
        {intl.formatMessage({
          id: 'MEMBERS.DETAILS.SECTION.ADDRESS.ELETION_UNIT.ERROR.MESSAGE',
        })}
      </p>
    </>
  );

  const getElectionUnit = () => {
    if (isResidentOfCroatia) {
      if (!croatiaData || !croatiaData.counties || !formValues
        || !formValues.county
        || !formValues.municipality
        || !formValues.settlement) {
        return 0;
      }

      const { county, municipality, settlement } = formValues;
      const settlementData =
        getSettlementData(county, municipality, settlement);

      return settlementData.electionUnitNumber;
    }

    return 11;
  };

  const electionUnit = getElectionUnit();

  return (
    <FormSection
      label={intl.formatMessage({
        id: 'MEMBERS.DETAILS.SECTION.ADDRESS.LABEL',
      })}
    >
      <CheckBox
        name="isResidentOfCroatia"
        label={intl.formatMessage({
          id: 'MEMBERS.DETAILS.SECTION.ADDRESS.RESIDENT_OF_CROATIA',
        })}
        onChange={handleCheckBoxChange}
        checked={isResidentOfCroatia}
        readOnly={readOnly}
        disabled={readOnly}
      />
      {!isResidentOfCroatia ? (
        <Field
          component={Input}
          type="text"
          name="country"
          className={styles.input}
          label={intl.formatMessage({ id: 'MEMBERS.MODEL.COUNTRY' })}
          required
          readOnly={readOnly}
          disabled={readOnly}
        />
      ) : null}
      <div className={styles.group}>
        <Field
          component={InputDynamicType}
          type="text"
          name="county"
          className={styles.input}
          onChange={handleCountyChange}
          label={intl.formatMessage({ id: 'MEMBERS.MODEL.COUNTY' })}
          required
          readOnly={readOnly}
          disabled={readOnly}
          validate={() => (electionUnit > 0 ? undefined : ' ')}
        >
          {isResidentOfCroatia ? renderOptions(listCounties) : undefined}
        </Field>
        <Field
          component={InputDynamicType}
          type="text"
          name="municipality"
          className={styles.input}
          onChange={handleMunicipalityChange}
          label={intl.formatMessage({ id: 'MEMBERS.MODEL.CITY' })}
          required
          readOnly={readOnly}
          disabled={readOnly}
          validate={() => (electionUnit > 0 ? undefined : ' ')}
        >
          {isResidentOfCroatia ? renderOptions(listMunicipalities) : undefined}
        </Field>
        <Field
          component={InputDynamicType}
          type="text"
          name="settlement"
          className={styles.input}
          label={intl.formatMessage({ id: 'MEMBERS.MODEL.SETTLEMENT' })}
          onChange={handleSettlementChange}
          required
          readOnly={readOnly}
          disabled={readOnly}
          validate={() => (electionUnit > 0 ? undefined : ' ')}
        >
          {isResidentOfCroatia ? renderOptions(listSettlements) : undefined}
        </Field>
        {
          listDistricts.length > 0 && (
            <Field
              component={InputDynamicType}
              type="text"
              name="district"
              className={styles.input}
              label={intl.formatMessage({ id: 'MEMBERS.MODEL.DISTRICT' })}
              required
              readOnly={readOnly}
              disabled={readOnly}
              validate={() => (electionUnit > 0 ? undefined : ' ')}
            >
              {isResidentOfCroatia ? renderOptions(listDistricts) : undefined}
            </Field>
          )
        }
      </div>
      <div className={styles.group}>
        <Field
          component={Input}
          type="text"
          name="postalCode"
          className={styles.input}
          label={intl.formatMessage({ id: 'MEMBERS.MODEL.POSTAL_CODE' })}
          required
          readOnly={readOnly}
          disabled={readOnly}
        />
        <Field
          component={Input}
          type="text"
          name="streetAndNumber"
          className={styles.input}
          label={intl.formatMessage({
            id: 'MEMBERS.MODEL.STREET_AND_NUMBER',
          })}
          required
          readOnly={readOnly}
          disabled={readOnly}
        />
      </div>
      <p className={electionUnit === 0
        ? styles.electionUnitError
        : styles.electionUnit}
      >
        {intl.formatMessage({
          id: 'MEMBERS.DETAILS.SECTION.ADDRESS.ELETION_UNIT',
        })}
        :&nbsp;
        {electionUnit}.
      </p>
      {electionUnit === 0 ? renderElectionUnitError() : null}
    </FormSection>
  );
};

Address.defaultProps = { data: {}, readOnly: false };
Address.propTypes = {
  data: PropTypes.shape({
    country: PropTypes.string,
    county: PropTypes.string,
    city: PropTypes.string,
    settlement: PropTypes.string,
    postalCode: PropTypes.string,
    streetAndNumber: PropTypes.string,
  }),
  readOnly: PropTypes.bool,
};

export default memo(Address);
