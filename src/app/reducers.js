import * as types from './actionTypes';
import {
  processErr,
} from './utils';

const resets = {
  get_status: '',
  post_status: '',
  alert_status: '',
  post_message: '',
};

const defaults = {
  ...resets,
  // add any other defaults that shouldn't reset here.
};

export default function rootReducer(state = defaults, action) {
  console.log(action); // just for debugging
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
      // This is so you can dismiss status alerts
    };
    case types.UPDATE_NAME: return {
      ...state,
      name: action.payload,
    };
    case types.AIRTABLE_POST_REQUESTED: return {
      ...state,
      post_status: 'pending',
    };
    case types.AIRTABLE_POST_SUCCEEDED:
      return {
        ...state,
        post_message: action.message,
        post_status: 'succeeded',
      };
    case types.AIRTABLE_POST_FAILED: return {
      ...state,
      post_status: processErr(action.error),
      post_message: processErr(action.error),
    };
    case types.AIRTABLE_POST_DISMISSED: return {
      ...state,
      post_status: '',
      post_message: '',
    };
    case types.ALERT_REQUESTED: return {
      ...state,
      alert_status: action.payload,
    };
    case types.ALERT_DISMISSED: return {
      ...state,
      alert_status: '',
    };
    default: return state;
  }
}
