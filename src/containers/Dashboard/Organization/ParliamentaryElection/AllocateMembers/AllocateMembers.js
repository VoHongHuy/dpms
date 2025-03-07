import MembersTable from '@/components/MembersTable';
import Filters from '@/components/MembersTable/Filters';
import SectionHeader from '@/components/SectionHeader';
import { CROATIA_COUNTRY_NAME } from '@/constants/member';
import history from '@/history';
import { getCountriesLookup, fetchCountries } from '@/redux/ducks/countries.duck';
import { join } from 'lodash';
import debounce from 'lodash.debounce';
import PropTypes from 'prop-types';
import React, { memo, useEffect, useState, useMemo } from 'react';
import { FormattedHTMLMessage, useIntl } from 'react-intl';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router';
import {
  getFetching,
  getMembersForParliamentaryOrganizations,
  getCountMembersForParliamentaryOrganizations,
  fetchMembersForParliamentaryAllocations,
  allocateMembersToParliamentaryUnit,
  getPollingStations,
  fetchPollingStations,
} from '@/redux/ducks/organization.duck';

import electionRegions from '@/assets/geojson/election-regions.json';
import styles from './allocateMembers.module.scss';

const ListMembers = ({ match }) => {
  const intl = useIntl();

  const [filters, setFilters] = useState({});
  const [pagination, setPagination] = useState({ page: 1, rowPerPage: 10 });
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [selectedMemberIds, setSelectedMemberIds] = useState([]);

  const dispatch = useDispatch();
  const data = useSelector(getMembersForParliamentaryOrganizations, shallowEqual);
  const totalRecords = useSelector(getCountMembersForParliamentaryOrganizations);
  const loading = useSelector(getFetching);
  const countriesLookup = useSelector(getCountriesLookup);
  const pollingStationsLookup = useSelector(getPollingStations);

  const { electionUnit, electionRegion, pollingStation } = match.params;

  const parliamentaryUnit = useMemo(() => {
    const result = { electionUnit, pollingStation };
    if (electionRegion) {
      const selectedElectionRegion = electionRegions.features.find(feature =>
        feature.properties.municipality.toLowerCase() === electionRegion.toLowerCase() ||
        feature.properties.settlement?.toLowerCase() === electionRegion.toLowerCase());
      const { municipality, settlement, county } = selectedElectionRegion.properties;
      result.municipality = municipality?.toUpperCase();
      result.settlement = settlement?.toUpperCase();
      result.county = county?.toUpperCase();
    }

    return result;
  }, [electionUnit, electionRegion, pollingStation, countriesLookup]);

  const countryObj = countriesLookup && countriesLookup[CROATIA_COUNTRY_NAME];
  const countryId = countryObj && countryObj.id;

  const countyObj = countryObj
    && countryObj.counties
    && countryObj.counties[parliamentaryUnit.county];
  const countyId = countyObj && countyObj.id;

  const municipalityObj = countyObj
    && countyObj.municipalities
    && countyObj.municipalities[parliamentaryUnit.municipality];
  const municipalityId = municipalityObj && municipalityObj.id;

  const settlementObj = municipalityObj
    && municipalityObj.settlements
    && municipalityObj.settlements[parliamentaryUnit.settlement];
  const settlementId = settlementObj && settlementObj.id;

  const regionPath = useMemo(() => {
    const paths = [intl.formatMessage({ id: 'ORGANIZATION.CROATIA' })];
    if (parliamentaryUnit.electionUnit) {
      paths.push(intl.formatMessage(
        { id: 'ORGANIZATION.ELECTION_UNIT' },
        { electionUnit: parliamentaryUnit.electionUnit },
      ));
    }
    if (parliamentaryUnit.municipality) {
      if (parliamentaryUnit.settlement) {
        paths.push(`${parliamentaryUnit.settlement} (${parliamentaryUnit.municipality})`);
      } else {
        paths.push(parliamentaryUnit.municipality);
      }
    }
    if (parliamentaryUnit.pollingStation) {
      const pollingStationData = pollingStationsLookup.data.find(m =>
        m.id === Number(parliamentaryUnit.pollingStation));
      if (pollingStationData) {
        paths.push(`(${pollingStationData.number}) ${pollingStationData.name}`);
      }
    }

    return join(paths.filter(_ => !!_), ' > ');
  }, [pollingStationsLookup, parliamentaryUnit.pollingStation]);

  const loadData = () => {
    dispatch(fetchMembersForParliamentaryAllocations({
      ...pagination,
      filters,
      parliamentaryUnit,
    }));
  };

  useEffect(() => {
    dispatch(fetchCountries());
    if (pollingStationsLookup.data.length === 0) {
      dispatch(fetchPollingStations({ filters: { electionRegion } }));
    }
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
    dispatch(allocateMembersToParliamentaryUnit({
      data: {
        memberIds: selectedMemberIds,
        electionUnitNumber: electionUnit ? Number(electionUnit) : undefined,
        countryId,
        countyId,
        municipalityId,
        settlementId,
        pollingStationId: pollingStation ? Number(pollingStation) : undefined,
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
