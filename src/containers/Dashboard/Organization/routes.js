import PATHS from '@/containers/Dashboard/constants/paths';
import TerritorialAllocateMembers from './TerritorialOrganization/AllocateMembers/AllocateMembers';
import ParliamentaryAllocateMembers from './ParliamentaryElection/AllocateMembers/AllocateMembers';
import TerritorialOrganization from './TerritorialOrganization';
import ParliamentaryElection from './ParliamentaryElection';

export default [
  {
    path: PATHS.TERRITORIAL_ORGANIZATION_WITH_PARAMS,
    title: 'Territorial organization',
    component: TerritorialOrganization,
    exact: true,
  },
  {
    path: PATHS.ALLOCATE_MEMBER_TO_TERRITORIAL_UNIT_ROUTE,
    title: 'Allocate members to territorial unit',
    component: TerritorialAllocateMembers,
    exact: true,
  },
  {
    path: PATHS.PARLIAMENTARY_ELECTION_ROUTE,
    title: 'Parliamentary elections',
    component: ParliamentaryElection,
    exact: true,
  },
  {
    path: PATHS.ALLOCATE_MEMBER_TO_PARLIAMENTARY_UNIT_ROUTE,
    title: 'Allocate members to parliamentary unit',
    component: ParliamentaryAllocateMembers,
    exact: true,
  },
];
