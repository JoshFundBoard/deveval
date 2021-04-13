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
  // add any other defaults that shouldn't reset here.
};

export default function rootReducer(state = defaults, action) {
  console.log(action); // just for debugging
  switch (action.type) {
    case types.AIRTABLE_GET_REQUESTED: return {
      ...state,
      get_status: 'pending',
    };
    case types.AIRTABLE_GET_SUCCEEDED: {
      const rawDesserts = action.data.records.map(r => r.fields.value);
      const validDesserts = rawDesserts.filter(element => !!element);
      const sortedDesserts = validDesserts.sort();
      return {
        ...state,
        get_status: 'succeeded',
        desserts: sortedDesserts,
      };
    }
    case types.AIRTABLE_GET_FAILED: return {
      ...state,
      get_status: processErr(action.error),
    };
    case types.AIRTABLE_GET_DISMISSED: return {
      ...state,
      get_status: '',
      // This is so you can dismiss status alerts
    };
    case types.POST_DESSERT_DATA_REQUESTED: return {
      ...state,
      post_status: 'saving...',
    };
    case types.POST_DESSERT_DATA_SUCCEEDED: return {
      ...state,
      post_status: 'saved.',
    };
    case types.POST_DESSERT_DATA_FAILED: return {
      ...state,
      post_status: processErr(action.error),
    };
    default: return state;
  }
}
