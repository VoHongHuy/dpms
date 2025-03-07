import APP_PATHS from '@/constants/paths';
import { rolesGuard, permissionsGuard } from '@/HOCs';
import { ROLES, PERMISSIONS } from '@/constants/userAccounts';

import Home from '../Home';
import Results from '../Results';
import Members from '../Members';
import Structure from '../Structure';
import Organization from '../Organization';
import UserAccounts from '../UserAccounts';
import DuplicateOIB from '../DuplicateOIB';
import Payments from '../Payments';
import BulkEmails from '../BulkEmails';

import PATHS from './paths';

/**
 * Using generate app routes
 */
export default [
  {
    path: PATHS.ROOT,
    title: 'Redirecting',
    redirect: true,
    to: PATHS.HOME,
    exact: true,
  },
  {
    path: PATHS.HOME,
    title: 'Home',
    component: Home,
    exact: true,
  },
  {
    path: PATHS.RESULTS,
    title: 'Results',
    component: permissionsGuard([PERMISSIONS.VIEW_RESULTS.value], Results),
    exact: false,
  },
  {
    path: PATHS.MEMBERS,
    title: 'Members',
    component: permissionsGuard([PERMISSIONS.VIEW_MEMBERS.value], Members),
    exact: false,
  },
  {
    path: PATHS.DUPLICATE_OIBS,
    title: 'Duplicate OIBs',
    component: permissionsGuard([PERMISSIONS.VIEW_MEMBERS.value], DuplicateOIB),
    exact: true,
  },
  {
    path: PATHS.STRUCTURE_ROUTE,
    title: 'Structure',
    component: permissionsGuard([PERMISSIONS.VIEW_STRUCTURE.value], Structure),
    exact: true,
  },
  {
    path: PATHS.ORGANIZATION,
    title: 'Organization',
    component: permissionsGuard([PERMISSIONS.VIEW_TERRITORIAL_ORGANIZATION.value], Organization),
  },
  {
    path: PATHS.PAYMENTS,
    title: 'Payments',
    component: Payments,
  },
  {
    path: PATHS.BULK_EMAILS,
    title: 'Bulk emails',
    component: permissionsGuard([PERMISSIONS.BULK_EMAIL.value], BulkEmails),
    exact: true,
  },
  {
    path: PATHS.USER_ACCOUNTS,
    title: 'User accounts',
    component: rolesGuard(
      [ROLES.ADMIN.alias, ROLES.MANAGER.alias],
      UserAccounts,
    ),
    exact: false,
  },
  {
    path: PATHS.ROUTES_NOT_REGISTERED,
    title: 'Page not found',
    redirect: true,
    to: APP_PATHS.NOT_FOUND,
    exact: true,
  },
];
