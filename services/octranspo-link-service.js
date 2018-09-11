if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}

const BASE_URL = "https://api.octranspo1.com/v1.2";
const BASE_QUERY_PARAMS = {
  format: "json",
  appId: process.env.OCTRANSPO_APP_ID,
  apiKey: process.env.OCTRANSPO_API_KEY
};

function getUrl(endpoint, queryParams) {
  const queryEntries = Object.entries(Object.assign(BASE_QUERY_PARAMS, queryParams));
  const populatedQueryEntries = queryEntries.filter(entry => entry[0] && entry[1]);

  const queryList = populatedQueryEntries.map(entry => `${entry[0]}=${entry[1]}`);
  const queryString = queryList.join("&");

  return `${BASE_URL}/${endpoint}?${queryString}`;
}

module.exports = { getUrl };
