import PATHS from '@/containers/Dashboard/constants/paths';

import ListAccounts from './ListAccounts';
import AddAccount from './AddAccount';
import EditAccount from './EditAccount';

export default [
  {
    path: PATHS.USER_ACCOUNTS,
    title: 'User accounts',
    component: ListAccounts,
    exact: true,
  },
  {
    path: PATHS.USER_ACCOUNTS_ADD,
    title: 'Add new account',
    component: AddAccount,
    exact: true,
  },
  {
    path: PATHS.USER_ACCOUNTS_EDIT,
    title: 'Edit account',
    component: EditAccount,
    exact: true,
  },
];
