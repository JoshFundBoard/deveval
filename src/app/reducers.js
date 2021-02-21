import { combineReducers } from 'redux';
import * as types from './actionTypes';
import {
  processErr,
} from './utils';

const resets = {
  get_status: '',
  post_status: '',
};

const defaults = {
  ...resets,
  user: '',
  chosenDesserts: [],
};

function userReducer(state = defaults, action) {
  switch (action.type) {
    case types.SET_NAME:
      return {
        ...state,
        user: action.user,
      };
    default:
      return state;
  }
}

function dessertsReducer(state = defaults, action) {
  switch (action.type) {
    case types.ADD_DESSERT:
      return {
        ...state,
        chosenDesserts: [...state.chosenDesserts, action.chosenDessert],
      };
    case types.REMOVE_DESSERT:
      return {
        ...state,
        chosenDesserts: state.chosenDesserts.filter(dessert => dessert !== action.chosenDessert),
      };
    default:
      return state;
  }
}

function getAirtableReducer(state = defaults, action) {
  switch (action.type) {
    case types.AIRTABLE_GET_REQUESTED: return {
      ...state,
      get_status: 'pending',
    };
    case types.AIRTABLE_GET_SUCCEEDED:
      return {
        ...state,
        get_status: 'succeeded',
        desserts: action.data.records.map(r => r.fields.value),
      };
    case types.AIRTABLE_GET_FAILED: return {
      ...state,
      get_status: processErr(action.error),
    };
    case types.AIRTABLE_GET_DISMISSED: return {
      ...state,
      get_status: '',
    };
    default: return state;
  }
}

function postAirtableReducer(state = defaults, action) {
  switch (action.type) {
    case types.AIRTABLE_POST_REQUESTED: return {
      ...state,
      post_status: 'pending',
    };
    case types.AIRTABLE_POST_SUCCEEDED:
      return {
        ...state,
        post_status: 'succeeded',
      };
    case types.AIRTABLE_POST_FAILED: return {
      ...state,
      post_status: processErr(action.error),
    };
    case types.AIRTABLE_POST_DISMISSED: return {
      ...state,
      post_status: '',
    };
    default: return state;
  }
}

const rootReducer = combineReducers({
  getAirtable: getAirtableReducer,
  postAirtable: postAirtableReducer,
  desserts: dessertsReducer,
  user: userReducer,
});

export default rootReducer;
