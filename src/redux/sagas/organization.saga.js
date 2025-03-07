/* eslint-disable no-param-reassign */
import { isNumber } from 'lodash';
import {
  takeLatest,
  all,
  put,
  call,
} from 'redux-saga/effects';
import {
  setFetching,
  requestSuccess,
  requestFailed as requestFailedAction,
  fetchMembersForTerritorialAllocations,
  allocateMembersToTerritorialUnit,
  fetchPollingStations,
  fetchAllocatedMembersForTerritorialMainUnit,
  fetchAllocatedMembersForTerritorialSubUnit,
  updateMemberNoteForTerritorialUnit,
  deleteAllocatedMemberForTerritorialUnit,
  fetchCountAllocatedMembersForTerritorialUnit,
  fetchAllocatedMembersForParliamentaryMainUnit,
  fetchAllocatedMembersForParliamentarySubUnit,
  updateMemberNoteForParliamentaryUnit,
  deleteAllocatedMemberForParliamentaryUnit,
  fetchMembersForParliamentaryAllocations,
  allocateMembersToParliamentaryUnit,
  fetchCountAllocatedMembersForParliamentaryUnit,
  exportAllocatedMembers,
  setExporting,
} from '@/redux/ducks/organization.duck';
import { api } from '@/services';
import { ERROR_CODE_SCOPES } from '@/constants/errorCodes';
import { odataFilter } from '@/utils';
import { CROATIA_COUNTRY_NAME } from '@/constants/member';
import { ORGANIZATION } from '@/constants';

const requestFailed = args =>
  requestFailedAction({ ...args, scope: ERROR_CODE_SCOPES.MANAGEMENT });

const mainTerritorialUnitFiltersOdataInterceptor = filters => filtersOdata => {
  if (filters.nameAndSurname) {
    filtersOdata.$filter += ` and (contains(surname, '${filters.nameAndSurname}') eq true`;
    filtersOdata.$filter += ` or contains(name, '${filters.nameAndSurname}') eq true)`;
  }
};

const mainParliamentaryUnitFiltersOdataInterceptor = filters => filtersOdata => {
  if (filters.nameAndSurname) {
    filtersOdata.$filter +=
      ` and (contains(surname, '${filters.nameAndSurname}') eq true`;
    filtersOdata.$filter +=
      ` or contains(name, '${filters.nameAndSurname}') eq true)`;
  }

  if (filters.electionRegion) {
    filtersOdata.$filter +=
      ` and (allocatedMunicipality eq '${filters.electionRegion}'`;
    filtersOdata.$filter +=
      ` or allocatedSettlement eq '${filters.electionRegion}')`;
  } else {
    filtersOdata.$filter +=
      ' and allocatedMunicipality eq null';
    filtersOdata.$filter +=
      ' and allocatedSettlement eq null';
  }
};

const subTerritorialUnitFiltersOdataInterceptor = filters => filtersOdata => {
  if (filters.nameAndSurname) {
    filtersOdata.$filter += ` and (contains(surname, '${filters.nameAndSurname}') eq true`;
    filtersOdata.$filter += ` or contains(name, '${filters.nameAndSurname}') eq true)`;
  }

  if (filters.subunitName) {
    filtersOdata.$filter +=
      ` and (contains(allocatedCounty, '${filters.subunitName}') eq true`;
    filtersOdata.$filter +=
      ` or contains(allocatedMunicipality, '${filters.subunitName}') eq true`;
    filtersOdata.$filter +=
      ` or contains(allocatedSettlement, '${filters.subunitName}') eq true)`;
    filtersOdata.$filter +=
      ` or contains(allocatedDistrict, '${filters.subunitName}') eq true)`;
  }

  if (filters.allocatedDistrict) {
    filtersOdata.$filter += ' and false eq true';
  } else if (filters.allocatedSettlement) {
    filtersOdata.$filter += ' and allocatedDistrict ne null';
  } else if (filters.allocatedMunicipality) {
    filtersOdata.$filter += ' and allocatedSettlement ne null';
  } else if (filters.allocatedCounty) {
    filtersOdata.$filter += ' and allocatedMunicipality ne null';
  } else {
    filtersOdata.$filter += ' and allocatedCounty ne null';
  }
};

const subParliamentaryUnitFiltersOdataInterceptor = filters => filtersOdata => {
  if (filters.nameAndSurname) {
    filtersOdata.$filter +=
      ` and (contains(surname, '${filters.nameAndSurname}') eq true`;
    filtersOdata.$filter +=
      ` or contains(name, '${filters.nameAndSurname}') eq true)`;
  }

  if (filters.electionRegion) {
    filtersOdata.$filter +=
      ` and (allocatedMunicipality eq '${filters.electionRegion}'`;
    filtersOdata.$filter +=
      ` or allocatedSettlement eq '${filters.electionRegion}')`;
  }

  if (filters.subunitName) {
    filtersOdata.$filter +=
      ` and (contains(allocatedMunicipality, '${filters.subunitName}') eq true`;
    if (isNumber(filters.subunitName)) {
      filtersOdata.$filter +=
      ` or allocatedPollingStationNumber eq ${filters.subunitName}`;
      filtersOdata.$filter +=
      ` or allocatedElectionUnitNumber eq ${filters.subunitName}`;
    }
    filtersOdata.$filter +=
      ` or contains(allocatedPollingStationName, '${filters.subunitName}') eq true`;
    filtersOdata.$filter +=
      ` or contains(allocatedSettlement, '${filters.subunitName}') eq true)`;
  }

  if (filters.pollingStation) {
    filtersOdata.$filter += ' and false eq true';
  } else if (filters.electionRegion) {
    filtersOdata.$filter += ' and allocatedPollingStationId ne null';
  } else if (filters.electionUnit) {
    filtersOdata.$filter += ' and (allocatedMunicipality ne null';
    filtersOdata.$filter += ' or allocatedSettlement ne null)';
  } else {
    filtersOdata.$filter += ' and allocatedElectionUnitNumber ne null';
  }
};

function* getAllocatedMembersForTerritorialUnit(
  page,
  rowPerPage,
  filters,
  filtersOdataInterceptor) {
  const filtersOdata = odataFilter.compile(filters, {
    allocatedCountry: odataFilter.types.equal,
    allocatedCounty: odataFilter.types.equal,
    allocatedMunicipality: odataFilter.types.equal,
    allocatedSettlement: odataFilter.types.equal,
    allocatedDistrict: odataFilter.types.equal,
  });

  if (filtersOdataInterceptor) {
    filtersOdataInterceptor(filtersOdata);
  }

  const payload = {
    ...filtersOdata,
    $orderby: 'name',
    $top: rowPerPage,
    $count: true,
  };

  if (page > 0) {
    payload.$skip = (page - 1) * rowPerPage;
  }

  const data = yield call(api.get, 'api/TerritorialUnitAllocation', payload);

  return data;
}

function* getAllocatedMembersForParliamentaryUnit(
  page,
  rowPerPage,
  filters,
  filtersOdataInterceptor) {
  const filtersOdata = odataFilter.compile(filters, {
    allocatedCountry: odataFilter.types.equal,
    allocatedElectionUnitNumber: odataFilter.types.equal,
    allocatedPollingStationId: odataFilter.types.equal,
  });

  if (filtersOdataInterceptor) {
    filtersOdataInterceptor(filtersOdata);
  }

  const payload = {
    ...filtersOdata,
    $orderby: 'name',
    $top: rowPerPage,
    $count: true,
  };

  if (page > 0) {
    payload.$skip = (page - 1) * rowPerPage;
  }

  const data = yield call(api.get, 'api/ParliamentaryRegionAllocation', payload);

  return data;
}

function* onGetAllocatedMembersForTerritorialMainUnitFlow() {
  yield takeLatest(fetchAllocatedMembersForTerritorialMainUnit,
    function* onGetAllocatedMembersMainUnit({
      payload: { page, rowPerPage, filters },
    }) {
      yield put(setFetching());
      try {
        const newFilters = {
          allocatedCountry: ORGANIZATION.CROATIA_COUNTRY_NAME,
          allocatedCounty: filters.allocatedCounty ?? null,
          allocatedMunicipality: filters.allocatedMunicipality ?? null,
          allocatedSettlement: filters.allocatedSettlement ?? null,
          allocatedDistrict: filters.allocatedDistrict ?? null,
          allocationNotes: filters.notes,
        };
        const data = yield getAllocatedMembersForTerritorialUnit(
          page,
          rowPerPage,
          newFilters,
          mainTerritorialUnitFiltersOdataInterceptor(filters));

        yield put(
          requestSuccess({
            response: {
              allocatedMembersForTerritorialMainUnit: {
                data: data.value, total: data['@odata.count'],
              },
            },
            dismiss: true,
          }),
        );
      } catch (error) {
        yield put(requestFailed({ error }));
      }
    });
}

function* onGetAllocatedMembersForTerritorialSubUnitFlow() {
  yield takeLatest(fetchAllocatedMembersForTerritorialSubUnit,
    function* onGetAllocatedMembersSubUnit({
      payload: { page, rowPerPage, filters },
    }) {
      yield put(setFetching());
      try {
        if (filters.allocatedDistrict) {
          yield put(
            requestSuccess({
              response: {
                allocatedMembersForTerritorialSubUnit: { data: [], total: 0 },
              },
              dismiss: true,
            }),
          );
        } else {
          const newFilters = {
            allocatedCountry: ORGANIZATION.CROATIA_COUNTRY_NAME,
            allocatedCounty: filters.allocatedCounty,
            allocatedMunicipality: filters.allocatedMunicipality,
            allocatedSettlement: filters.allocatedSettlement,
            allocatedDistrict: filters.allocatedDistrict,
            allocationNotes: filters.notes,
          };
          const data = yield getAllocatedMembersForTerritorialUnit(
            page,
            rowPerPage,
            newFilters,
            subTerritorialUnitFiltersOdataInterceptor(filters));

          yield put(
            requestSuccess({
              response: {
                allocatedMembersForTerritorialSubUnit: {
                  data: data.value, total: data['@odata.count'],
                },
              },
              dismiss: true,
            }),
          );
        }
      } catch (error) {
        yield put(requestFailed({ error }));
      }
    });
}

function* onUpdateAllocatedMembersNoteForTerritorialUnitFlow() {
  yield takeLatest(updateMemberNoteForTerritorialUnit,
    function* onUpdateAllocatedMembersNoteForTerritorialUnit({
      payload: { data, callback },
    }) {
      yield put(setFetching());
      try {
        yield call(api.put,
          `api/TerritorialOrganization/allocation/${data.territorialUnitAllocationId}/notes`,
          data);
        yield call(callback);
        yield put(requestSuccess({ dismiss: true }));
      } catch (error) {
        yield put(requestFailed({ error }));
      }
    });
}

function* onDeleteAllocatedMemberForTerritorialUnitFlow() {
  yield takeLatest(deleteAllocatedMemberForTerritorialUnit,
    function* onDeleteAllocatedMemberForTerritorialUnit({
      payload: { data, callback },
    }) {
      yield put(setFetching());
      try {
        yield call(api.delete,
          `api/TerritorialOrganization/allocation/${data.id}`,
          data);
        yield call(callback);
        yield put(requestSuccess());
      } catch (error) {
        yield put(requestFailed({ error }));
      }
    });
}

function* onGetCountAllocatedMembersForTerritorialUnitFlow() {
  yield takeLatest(fetchCountAllocatedMembersForTerritorialUnit,
    function* onGetCountAllocatedMembersForTerritorialUnit({
      payload: { filters },
    }) {
      yield put(setFetching());
      try {
        const unitFilters = {
          allocatedCountry: ORGANIZATION.CROATIA_COUNTRY_NAME,
          allocatedCounty: filters.county ?? null,
          allocatedMunicipality: filters.municipality ?? null,
          allocatedSettlement: filters.settlement ?? null,
        };

        const unitData = yield getAllocatedMembersForTerritorialUnit(
          0,
          0,
          unitFilters,
          mainTerritorialUnitFiltersOdataInterceptor(unitFilters));

        const subunitFilters = {
          allocatedCountry: ORGANIZATION.CROATIA_COUNTRY_NAME,
          allocatedCounty: filters.county,
          allocatedMunicipality: filters.municipality,
          allocatedSettlement: filters.settlement,
        };

        const subunitData = yield getAllocatedMembersForTerritorialUnit(
          0,
          0,
          subunitFilters,
          subTerritorialUnitFiltersOdataInterceptor(subunitFilters));

        yield put(
          requestSuccess({
            response: {
              countAllocatedMembersForTerritorialUnit: {
                unit: unitData['@odata.count'],
                subunit: subunitData['@odata.count'],
              },
            },
            dismiss: true,
          }),
        );
      } catch (error) {
        yield put(requestFailed({ error }));
      }
    });
}

function* onGetMembersForTerritorialAllocationsFlow() {
  yield takeLatest(fetchMembersForTerritorialAllocations, function* onGetMembers({
    payload: { page, rowPerPage, filters, territorialUnit },
  }) {
    yield put(setFetching());
    try {
      const filtersOdata = odataFilter.compile(filters, {
        electionUnit: odataFilter.types.equal,
        invited: odataFilter.types.equal,
      });

      const { county, municipality, settlement, district } = territorialUnit;
      const countyFilter = (county && `'${county}'`) || null;
      const municipalityFilter = (municipality && `'${municipality}'`) || null;
      const settlementFilter = (settlement && `'${settlement}'`) || null;
      const districtFilter = (district && `'${district}'`) || null;
      const allocationFilter = `Allocations/all(
        d:d/allocatedCountry ne '${CROATIA_COUNTRY_NAME}'
        or d/allocatedCounty ne ${countyFilter}
        or d/allocatedMunicipality ne ${municipalityFilter}
        or d/allocatedSettlement ne ${settlementFilter}
        or d/allocatedDistrict ne ${districtFilter})`;

      if (filtersOdata.$filter) {
        filtersOdata.$filter = `${filtersOdata.$filter} and ${allocationFilter}`;
      } else {
        filtersOdata.$filter = allocationFilter;
      }

      const data = yield call(api.get, 'api/PublicMember', {
        ...filtersOdata,
        $orderby: 'name',
        $skip: (page - 1) * rowPerPage,
        $top: rowPerPage,
        $count: true,
      });
      yield put(
        requestSuccess({
          response: {
            territorialAllocation: {
              members: {
                data: data.value,
                total: data['@odata.count'],
              },
            },
          },
          dismiss: true,
        }),
      );
    } catch (error) {
      yield put(requestFailed({ error }));
    }
  });
}

function* onAllocateMembersToTerritorialUnitFlow() {
  yield takeLatest(allocateMembersToTerritorialUnit, function* onAllocateMembersToTerritorialUnit({
    payload: { data, callback = () => {} },
  }) {
    yield put(setFetching());
    try {
      yield call(api.put, 'api/TerritorialOrganization/allocation', data);
      yield put(requestSuccess());
      yield callback(true);
    } catch (error) {
      yield put(requestFailed({ error }));
      yield callback(false);
    }
  });
}

function* onGetPollingStationsFlow() {
  yield takeLatest(fetchPollingStations, function* onGetPollingStations({
    payload: { filters },
  }) {
    yield put(setFetching({
      parliamentary: {
        pollingStations: {
          data: [],
          fetching: true,
        },
      },
    }));
    try {
      const newFilters = {
        name: filters.name,
      };
      const filtersOdata = odataFilter.compile(newFilters);
      if (filters.electionRegion) {
        if (filtersOdata.$filter) {
          filtersOdata.$filter += ` and (municipality eq '${filters.electionRegion}'
          or settlement eq '${filters.electionRegion}')`;
        } else {
          filtersOdata.$filter = `(municipality eq '${filters.electionRegion}'
          or settlement eq '${filters.electionRegion}')`;
        }
      }
      const data = yield call(api.get, 'api/PollingStation', {
        ...filtersOdata,
        $orderby: 'number,name',
      });
      yield put(
        requestSuccess({
          response: {
            parliamentary: {
              pollingStations: {
                data: data.value,
                fetching: false,
              },
            },
          },
          dismiss: true,
        }),
      );
    } catch (error) {
      yield put(requestFailed({
        error,
        response: {
          parliamentary: {
            pollingStations: {
              data: [],
              fetching: false,
            },
          },
        },
      }));
    }
  });
}

function* onGetAllocatedMembersForParliamentaryMainUnitFlow() {
  yield takeLatest(fetchAllocatedMembersForParliamentaryMainUnit,
    function* onGetAllocatedMembersForParliamentaryMainUnit({
      payload: { page, rowPerPage, filters },
    }) {
      yield put(setFetching());
      try {
        const newFilters = {
          allocatedCountry: ORGANIZATION.CROATIA_COUNTRY_NAME,
          allocatedElectionUnitNumber: filters.electionUnit ? Number(filters.electionUnit) : null,
          allocatedPollingStationId: filters.pollingStation ? Number(filters.pollingStation) : null,
          allocationNotes: filters.notes,
        };
        const data = yield getAllocatedMembersForParliamentaryUnit(
          page,
          rowPerPage,
          newFilters,
          mainParliamentaryUnitFiltersOdataInterceptor(filters));

        yield put(
          requestSuccess({
            response: {
              allocatedMembersForParliamentaryMainUnit: {
                data: data.value, total: data['@odata.count'],
              },
            },
            dismiss: true,
          }),
        );
      } catch (error) {
        yield put(requestFailed({ error }));
      }
    });
}

function* onGetAllocatedMembersForParliamentarySubUnitFlow() {
  yield takeLatest(fetchAllocatedMembersForParliamentarySubUnit,
    function* onGetAllocatedMembersForParliamentarySubUnit({
      payload: { page, rowPerPage, filters },
    }) {
      yield put(setFetching());
      try {
        if (filters.allocatedSettlement) {
          yield put(
            requestSuccess({
              response: {
                allocatedMembersForParliamentarySubUnit: { data: [], total: 0 },
              },
              dismiss: true,
            }),
          );
        } else {
          const newFilters = {
            allocatedCountry: ORGANIZATION.CROATIA_COUNTRY_NAME,
            allocatedElectionUnitNumber: filters.electionUnit
              ? Number(filters.electionUnit)
              : undefined,
            allocatedPollingStationId: filters.pollingStation
              ? Number(filters.pollingStation)
              : undefined,
            allocationNotes: filters.notes,
          };
          const data = yield getAllocatedMembersForParliamentaryUnit(
            page,
            rowPerPage,
            newFilters,
            subParliamentaryUnitFiltersOdataInterceptor(filters));

          yield put(
            requestSuccess({
              response: {
                allocatedMembersForParliamentarySubUnit: {
                  data: data.value, total: data['@odata.count'],
                },
              },
              dismiss: true,
            }),
          );
        }
      } catch (error) {
        yield put(requestFailed({ error }));
      }
    });
}

function* onUpdateAllocatedMembersNoteForParliamentaryUnitFlow() {
  yield takeLatest(updateMemberNoteForParliamentaryUnit,
    function* onUpdateAllocatedMembonUpdateAllocatedMembersNoteForParliamentaryUnitersNote({
      payload: { data, callback },
    }) {
      yield put(setFetching());
      try {
        yield call(api.put,
          // eslint-disable-next-line max-len
          `api/TerritorialOrganization/allocation/ParliamentaryRegion/${data.parliamentaryRegionAllocationId}/notes`,
          data);
        yield call(callback);
        yield put(requestSuccess({ dismiss: true }));
      } catch (error) {
        yield put(requestFailed({ error }));
      }
    });
}

function* onDeleteAllocatedMemberForParliamentaryUnitFlow() {
  yield takeLatest(deleteAllocatedMemberForParliamentaryUnit,
    function* onDeleteAllocatedMemberForParliamentaryUnit({
      payload: { data, callback },
    }) {
      yield put(setFetching());
      try {
        yield call(api.delete,
          `api/TerritorialOrganization/allocation/ParliamentaryRegion/${data.id}`,
          data);
        yield call(callback);
        yield put(requestSuccess());
      } catch (error) {
        yield put(requestFailed({ error }));
      }
    });
}

function* onGetMembersForParliamentaryAllocationsFlow() {
  yield takeLatest(fetchMembersForParliamentaryAllocations,
    function* onGetMembersForParliamentaryAllocations({
      payload: { page, rowPerPage, filters, parliamentaryUnit },
    }) {
      yield put(setFetching());
      try {
        const filtersOdata = odataFilter.compile(filters, {
          electionUnit: odataFilter.types.equal,
          invited: odataFilter.types.equal,
        });

        const {
          electionUnit,
          municipality,
          settlement,
          pollingStation,
        } = parliamentaryUnit;
        const electionUnitFilter = (electionUnit && `${Number(electionUnit)}`) || null;
        const municipalityFilter = (municipality && `'${municipality}'`) || null;
        const settlementFilter = (settlement && `'${settlement}'`) || null;
        const pollingStationFilter = (pollingStation && `${Number(pollingStation)}`) || null;
        const allocationFilter = `ParliamentaryRegionAllocations/all(
          d:d/allocatedCountry ne '${CROATIA_COUNTRY_NAME}'
          or d/allocatedElectionUnitNumber ne ${electionUnitFilter}
          or d/allocatedMunicipality ne ${municipalityFilter}
          or d/allocatedSettlement ne ${settlementFilter}
          or d/allocatedPollingStationId ne ${pollingStationFilter})`;

        if (filtersOdata.$filter) {
          filtersOdata.$filter = `${filtersOdata.$filter} and ${allocationFilter}`;
        } else {
          filtersOdata.$filter = allocationFilter;
        }

        const data = yield call(api.get, 'api/PublicMember', {
          ...filtersOdata,
          $orderby: 'name',
          $skip: (page - 1) * rowPerPage,
          $top: rowPerPage,
          $count: true,
        });
        yield put(
          requestSuccess({
            response: {
              parliamentaryAllocation: {
                members: {
                  data: data.value,
                  total: data['@odata.count'],
                },
              },
            },
            dismiss: true,
          }),
        );
      } catch (error) {
        yield put(requestFailed({ error }));
      }
    });
}

function* onAllocateMembersToParliamentaryUnitFlow() {
  yield takeLatest(allocateMembersToParliamentaryUnit,
    function* onAllocateMembersToParliamentaryUnit({
      payload: { data, callback = () => {} },
    }) {
      yield put(setFetching());
      try {
        yield call(api.put, 'api/TerritorialOrganization/allocation/ParliamentaryRegion', data);
        yield put(requestSuccess());
        yield callback(true);
      } catch (error) {
        yield put(requestFailed({ error }));
        yield callback(false);
      }
    });
}

function* onGetCountAllocatedMembersForParliamentaryUnitFlow() {
  yield takeLatest(fetchCountAllocatedMembersForParliamentaryUnit,
    function* onGetCountAllocatedMembersForParliamentaryUnit({
      payload: { filters },
    }) {
      yield put(setFetching());
      try {
        const unitFilters = {
          allocatedCountry: ORGANIZATION.CROATIA_COUNTRY_NAME,
          allocatedElectionUnitNumber: filters.electionUnit ? Number(filters.electionUnit) : null,
          allocatedPollingStationId: filters.pollingStation ? Number(filters.pollingStation) : null,
        };

        const unitData = yield getAllocatedMembersForParliamentaryUnit(
          0,
          0,
          unitFilters,
          mainParliamentaryUnitFiltersOdataInterceptor(filters));

        const subunitFilters = {
          allocatedCountry: ORGANIZATION.CROATIA_COUNTRY_NAME,
          allocatedElectionUnitNumber: filters.electionUnit
            ? Number(filters.electionUnit)
            : undefined,
          allocatedPollingStationId: filters.pollingStation
            ? Number(filters.pollingStation)
            : undefined,
        };

        const subunitData = yield getAllocatedMembersForParliamentaryUnit(
          0,
          0,
          subunitFilters,
          subParliamentaryUnitFiltersOdataInterceptor(filters));

        yield put(
          requestSuccess({
            response: {
              countAllocatedMembersForParliamentaryUnit: {
                unit: unitData['@odata.count'],
                subunit: subunitData['@odata.count'],
              },
            },
            dismiss: true,
          }),
        );
      } catch (error) {
        yield put(requestFailed({ error }));
      }
    });
}

function* onExportAllocatedMembersFlow() {
  yield takeLatest(exportAllocatedMembers, function* onExportAllocatedMembers({
    payload: { url, filters, exportType },
  }) {
    try {
      yield put(setExporting({ isExporting: true }));
      const response = yield call(api.post, url, {
        ...filters,
        exportType,
      });

      response.blob()
        .then(blob => {
          const url = window.URL.createObjectURL(blob);

          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'AllocatedMembers.xlsx');
          document.body.appendChild(link);
          link.click();
          link.parentNode.removeChild(link);
        });
    } catch (error) {
      yield put(requestFailed({ error }));
    } finally {
      yield put(setExporting({ isExporting: false }));
    }
  });
}

export default function* organizationsSaga() {
  yield all([
    onGetAllocatedMembersForTerritorialMainUnitFlow(),
    onGetAllocatedMembersForTerritorialSubUnitFlow(),
    onUpdateAllocatedMembersNoteForTerritorialUnitFlow(),
    onDeleteAllocatedMemberForTerritorialUnitFlow(),
    onGetCountAllocatedMembersForTerritorialUnitFlow(),
    onGetMembersForTerritorialAllocationsFlow(),
    onAllocateMembersToTerritorialUnitFlow(),
    onGetPollingStationsFlow(),
    onGetAllocatedMembersForParliamentaryMainUnitFlow(),
    onGetAllocatedMembersForParliamentarySubUnitFlow(),
    onUpdateAllocatedMembersNoteForParliamentaryUnitFlow(),
    onDeleteAllocatedMemberForParliamentaryUnitFlow(),
    onGetMembersForParliamentaryAllocationsFlow(),
    onAllocateMembersToParliamentaryUnitFlow(),
    onGetCountAllocatedMembersForParliamentaryUnitFlow(),
    onExportAllocatedMembersFlow(),
  ]);
}
