import React from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';
import { compose } from 'redux';
import { Form, reduxForm, getFormValues } from 'redux-form';
import { MEMBER_FORM } from '@/constants/forms';

import BasicInformation from './BasicInformation';
import ContactInformation from './ContactInformation';
import Address from './Address';
import Education from './Education';
import Organizations from './Organizations';
import Documents from './Documents';
import Invitation from './Invitation';
import MemberCard from './MemberCard';
import SystemInformation from './SystemInformation';
import validate from './validate';
import Payments from './Payments/Payments';

const MemberForm = ({
  data,
  onSubmit,
  handleSubmit,
  documentsProps,
  hasModifyPermission,
  systemInfomationProps,
}) => {
  const formValues = useSelector(getFormValues(MEMBER_FORM));

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <BasicInformation readOnly={!hasModifyPermission} />
      {
        !formValues.isPrivate && (
          <>
            <ContactInformation readOnly={!hasModifyPermission} />
            <Address readOnly={!hasModifyPermission} />
            <Education readOnly={!hasModifyPermission} />
            <Organizations readOnly={!hasModifyPermission} />
            <Payments member={data} />
            <Documents
              {...documentsProps}
              data={data}
              readOnly={!hasModifyPermission}
            />
            <Invitation readOnly={!hasModifyPermission} />
          </>
        )
      }
      <MemberCard readOnly={!hasModifyPermission} />
      <SystemInformation
        {...systemInfomationProps}
        data={data}
        readOnly={!hasModifyPermission}
      />
    </Form>
  );
};

MemberForm.defaultProps = {
  data: {},
  documentsProps: {},
  systemInfomationProps: {},
  hasModifyPermission: false,
};
MemberForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  data: PropTypes.object,
  documentsProps: PropTypes.object,
  hasModifyPermission: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
  systemInfomationProps: PropTypes.object,
};

export default compose(
  connect((state, props) => ({
    initialValues: {
      ...props.data,
      electionUnit: (props.data && props.data.electionUnit) || 11,
      cardProvidedByMember: props.data && ({
        label: props.data.cardProvidedByMember,
        value: props.data.cardProvidedByMemberId,
      }),
    },
  })),
  reduxForm({
    form: MEMBER_FORM,
    validate,
    destroyOnUnmount: true,
  }),
)(MemberForm);
