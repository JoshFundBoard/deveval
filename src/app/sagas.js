import {
  fork,
  put,
  call,
  takeEvery,
} from 'redux-saga/effects';
import axios from 'axios';
import * as types from './actionTypes';

// remove this disable when you start using this function.
// eslint-disable-next-line no-unused-vars
function postChoices(data) {
  // You should return the data from the UI in this format to save it to Airtable.
  const exampleData = {
    records: [
      {
        fields: {
          name: 'Test User',
          choices: ['cake', 'pie', 'fruit'],
        },
      },
    ],
  };

  if (!Array.isArray(data.records)) throw new Error('A records array is required.');
  data.records.forEach(r => {
    if (!r.fields.name) throw new Error('A name is required.');
    if (!Array.isArray(r.fields.choices)) throw new Error('A choices array is required.');
    if (r.fields.choices.length < 3) throw new Error('Three choices are required.');
  });

  return axios({
    method: 'post',
    url: 'https://api.airtable.com/v0/appGSCyWcJcgauVi2/results',
    headers: {
      Authorization: 'Bearer keym1B881Ly2v7cNw',
    },
    data: exampleData,
  });
}

function getMenu() {
  return axios({
    method: 'get',
    url: 'https://api.airtable.com/v0/appGSCyWcJcgauVi2/desserts',
    headers: {
      Authorization: 'Bearer keym1B881Ly2v7cNw',
    },
  });
}

function* workGetAirTable() {
  try {
    const result = yield call(getMenu);

    const { data } = result;
    // This is here to handle airtable errors getting returned a little weirdly. Feel free to make
    // improvements to it if you really want to.
    if (data.error) throw new Error(data.error);
    yield put({ type: types.AIRTABLE_GET_SUCCEEDED, data });
  } catch (error) {
    yield put({ type: types.AIRTABLE_GET_FAILED, error });
  }
}

export function* watchGetAirTable() {
  yield takeEvery(types.AIRTABLE_GET_REQUESTED, workGetAirTable);
}

export default function* rootSaga() {
  yield fork(watchGetAirTable);
}
