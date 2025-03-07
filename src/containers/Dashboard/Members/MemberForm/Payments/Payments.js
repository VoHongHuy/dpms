import { FormSection } from '@/components/Form';
import React, { memo, useEffect } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import {
  updatePaymentTransactionYear,
  fetchPaymentsByMember,
  getMemberPayments,
  updatePaymentStatus,
  getFetching,
} from '@/redux/ducks/payments.duck';
import Loading from '@/components/Loading';
import PaymentSummary from '../../ListMembers/TableMembers/PaymentColumn/PaymentSummary';
import styles from './payments.module.scss';
import PaymentHistory from './PaymentHistory';

const Payments = ({ member }) => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const memberPayments = useSelector(getMemberPayments);
  const fetching = useSelector(getFetching);

  useEffect(() => {
    dispatch(fetchPaymentsByMember({ memberId: member.id }));
  }, []);

  const handlePaymentYearSubmit = (paymentId, year) => {
    dispatch(
      updatePaymentTransactionYear({
        paymentId,
        data: { year },
        callback: () => dispatch(fetchPaymentsByMember({ memberId: member.id })),
      }),
    );
  };

  const handleStatusChange = (paymentId, status) => {
    dispatch(
      updatePaymentStatus({
        ids: [paymentId],
        status,
        callback: () => dispatch(fetchPaymentsByMember({ memberId: member.id })),
      }),
    );
  };

  return (
    <FormSection
      label={intl.formatMessage({
        id: 'MEMBERS.DETAILS.SECTION.PAYMENTS.LABEL',
      })}
    >
      {fetching ? <Loading /> : (
        <>
          <PaymentSummary payments={memberPayments} className={styles.summary} />
          <PaymentHistory
            data={memberPayments}
            onPaymentYearSubmit={handlePaymentYearSubmit}
            onStatusClick={handleStatusChange}
          />
        </>
      )}
    </FormSection>
  );
};

Payments.propTypes = {
  member: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
};

export default memo(Payments);
