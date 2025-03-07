import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Input } from '@/components/Form';
import { useIntl } from 'react-intl';
import CustomModal from '@/components/CustomModal';
import { hasPermissions } from '@/utils/user';
import { PERMISSIONS } from '@/constants/userAccounts';
import styles from './paymentYearColumn.module.scss';

const PaymentYearColumn = ({ onSubmit, payment }) => {
  const intl = useIntl();
  const [openModal, setOpenModal] = useState(false);
  const [yearInput, setYear] = useState('');

  const toggleModal = (e) => {
    if (e) {
      e.preventDefault();
    }

    setOpenModal(!openModal);
  };

  const handleModalOk = (e) => {
    if (e) {
      e.preventDefault();
    }

    if (onSubmit) {
      onSubmit(payment.id, yearInput);
    }

    setOpenModal(false);
  };

  const handleYearChange = (e) => {
    e.preventDefault();
    setYear(parseInt(e.target.value, 10));
  };

  return (
    <div>
      {hasPermissions([PERMISSIONS.UPDATE_PAYMENT.value]) ? (
        <a
          href="/"
          className={styles.action}
          onClick={toggleModal}
        >
          {payment.year}
        </a>
      ) : payment.year }

      <CustomModal
        open={openModal}
        toggle={toggleModal}
        okButtonProps={{ onClick: handleModalOk }}
        className={styles.modal}
      >

        <div className={styles.modalTitle}>
          {intl.formatMessage({ id: 'MEMBERS.DETAILS.SECTION.PAYMENTS.YEAR_MODAL_TITLE' })}
        </div>
        <Input
          onChange={handleYearChange}
          value={yearInput}
          type="number"
          placeholder={intl.formatMessage({ id: 'MEMBERS.MODEL.PAYMENT_YEAR' })}
          autoComplete="off"
        />

      </CustomModal>
    </div>
  );
};

PaymentYearColumn.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  payment: PropTypes.shape({
    id: PropTypes.string.isRequired,
    year: PropTypes.number.isRequired,
  }).isRequired,
};

export default PaymentYearColumn;
