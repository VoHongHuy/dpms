import { PATHS } from '../constants';
import CountiesResults from './CountiesResults';
import ElectionsResults from './ElectionsResults';

export default [
  {
    path: PATHS.RESULT_COUNTIES_ROUTE,
    title: 'Results',
    component: CountiesResults,
    exact: true,
  },
  {
    path: PATHS.RESULT_ELECTIONS_ROUTE,
    title: 'Results',
    component: ElectionsResults,
    exact: true,
  },
];
