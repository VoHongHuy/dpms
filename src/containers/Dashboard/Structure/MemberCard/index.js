import React from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { v1 } from 'uuid';
import styles from './membercard.module.scss';
import detailIcon from '../../../../assets/icons/detail.png';
import { PATHS } from '../../constants';

export const memberDragDataKey = 'memberDragDataKey';

const MemberCard = ({
  id,
  name,
  surname,
  ssn,
  address,
  contactNumber,
  electionUnit,
  email,
  draggable,
}) => {
  const intl = useIntl();

  const handleDragStart = event => {
    event.dataTransfer.setData(
      memberDragDataKey,
      JSON.stringify({
        id: v1(),
        memberId: id,
        memberName: name,
        surname,
        ssn,
        address,
        contactNumber,
        electionUnit,
        email,
      }),
    );
  };

  return (
    <div
      className={`${styles.container} ${!draggable ? styles.noselect : ''}`}
      draggable={draggable}
      onDragStart={handleDragStart}
    >
      <div className={styles.name}>
        {name} {surname}
      </div>
      <a
        className={styles.detailButton}
        href={PATHS.MEMBERS_EDIT.replace(':id', id)}
      >
        <img alt="convert icon" src={detailIcon} />
      </a>
      <div>{intl.formatMessage({ id: 'STRUCTURES.LEFT.MEMBER_CARD.SSN' })}</div>
      <div className={styles.content}>{ssn}</div>
      {address && (
        <>
          <div>
            {intl.formatMessage({ id: 'STRUCTURES.LEFT.MEMBER_CARD.ADDRESS' })}
          </div>
          <div className={styles.content}>{address}</div>
        </>
      )}
      {contactNumber && (
        <>
          <div>
            {intl.formatMessage({
              id: 'STRUCTURES.LEFT.MEMBER_CARD.CONTACT_NUMBER',
            })}
          </div>
          <div className={styles.content}>{contactNumber}</div>
        </>
      )}
      {electionUnit && (
        <>
          <div>
            {intl.formatMessage({
              id: 'STRUCTURES.LEFT.MEMBER_CARD.ELECTION_UNIT',
            })}
          </div>
          <div className={styles.content}>{electionUnit}</div>
        </>
      )}
    </div>
  );
};

MemberCard.defaultProps = {
  address: '',
  contactNumber: '',
  electionUnit: 0,
  name: '',
  ssn: '',
  surname: '',
  email: '',
  draggable: true,
};

MemberCard.propTypes = {
  address: PropTypes.string,
  contactNumber: PropTypes.string,
  electionUnit: PropTypes.number,
  name: PropTypes.string,
  ssn: PropTypes.string,
  surname: PropTypes.string,
  id: PropTypes.string.isRequired,
  email: PropTypes.string,
  draggable: PropTypes.bool,
};

export default MemberCard;
