import MembersTable from '@/components/MembersTable';
import Filters from '@/components/MembersTable/Filters';
import SectionHeader from '@/components/SectionHeader';
import { CROATIA_COUNTRY_NAME } from '@/constants/member';
import history from '@/history';
import { getCountriesLookup, fetchCountries } from '@/redux/ducks/countries.duck';
import { join } from 'lodash';
import debounce from 'lodash.debounce';
import PropTypes from 'prop-types';
import React, { memo, useEffect, useState } from 'react';
import { FormattedHTMLMessage, useIntl } from 'react-intl';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router';
import {
  getMembersForTerritorialOrganizations,
  getCountMembersForTerritorialOrganizations,
  getFetching,
  fetchMembersForTerritorialAllocations,
  allocateMembersToTerritorialUnit,
} from '@/redux/ducks/organization.duck';

import styles from './allocateMembers.module.scss';

const ListMembers = ({ match }) => {
  const intl = useIntl();

  const [filters, setFilters] = useState({});
  const [pagination, setPagination] = useState({ page: 1, rowPerPage: 10 });
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [selectedMemberIds, setSelectedMemberIds] = useState([]);

  const dispatch = useDispatch();
  const data = useSelector(getMembersForTerritorialOrganizations, shallowEqual);
  const totalRecords = useSelector(getCountMembersForTerritorialOrganizations);
  const loading = useSelector(getFetching);
  const countriesLookup = useSelector(getCountriesLookup);

  const { county, municipality, settlement, district } = match.params;

  const countryObj = countriesLookup && countriesLookup[CROATIA_COUNTRY_NAME];
  const countryId = countryObj && countryObj.id;

  const countyObj = countryObj && countryObj.counties && countryObj.counties[county?.toUpperCase()];
  const countyId = countyObj && countyObj.id;

  const municipalityObj = countyObj
    && countyObj.municipalities
    && countyObj.municipalities[municipality?.toUpperCase()];
  const municipalityId = municipalityObj && municipalityObj.id;

  const settlementObj = municipalityObj
    && municipalityObj.settlements
    && municipalityObj.settlements[settlement?.toUpperCase()];
  const settlementId = settlementObj && settlementObj.id;

  const districtObject = settlementObj
    && settlementObj.districts
    && settlementObj.districts[district?.toUpperCase()];
  const districtId = districtObject && districtObject.id;

  const regionPath = join([county, municipality, settlement, district].filter(_ => !!_), ' > ');

  const loadData = () => {
    dispatch(fetchMembersForTerritorialAllocations({
      ...pagination,
      filters,
      territorialUnit: { county, municipality, settlement, district },
    }));
  };

  useEffect(() => {
    dispatch(fetchCountries());
    loadData();
  }, [pagination, filters]);

  const handleFilterChange = debounce(filterValues => {
    setResetPaginationToggle(!resetPaginationToggle);
    setFilters(!filterValues ? {} : { ...filters, ...filterValues });
  }, 500);

  const handlePageChange = page => {
    setPagination({ ...pagination, page });
  };

  const handleRowPerPageChange = rowPerPage => {
    setResetPaginationToggle(!resetPaginationToggle);
    setPagination({
      ...pagination,
      rowPerPage,
      page: 1,
    });
  };

  const handleBackButtonClick = () => {
    history.goBack();
  };

  const handleSubmitButtonClick = e => {
    e.preventDefault();
    dispatch(allocateMembersToTerritorialUnit({
      data: {
        memberIds: selectedMemberIds,
        countryId,
        countyId,
        municipalityId,
        settlementId,
        districtId,
      },
      callback: success => {
        if (success) {
          setSelectedMemberIds([]);
        }

        loadData();
      },
    }));
  };

  const onMemberCheckboxChanged = (memberId) => (event) => {
    if (event.target.checked) {
      setSelectedMemberIds([
        ...selectedMemberIds,
        memberId,
      ]);
    } else {
      selectedMemberIds.splice(selectedMemberIds.indexOf(memberId), 1);
      setSelectedMemberIds([
        ...selectedMemberIds,
      ]);
    }
  };

  const configureColumns = columns => [
    {
      name: intl.formatMessage({ id: 'TERRITORIAL_ALLOCATIONS.TABLE.HEADER.ALLOCATE' }),
      selector: 'id',
      width: '5em',
      center: true,
      format: (row) => (
        <input
          type="checkbox"
          name={row.id}
          value={row.id}
          checked={selectedMemberIds.includes(row.id)}
          onChange={onMemberCheckboxChanged(row.id)}
        />
      ),
    },
    ...columns,
  ];

  return (
    <div className={styles.container}>
      <SectionHeader
        title={(
          <FormattedHTMLMessage
            id="TERRITORIAL_ALLOCATIONS.TITLE"
            values={{ regionPath }}
          />
        )}
        actions={{
          closeButtonProps: {
            children: intl.formatMessage({
              id: 'MEMBERS.ADD_MEMBER.ACTIONS.CLOSE',
            }),
            onClick: handleBackButtonClick,
          },
          submitButtonProps: {
            children: intl.formatMessage({
              id: 'MEMBERS.ADD_MEMBER.ACTIONS.SUBMIT',
            }),
            onClick: handleSubmitButtonClick,
            disabled: !selectedMemberIds || !selectedMemberIds.length,
          },
        }}
      />
      <div className={styles.content}>
        <Filters onChange={handleFilterChange} />
        <MembersTable
          data={data}
          paginationServer
          paginationResetDefaultPage={resetPaginationToggle}
          progressPending={loading}
          paginationTotalRows={totalRecords}
          onChangePage={handlePageChange}
          onChangeRowsPerPage={handleRowPerPageChange}
          configureColumns={configureColumns}
        />
      </div>
    </div>
  );
};

ListMembers.propTypes = {
  match: PropTypes.object,
};

ListMembers.defaultProps = {
  match: undefined,
};

export default memo(withRouter(ListMembers));
