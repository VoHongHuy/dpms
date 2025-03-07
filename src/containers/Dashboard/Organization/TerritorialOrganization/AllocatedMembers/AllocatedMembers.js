import React, { memo, useState, useMemo } from 'react';
import { connect, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { useIntl, FormattedHTMLMessage } from 'react-intl';
import { debounce } from 'lodash';
import { useParams } from 'react-router';
import history from '@/history';
import {
  fetchAllocatedMembersForTerritorialMainUnit,
  getAllocatedMembersForTerritorialMainUnit,
  getAllocatedMembersForTerritorialSubUnit,
  fetchAllocatedMembersForTerritorialSubUnit,
  updateMemberNoteForTerritorialUnit,
  deleteAllocatedMemberForTerritorialUnit,
} from '@/redux/ducks/organization.duck';
import Button from '@/components/Button';
import { ORGANIZATION } from '@/constants';
import { hasPermissions } from '@/utils/user';
import { PERMISSIONS } from '@/constants/userAccounts';
import Filter from '../../AllocatedMemberTable/AllocatedMemberFilter';
import AllocatedMemberList from '../../AllocatedMemberTable/AllocatedMemberList';
import { PATHS } from '../../../constants';

import styles from './allocatedMembers.module.scss';

const AllocatedMemberListMainUnit = connect(state => ({
  allocatedMembers: getAllocatedMembersForTerritorialMainUnit(state),
}), dispatch => ({
  fetchAllocatedMembers: (payload) =>
    dispatch(fetchAllocatedMembersForTerritorialMainUnit(payload)),
}))(AllocatedMemberList);

const AllocatedMemberListSubUnit = connect(state => ({
  allocatedMembers: getAllocatedMembersForTerritorialSubUnit(state),
}), dispatch => ({
  fetchAllocatedMembers: (payload) => dispatch(fetchAllocatedMembersForTerritorialSubUnit(payload)),
}))(AllocatedMemberList);

const TerritorialAllocatedMember = ({ selectedRegion }) => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const { county, municipality, settlement, district } = useParams();
  const defaultFilters = {
    allocatedCounty: county && county.toLowerCase() === ORGANIZATION.COUNTY.ZAGREB ?
      ORGANIZATION.COUNTY.GRAD_ZAGREB :
      county,
    allocatedMunicipality: municipality,
    allocatedSettlement: settlement,
    allocatedDistrict: district,
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
        territorialUnitAllocationId: member.allocationId,
        notes,
      },
      callback,
    };
    dispatch(updateMemberNoteForTerritorialUnit(payload));
  };

  const handleDeleteAllocatedMember = (member, callback) => {
    const payload = {
      data: {
        id: member.allocationId,
      },
      callback,
    };
    dispatch(deleteAllocatedMemberForTerritorialUnit(payload));
  };

  const linksGenerator = member => {
    const {
      allocatedCounty,
      allocatedMunicipality,
      allocatedSettlement,
      allocatedDistrict,
    } = member;
    const path = PATHS.TERRITORIAL_ORGANIZATION;
    const links = [{
      name: intl.formatMessage({ id: 'ORGANIZATION.CROATIA' }),
      path,
    }];

    if (allocatedCounty) {
      const link = { name: allocatedCounty, path: `${path}/${allocatedCounty}` };
      links.push(link);
    }
    if (allocatedMunicipality) {
      const link = {
        name: allocatedMunicipality,
        path: `${path}/${allocatedCounty}/${allocatedMunicipality}`,
      };
      links.push(link);
    }
    if (allocatedSettlement) {
      const link = {
        name: allocatedSettlement,
        path: `${path}/${allocatedCounty}/${allocatedMunicipality}/${allocatedSettlement}`,
      };
      links.push(link);
    }
    if (allocatedDistrict) {
      const link = {
        name: allocatedDistrict,
        // eslint-disable-next-line max-len
        path: `${path}/${allocatedCounty}/${allocatedMunicipality}/${allocatedSettlement}/${allocatedDistrict}`,
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
      PATHS.ALLOCATE_MEMBER_TO_TERRITORIAL_UNIT,
      county,
      municipality,
      settlement,
      district,
    ];
    return route.filter(r => r).join('/');
  };

  const hasSubunit = useMemo(() =>
    !settlement
    || (settlement.toLowerCase() === ORGANIZATION.SETTLEMENT.OSIJEK && !district),
  [settlement, district]);

  return (
    <div className={styles.container}>
      {hasPermissions([PERMISSIONS.MODIFY_TERRITORIAL_ORGANIZATION.value]) && (
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
      )}
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
      />
      {
        hasSubunit && (
          <AllocatedMemberListSubUnit
            headingTitle={(
              <FormattedHTMLMessage
                id="ORGANIZATION.ALLOCATED_MEMBER.LIST.SUBUNIT.HEADING"
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
          />
        )
      }
    </div>
  );
};

TerritorialAllocatedMember.propTypes = {
  selectedRegion: PropTypes.string.isRequired,
};

export default memo(TerritorialAllocatedMember);
