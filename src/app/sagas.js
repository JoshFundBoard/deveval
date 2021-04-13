import {
  fork,
  put,
  call,
  takeEvery,
  all,
} from 'redux-saga/effects';
import axios from 'axios';
import * as types from './actionTypes';

// remove this disable when you start using this function.
// eslint-disable-next-line no-unused-vars
function postChoices(rawData) {
  // console.log('INSIDE POST CHOICES', data);
  const { name, choices } = rawData;
  /*
    The data returned from the UI will need to be sent to the API in this format. You could do that
    in the UI code, but it's better to do it here.
  */
  // const exampleData = {
  //   records: [
  //     {
  //       fields: {
  //         name: 'Test User',
  //         choices: ['cake', 'pie', 'fruit'],
  //       },
  //     },
  //   ],
  // };
  const data = {
    records: [
      {
        fields: {
          name,
          choices,
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

  /*
    This function (postChoices) should be called from a work function, using a similar pattern to
    the way the dessert data is pulled in below.

    You don't have access to the Airtable base being called, but you can tell if your code worked
    by looking at the data returned. Airtable will send a response that looks like:

    records: [
        {
            "id": "recX4FiYNIuId5IWQ",
            "fields": {
                "name": "test2",
                "choices": [
                    "cake",
                    "flan",
                ]
            },
            "createdTime": "2021-01-19T17:20:48.000Z"
        }
    ]
  */
  return axios({
    method: 'post',
    url: 'https://api.airtable.com/v0/appGSCyWcJcgauVi2/results',
    headers: {
      Authorization: 'Bearer keym1B881Ly2v7cNw',
    },
    data,
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

function* workPostData(postData) {
  try {
    const result = yield call(() => postChoices(postData));
    const { data } = result;
    // This is here to handle airtable errors getting returned a little weirdly. Feel free to make
    // improvements to it if you really want to.
    if (data.error) throw new Error(data.error);
    yield put({ type: types.POST_DESSERT_DATA_SUCCEEDED, data });
  } catch (error) {
    yield put({ type: types.POST_DESSERT_DATA_FAILED, error });
  }
}

export function* watchGetAirTable() {
  yield takeEvery(types.AIRTABLE_GET_REQUESTED, workGetAirTable);
}

export function* watchPostData() {
  yield takeEvery(types.POST_DESSERT_DATA_REQUESTED, data => workPostData(data));
}

export default function* rootSaga() {
  yield all([
    fork(watchGetAirTable),
    fork(watchPostData),
  ]);
}
