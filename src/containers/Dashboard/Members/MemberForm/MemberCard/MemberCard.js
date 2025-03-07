import React, { memo, useMemo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Field, getFormValues, change, untouch } from 'redux-form';
import { debounce } from 'lodash';
import { useIntl } from 'react-intl';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import { FormSection, Input } from '@/components/Form';
import { getProviders, fetchProviders, clearProviders } from '@/redux/ducks/members.duck';
import CheckBox from '@/components/CheckBox';
import AutoCompleteSelect from '@/components/Form/AutoCompleteSelect';
import { MEMBER_FORM } from '@/constants/forms';

import styles from './memberCard.module.scss';

const MemberCard = ({ readOnly }) => {
  const { id } = useParams();
  const intl = useIntl();
  const dispatch = useDispatch();
  const providers = useSelector(getProviders);
  const formValues = useSelector(getFormValues(MEMBER_FORM));

  useEffect(() => () => dispatch(clearProviders()), []);

  const [isChecked, setChecked] = useState(
    formValues && formValues.cardProvidedByMember?.value,
  );

  const memberOptions = useMemo(() => providers.filter(m => m.id !== id).map(m => ({
    label: `${m.name} ${m.surname}`,
    value: m.id,
  })), [providers, id]);

  const resetFields = fieldsObj => {
    Object.keys(fieldsObj).forEach(fieldKey => {
      dispatch(change(MEMBER_FORM, fieldKey, fieldsObj[fieldKey]));
      dispatch(untouch(MEMBER_FORM, fieldKey));
    });
  };

  const handleCheckBoxChange = ({ target: { checked } }) => {
    setChecked(checked);
    resetFields({
      cardProvidedByMember: null,
    });
  };

  const handleInputChange = debounce(value => {
    dispatch(fetchProviders({ name: value }));
  }, 500);

  return (
    <FormSection
      label={intl.formatMessage({
        id: 'MEMBERS.DETAILS.SECTION.MEMBER_CARD.LABEL',
      })}
    >
      <div className={styles.content}>
        <Field
          component={Input}
          type="text"
          name="cardNumber"
          className={styles.input}
          label={intl.formatMessage({ id: 'MEMBERS.DETAILS.SECTION.MEMBER_CARD.NUMBER' })}
          readOnly={readOnly}
          disabled={readOnly}
        />
        <CheckBox
          name="hasProvider"
          label={intl.formatMessage({
            id: 'MEMBERS.DETAILS.SECTION.MEMBER_CARD.PROVIDED',
          })}
          onChange={handleCheckBoxChange}
          checked={isChecked}
          readOnly={readOnly}
          disabled={readOnly}
        />
        {
          isChecked && (
            <Field
              component={AutoCompleteSelect}
              name="cardProvidedByMember"
              className={styles.input}
              placeholder={intl.formatMessage({
                id: 'MEMBERS.DETAILS.SECTION.MEMBER_CARD.PROVIDED_BY',
              })}
              options={memberOptions}
              onInputChange={handleInputChange}
            />
          )
        }
      </div>
    </FormSection>
  );
};

MemberCard.defaultProps = {
  readOnly: false,
};

MemberCard.propTypes = {
  readOnly: PropTypes.bool,
};

export default memo(MemberCard);
