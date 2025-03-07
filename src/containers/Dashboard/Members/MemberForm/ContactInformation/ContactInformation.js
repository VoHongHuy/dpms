import React, { memo } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { FormSection, Input } from '@/components/Form';

import styles from './contactInformation.module.scss';

const ContactInformation = ({ readOnly }) => {
  const intl = useIntl();

  return (
    <FormSection
      label={intl.formatMessage({
        id: 'MEMBERS.DETAILS.SECTION.CONTACT_INFORMATION.LABEL',
      })}
      className={styles.formSection}
    >
      <div className={styles.content}>
        <Field
          component={Input}
          type="email"
          name="email"
          className={styles.input}
          label={intl.formatMessage({ id: 'MEMBERS.MODEL.EMAIL' })}
          required
          readOnly={readOnly}
          disabled={readOnly}
        />
        <Field
          component={Input}
          type="text"
          name="contactNumber"
          className={styles.input}
          label={intl.formatMessage({ id: 'MEMBERS.MODEL.CONTACT_NUMBER' })}
          required
          readOnly={readOnly}
          disabled={readOnly}
        />
      </div>
    </FormSection>
  );
};

ContactInformation.defaultProps = { data: {}, readOnly: false };
ContactInformation.propTypes = {
  data: PropTypes.shape({
    email: PropTypes.string,
    contactNumber: PropTypes.string,
  }),
  readOnly: PropTypes.bool,
};

export default memo(ContactInformation);
