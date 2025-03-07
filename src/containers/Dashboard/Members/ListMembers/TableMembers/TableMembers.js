import React, { memo, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useIntl } from 'react-intl';
import Table from '@/components/Table';
import {
  selectMembers,
  getSelectedMembers,
  deSelectMembers,
  getFilteredMembers,
} from '@/redux/ducks/members.duck';
import IconColumn from './IconColumn';
import DocumentColumn from './DocumentColumn';
import InternalColumn from './InternalColumn';
import ActionsColumn from './ActionsColumn';
import AllocatedColumn from './AllocatedColumn';
import PaymentColumn from './PaymentColumn';

const TableMembers = ({
  data,
  selectedMembers,
  selectMember,
  deSelectMember,
  filteredMembers,
  membershipSettings,
  ...restProps
}) => {
  const intl = useIntl();
  const checkboxRef = useRef();

  const handleSelect = (event) => {
    if (event.target.checked) {
      selectMember(event.target.value);
    } else {
      deSelectMember(event.target.value);
    }
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      selectMember(...filteredMembers);
    } else {
      deSelectMember(...filteredMembers);
    }
  };

  useEffect(() => {
    const isRunning = filteredMembers.length > 0 && selectedMembers.length > 0;
    checkboxRef.current.checked =
      isRunning &&
      filteredMembers.every(item => selectedMembers.includes(item));
    checkboxRef.current.indeterminate =
      !checkboxRef.current.checked &&
      filteredMembers.some(item => selectedMembers.includes(item));
  }, [selectedMembers, filteredMembers, data]);

  const columns = [
    {
      name: (
        <input
          type="checkbox"
          name="select-all"
          ref={checkboxRef}
          onChange={handleSelectAll}
        />
      ),
      selector: 'id',
      width: '50px',
      format: (row) => (
        <input
          type="checkbox"
          name={row.id}
          value={row.id}
          checked={selectedMembers.includes(row.id)}
          onChange={handleSelect}
        />
      ),
    },
    {
      name: intl.formatMessage({ id: 'MEMBERS.MODEL.NAME' }),
      selector: 'name',
      sortable: true,
    },
    {
      name: intl.formatMessage({ id: 'MEMBERS.MODEL.SURNAME' }),
      selector: 'surname',
      sortable: true,
    },
    {
      name: intl.formatMessage({ id: 'MEMBERS.MODEL.SSN' }),
      selector: 'ssn',
      sortable: true,
    },
    {
      name: intl.formatMessage({ id: 'MEMBERS.MODEL.EMAIL' }),
      selector: 'email',
      sortable: true,
    },
    {
      name: intl.formatMessage({ id: 'MEMBERS.MODEL.CONTACT_NUMBER' }),
      selector: 'contactNumber',
      sortable: true,
    },
    {
      name: intl.formatMessage({ id: 'MEMBERS.MODEL.ADDRESS' }),
      selector: 'address',
      sortable: true,
    },
    {
      name: intl.formatMessage({ id: 'MEMBERS.LIST_MEMBERS.DOCUMENTS' }),
      cell: row => <DocumentColumn data={row} />,
      selector: 'documents',
      center: true,
    },
    {
      name: intl.formatMessage({ id: 'MEMBERS.LIST_MEMBERS.PAYMENTS' }),
      cell: row => <PaymentColumn data={row} membershipSettings={membershipSettings} />,
      center: true,
    },
    {
      name: intl.formatMessage({ id: 'MEMBERS.LIST_MEMBERS.ALLOCATED' }),
      cell: row => <AllocatedColumn data={row} />,
      center: true,
    },
    {
      name: intl.formatMessage({ id: 'MEMBERS.MODEL.INTERNAL_NOTE' }),
      cell: row => <InternalColumn data={row} />,
      selector: 'internalNote',
      grow: 1,
      center: true,
    },
    {
      name: intl.formatMessage({
        id: 'MEMBERS.LIST_MEMBERS.INVITED',
      }),
      cell: row => <IconColumn type={row.invited ? 'success' : 'error'} />,
      selector: 'invited',
      center: true,
    },
    {
      name: intl.formatMessage({
        id: 'MEMBERS.LIST_MEMBERS.ELETION_UNIT',
      }),
      cell: row => <span>{row.electionUnit}.</span>,
      selector: 'electionUnit',
      center: true,
    },
    {
      name: intl.formatMessage({ id: 'MEMBERS.LIST_MEMBERS.ACTIONS' }),
      button: true,
      cell: row => <ActionsColumn data={row} />,
    },
  ];

  return (
    <Table
      {...restProps}
      columns={columns}
      data={data}
    />
  );
};

TableMembers.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectedMembers: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectMember: PropTypes.func.isRequired,
  deSelectMember: PropTypes.func.isRequired,
  filteredMembers: PropTypes.arrayOf(PropTypes.string).isRequired,
  membershipSettings: PropTypes.shape({}).isRequired,
};

const mapStateToProps = state => ({
  selectedMembers: getSelectedMembers(state),
  filteredMembers: getFilteredMembers(state),
});

const mapDispatchToProps = dispatch => ({
  selectMember: (...ids) => dispatch(selectMembers(ids)),
  deSelectMember: (...ids) => dispatch(deSelectMembers(ids)),
});

export default connect(mapStateToProps, mapDispatchToProps)(memo(TableMembers));
