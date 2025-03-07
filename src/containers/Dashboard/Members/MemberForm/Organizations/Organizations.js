import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { Field } from 'redux-form';
import { FormSection, Input, TextArea } from '@/components/Form';

import styles from './organizations.module.scss';

const Organizations = ({ readOnly }) => {
  const intl = useIntl();

  return (
    <FormSection
      label={intl.formatMessage({
        id: 'MEMBERS.DETAILS.SECTION.ORGANIZATIONS.LABEL',
      })}
      className={styles.formSection}
    >
      <Field
        component={Input}
        type="text"
        name="affiliationsParty"
        className={styles.input}
        label={intl.formatMessage({
          id: 'MEMBERS.DETAILS.SECTION.ORGANIZATIONS.AFFILIATION_PARTY',
        })}
        readOnly={readOnly}
        disabled={readOnly}
      />
      <Field
        component={Input}
        type="text"
        name="otherAffiliationsParties"
        className={styles.input}
        label={intl.formatMessage({
          id:
            'MEMBERS.DETAILS.SECTION.ORGANIZATIONS.OTHERS_AFFILIATION_PARTIES',
        })}
        readOnly={readOnly}
        disabled={readOnly}
      />
      <Field
        component={Input}
        type="text"
        name="personalNote"
        className={styles.input}
        label={intl.formatMessage({ id: 'MEMBERS.MODEL.PERSONAL_NOTE' })}
        readOnly={readOnly}
        disabled={readOnly}
      />
      <Field
        component={TextArea}
        name="internalNote"
        className={styles.input}
        label={intl.formatMessage({ id: 'MEMBERS.MODEL.INTERNAL_NOTE' })}
        readOnly={readOnly}
        disabled={readOnly}
      />
    </FormSection>
  );
};

Organizations.defaultProps = { readOnly: false };
Organizations.propTypes = { readOnly: PropTypes.bool };

export default memo(Organizations);
