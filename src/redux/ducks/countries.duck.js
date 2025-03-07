import { createAction, handleActions } from 'redux-actions';
import { CROATIA_COUNTRY_NAME } from '@/constants/member';

/**
 * Setup state and prefix
 */
const initialStates = {
  fetching: false,
  success: false,
  error: null,
  data: [],
};
const PREFIX = 'COUNTRIES';

/**
 * Actions - using for calling, getting, setting from component
 */
export const setFetching = createAction(`${PREFIX}/FETCHING`);
export const requestFailed = createAction(`${PREFIX}/REQUEST_FAILED`);
export const requestSuccess = createAction(`${PREFIX}/REQUEST_SUCCESS`);
export const fetchCountries = createAction(`${PREFIX}/GET_COUNTRIES`);

export const getFetching = state => state.countries.fetching;
export const getSuccess = state => state.countries.success;
export const getError = state => state.countries.error;
export const getCountries = state => state.countries.data;
export const getCroatiaData = state =>
  state.countries.data.find(item => item.name === CROATIA_COUNTRY_NAME) || {};
export const getCountriesLookup = state => {
  const countries = {};

  state.countries.data.forEach(c => {
    const counties = {};
    countries[c.name] = {
      id: c.id,
      counties,
    };

    c.counties.forEach(ct => {
      const municipalities = {};
      counties[ct.name] = {
        id: ct.id,
        municipalities,
      };

      ct.municipalities.forEach(m => {
        const settlements = {};
        municipalities[m.name] = {
          id: m.id,
          settlements,
        };

        m.settlements.forEach(s => {
          const districts = {};
          settlements[s.name] = {
            id: s.id,
            districts,
          };

          s.districts.forEach(d => {
            districts[d.name] = {
              id: d.id,
            };
          });
        });
      });
    });
  });

  return countries;
};

/**
 * Reducers - using for redux store
 */
export default handleActions(
  new Map([
    [
      setFetching,
      (state, { payload }) => ({
        ...state,
        fetching: true,
        success: false,
        error: null,
        ...payload,
      }),
    ],
    [
      requestFailed,
      (state, { payload = { error: {}, response: {} } }) => ({
        ...state,
        fetching: false,
        success: false,
        error: payload.error,
        ...payload.response,
      }),
    ],
    [
      requestSuccess,
      (state, { payload = { response: {} } }) => ({
        ...state,
        fetching: false,
        success: true,
        error: null,
        ...payload.response,
      }),
    ],
  ]),
  {
    ...initialStates,
  },
);
