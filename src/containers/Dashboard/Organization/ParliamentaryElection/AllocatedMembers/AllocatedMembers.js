import React, { memo, useState, useMemo } from 'react';
import { connect, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { useIntl, FormattedHTMLMessage } from 'react-intl';
import { debounce } from 'lodash';
import { useParams } from 'react-router';
import history from '@/history';
import {
  getAllocatedMembersForParliamentaryMainUnit,
  getAllocatedMembersForParliamentarySubUnit,
  fetchAllocatedMembersForParliamentaryMainUnit,
  fetchAllocatedMembersForParliamentarySubUnit,
  updateMemberNoteForParliamentaryUnit,
  deleteAllocatedMemberForParliamentaryUnit,
} from '@/redux/ducks/organization.duck';
import Button from '@/components/Button';
import Filter from '../../AllocatedMemberTable/AllocatedMemberFilter';
import AllocatedMemberList from '../../AllocatedMemberTable/AllocatedMemberList';
import { PATHS } from '../../../constants';

import styles from './allocatedMembers.module.scss';

const AllocatedMemberListMainUnit = connect(state => ({
  allocatedMembers: getAllocatedMembersForParliamentaryMainUnit(state),
}), dispatch => ({
  fetchAllocatedMembers: (payload) =>
    dispatch(fetchAllocatedMembersForParliamentaryMainUnit(payload)),
}))(AllocatedMemberList);

const AllocatedMemberListSubUnit = connect(state => ({
  allocatedMembers: getAllocatedMembersForParliamentarySubUnit(state),
}), dispatch => ({
  fetchAllocatedMembers: (payload) =>
    dispatch(fetchAllocatedMembersForParliamentarySubUnit(payload)),
}))(AllocatedMemberList);

const ParliamentaryAllocatedMembers = ({ selectedRegion }) => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const { electionUnit, electionRegion, pollingStation } = useParams();
  const defaultFilters = {
    electionUnit,
    electionRegion,
    pollingStation,
  };
  const [state, setState] = useState({
    filters: {
      ...defaultFilters,
    },
    pagination: {
      mainUnit: {
        page: 1, rowPerPage: 2,
      },
      subUnit: {
        page: 1, rowPerPage: 2,
      },
    },
  });

  const handleFilterChange = debounce(filterValues => {
    setState(prevState => ({
      ...prevState,
      filters: !filterValues ? { ...defaultFilters } : { ...prevState.filters, ...filterValues },
      pagination: {
        ...prevState.pagination,
        mainUnit: {
          ...prevState.pagination.mainUnit,
          page: 1,
        },
        subUnit: {
          ...prevState.pagination.subUnit,
          page: 1,
        },
      },
    }));
  }, 500);

  const handleMainUnitPaginationChange = (pageIndex) => {
    setState(prevState => ({
      ...prevState,
      pagination: {
        ...prevState.pagination,
        mainUnit: {
          ...prevState.pagination.mainUnit,
          page: pageIndex,
        },
      },
    }));
  };

  const handleSubUnitPaginationChange = (pageIndex) => {
    setState(prevState => ({
      ...prevState,
      pagination: {
        ...prevState.pagination,
        subUnit: {
          ...prevState.pagination.subUnit,
          page: pageIndex,
        },
      },
    }));
  };

  const handleUpdateNote = (member, notes, callback) => {
    const payload = {
      data: {
        parliamentaryRegionAllocationId: member.allocationId,
        notes,
      },
      callback,
    };
    dispatch(updateMemberNoteForParliamentaryUnit(payload));
  };

  const handleDeleteAllocatedMember = (member, callback) => {
    const payload = {
      data: {
        id: member.allocationId,
      },
      callback,
    };
    dispatch(deleteAllocatedMemberForParliamentaryUnit(payload));
  };

  const linksGenerator = member => {
    const {
      allocatedElectionUnitNumber,
      allocatedMunicipality,
      allocatedSettlement,
      allocatedPollingStationId,
      allocatedPollingStationNumber,
      allocatedPollingStationName,
    } = member;
    const path = PATHS.PARLIAMENTARY_ELECTION;
    const links = [{
      name: intl.formatMessage({ id: 'ORGANIZATION.CROATIA' }),
      path,
    }];

    if (allocatedElectionUnitNumber) {
      const link = {
        name: intl.formatMessage(
          { id: 'ORGANIZATION.ELECTION_UNIT' },
          { electionUnit: allocatedElectionUnitNumber },
        ),
        path: `${path}/${allocatedElectionUnitNumber}`,
      };
      links.push(link);
    }
    if (allocatedMunicipality) {
      let link;
      if (allocatedSettlement) {
        link = {
          name: `${allocatedSettlement} (${allocatedMunicipality})`,
          path: `${path}/${allocatedElectionUnitNumber}/${allocatedSettlement}`,
        };
      } else {
        link = {
          name: allocatedMunicipality,
          path: `${path}/${allocatedElectionUnitNumber}/${allocatedMunicipality}`,
        };
      }
      links.push(link);
    }
    if (allocatedPollingStationId) {
      const electionRegion = allocatedSettlement || allocatedMunicipality;
      const link = {
        name: `(${allocatedPollingStationNumber}) ${allocatedPollingStationName}`,
        // eslint-disable-next-line max-len
        path: `${path}/${allocatedElectionUnitNumber}/${electionRegion}/${allocatedPollingStationId}`,
      };
      links.push(link);
    }

    return links;
  };

  const mainFilters = useMemo(() => {
    const newFilters = {
      ...state.filters,
    };
    delete newFilters.subunitName;
    return newFilters;
  }, [state.filters]);

  const generateAllocatedRoute = () => {
    const route = [
      PATHS.ALLOCATE_MEMBER_TO_PARLIAMENTARY_UNIT,
      electionUnit,
      electionRegion,
      pollingStation,
    ];
    return route.filter(r => r).join('/');
  };

  const memberDisplayNameFormatter = (member) => member.memberElectionUnit;

  return (
    <div className={styles.container}>
      <Button
        onClick={e => {
          e.preventDefault();
          history.push(generateAllocatedRoute());
        }}
        className={styles.button}
      >
        {
          intl.formatMessage({
            id: 'ORGANIZATION.ALLOCATED_MEMBER.BUTTON.ALLOCATE',
          }, {
            selected_unit_name: selectedRegion,
          })
        }
      </Button>
      <Filter onChange={handleFilterChange} />
      <AllocatedMemberListMainUnit
        headingTitle={(
          <FormattedHTMLMessage
            id="ORGANIZATION.ALLOCATED_MEMBER.LIST.UNIT.HEADING"
            values={{
              selected_unit_name: selectedRegion,
            }}
          />
        )}
        filters={mainFilters}
        pagination={state.pagination.mainUnit}
        onChangePagination={handleMainUnitPaginationChange}
        onUpdateNote={handleUpdateNote}
        onDeletedAllocatedMember={handleDeleteAllocatedMember}
        linksGenerator={linksGenerator}
        memberDisplayNameFormatter={memberDisplayNameFormatter}
      />
      {
        !pollingStation && (
          <AllocatedMemberListSubUnit
            headingTitle={(
              <FormattedHTMLMessage
                id={electionRegion ?
                  'ORGANIZATION.PARLIAMENTARY.ALLOCATED_MEMBER.LIST.SUBUNIT.HEADING' :
                  'ORGANIZATION.ALLOCATED_MEMBER.LIST.SUBUNIT.HEADING'}
                values={{
                  selected_unit_name: selectedRegion,
                }}
              />
            )}
            filters={state.filters}
            pagination={state.pagination.subUnit}
            onChangePagination={handleSubUnitPaginationChange}
            onUpdateNote={handleUpdateNote}
            onDeletedAllocatedMember={handleDeleteAllocatedMember}
            linksGenerator={linksGenerator}
            memberDisplayNameFormatter={memberDisplayNameFormatter}
          />
        )
      }
    </div>
  );
};

ParliamentaryAllocatedMembers.propTypes = {
  selectedRegion: PropTypes.string.isRequired,
};

export default memo(ParliamentaryAllocatedMembers);
