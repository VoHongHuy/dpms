import PATHS from '@/containers/Dashboard/constants/paths';
import { permissionsGuard } from '@/HOCs';
import { PERMISSIONS } from '@/constants/userAccounts';

import ListMembers from './ListMembers';
import AddMember from './AddMember';
import EditMember from './EditMember';

export default [
  {
    path: PATHS.MEMBERS,
    title: 'Members',
    component: ListMembers,
    exact: true,
  },
  {
    path: PATHS.MEMBERS_ADD,
    title: 'Add Member',
    component: permissionsGuard([PERMISSIONS.CREATE_MEMBER.value], AddMember),
    exact: true,
  },
  {
    path: PATHS.MEMBERS_EDIT,
    title: 'Edit Member',
    component: permissionsGuard([PERMISSIONS.VIEW_MEMBERS.value], EditMember),
    exact: true,
  },
];
