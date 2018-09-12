const octranspoConstants = require("./octranspo-constants.json");

const BASE_QUERY_PARAMS = {
  format: "json",
  appID: process.env.OCTRANSPO_APP_ID,
  apiKey: process.env.OCTRANSPO_API_KEY
};

function getUrl(endpoint, queryParams) {
  const fullEndpoint = octranspoConstants.endpoints[endpoint];
  if (!fullEndpoint) {throw new Error(`Invalid endpoint [${endpoint}]`);}

  const queryEntries = Object.entries(Object.assign(BASE_QUERY_PARAMS, queryParams));
  const populatedQueryEntries = queryEntries.filter(entry => entry[0] && entry[1]);

  const queryList = populatedQueryEntries.map(entry => `${entry[0]}=${entry[1]}`);
  const queryString = queryList.join("&");

  return `${octranspoConstants.baseUrl}/${fullEndpoint}?${queryString}`;
}

module.exports = { getUrl };
