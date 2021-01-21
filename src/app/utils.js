export function processErr(err) {
  if (!err) return false;
  if (err.response && err.response.data) {
    const { data } = err.response;
    if (data.error) {
      if (typeof data.error === 'object') {
        return JSON.stringify(data.error);
      }
      return data.error;
    }
    if (data.error_msg) {
      return data.error_msg;
    }
    if (Array.isArray(data)) {
      const m = data[0];
      return `${m.code ? `Code: ${m.code}` : ''} 
      ${m.collection_id ? `Collection: ${m.collection_id}` : ''} 
      ${m.message ? m.message : ''}`;
    }
    return err.response.data;
  }
  if (err.message) return err.message;
  if (typeof err === 'object') return JSON.stringify(err);
  return err;
}

export function statusIsError(state) {
  return !!state && !['pending', 'succeeded'].includes(state);
}

export function capitalizeFirstLetter(str) {
  if (typeof str !== 'string') return '';
  return `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
}

// Adapted from here https://github.com/pawelt/safethen/blob/master/index.js
export function getSafeVar(fn, defaultVal) {
  try {
    const value = fn();
    // eslint-disable-next-line no-void
    return value !== void 0 ? value : defaultVal;
  } catch (e) {
    return defaultVal; // will be undefined if not passed in, which is intentional.
  }
}
