import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { useIntl } from 'react-intl';
import {
  fetchMembers,
  getMembers,
  getStructureNodes,
  getTotalMembers,
} from '@/redux/ducks/structure.duck';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';
import { v1 } from 'uuid';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getViewHeight } from '@/utils/browserDetection';
import Loading from '@/components/Loading';
import { permissionsGuard } from '@/HOCs';
import { PERMISSIONS } from '@/constants/userAccounts';
import Filters from '../Filters';
import styles from './sidebar.module.scss';
import convertIcon from '../../../../assets/icons/detail.png';

import MemberCard from '../MemberCard';

export const unitDragDataKey = 'orgUnit';

const collectDiagramNodeMemberIds = (nodes) => {
  const memberIds = [];

  nodes.forEach(node => {
    if (node.memberId) {
      memberIds.push(node.memberId.toUpperCase());
    }

    if (node.children && node.children.length > 0) {
      const childrenMemberIds = collectDiagramNodeMemberIds(node.children);
      memberIds.push(...childrenMemberIds);
    }
  });

  return memberIds;
};

const filterPanelHeight = 420;
const defaultPaging = { page: 1, rowPerPage: 10 };

const StructureSidebar = ({ className }) => {
  const isInitialRun = useRef(true);

  const intl = useIntl();
  const dispatch = useDispatch();
  const [filters, setFilters] = useState({});
  const [pagination, setPagination] = useState(defaultPaging);
  const [localMembers, setLocalMembers] = useState([]);
  const [diagramNodeMemberIds, setDiagramMemberIds] = useState([]);
  const [isFetching, setFetching] = useState(false);
  const data = useSelector(getMembers, shallowEqual);
  const total = useSelector(getTotalMembers);
  const structureNodes = useSelector(getStructureNodes);

  useEffect(() => {
    if (localMembers.length === 0) {
      setFetching(true);
    }

    dispatch(
      fetchMembers({
        ...pagination,
        filters,
        callback: () => {
          setFetching(false);
        },
      }),
    );
  }, [pagination, filters]);

  useEffect(() => {
    if (isInitialRun.current) {
      // First run will always be caused by initialization of @data variable
      // Skip that and set local members only when we get fresh data
      isInitialRun.current = false;
      return;
    }

    setLocalMembers([...localMembers, ...data]);
  }, [data]);

  useEffect(() => {
    const diagramMemberIds = collectDiagramNodeMemberIds(structureNodes);
    setDiagramMemberIds(diagramMemberIds);
  }, [structureNodes]);

  const handleFitlerChange = debounce(filterValues => {
    setLocalMembers([]);
    setFilters(!filterValues ? {} : { ...filters, ...filterValues });
    setPagination({ ...defaultPaging });
  }, 500);

  const handleDragStart = event => {
    event.dataTransfer.setData(unitDragDataKey, JSON.stringify({ id: v1() }));
  };

  const getMoreMembers = () => {
    setPagination({ ...pagination, page: pagination.page + 1 });
  };

  const vh = getViewHeight() - filterPanelHeight;

  return (
    <div className={className}>
      <div className={styles.orgUnitCard} draggable onDragStart={handleDragStart}>
        <span className={styles.orgUnitTitle}>
          {intl.formatMessage({ id: 'STRUCTURES.LEFT.ORGANIZATION_UNIT.TITLE' })}
        </span>
        <img alt="convert icon" src={convertIcon} />
      </div>
      <div>
        <div className={styles.memberTitle}>
          {intl.formatMessage({ id: 'STRUCTURES.LEFT.MEMBER.TITLE' })}
        </div>
        <Filters onChange={handleFitlerChange} />
        {isFetching ? (
          <Loading />
        ) : (
          <InfiniteScroll
            dataLength={localMembers.length} // This is important field to render the next data
            next={getMoreMembers}
            hasMore={localMembers.length < total}
            loader={(
              <h4>
                {intl.formatMessage({
                  id: 'STRUCTURES.LEFT.MEMBER.SCROLL.LOADING',
                })}
              </h4>
            )}
            height={vh}
          >
            {localMembers.map(d => (
              <MemberCard
                id={d.id}
                draggable={d.id ? !diagramNodeMemberIds.includes(d.id.toUpperCase()) : true}
                email={d.email}
                key={d.id}
                name={d.name}
                surname={d.surname}
                ssn={d.ssn}
                address={d.address}
                contactNumber={d.contactNumber}
                electionUnit={d.electionUnit}
              />
            ))}
          </InfiniteScroll>
        )}
      </div>
    </div>
  );
};

StructureSidebar.defaultProps = {
  className: '',
};

StructureSidebar.propTypes = { className: PropTypes.string };

export default permissionsGuard([PERMISSIONS.MODIFY_STRUCTURE.value], StructureSidebar, false);
