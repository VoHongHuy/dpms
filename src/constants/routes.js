import Dashboard from '@/containers/Dashboard';
import ChangePassword from '@/containers/ChangePassword';
import NotFound from '@/containers/NotFound';
import Callback from '@/containers/Callback';
import { loginGuard } from '@/HOCs';

import PATHS from './paths';

/**
 * Using generate app routes
 */
export default [
  {
    path: PATHS.ROOT,
    title: 'Redirecting',
    redirect: true,
    to: PATHS.DASHBOARD,
    exact: true,
  },
  {
    path: PATHS.CALLBACK,
    title: 'Callback',
    component: Callback,
    exact: true,
  },
  {
    path: PATHS.DASHBOARD,
    title: 'Dashboard',
    component: loginGuard(Dashboard),
    exact: false,
  },
  {
    path: PATHS.CHANGE_PASSWORD,
    title: 'Change password',
    component: loginGuard(ChangePassword),
    exact: true,
  },
  {
    path: PATHS.NOT_FOUND,
    title: 'Page not found',
    component: NotFound,
    exact: true,
  },
  {
    path: PATHS.ROUTES_NOT_REGISTERED,
    title: 'Redirecting',
    redirect: true,
    to: PATHS.NOT_FOUND,
    exact: true,
  },
];
