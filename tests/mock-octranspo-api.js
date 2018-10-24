const octranspoConstants = require("../services/octranspo-constants.json");
const nock = require('nock');
const GetNextTripsForStopAllRoutes_VALID = require('./sample_data/GetNextTripsForStopAllRoutes-VALID.json');
const GetNextTripsForStopAllRoutes_INVALID = require('./sample_data/GetNextTripsForStopAllRoutes-INVALID.json');


module.exports = function() {
  // noinspection EqualityComparisonWithCoercionJS
  nock(octranspoConstants.baseUrl)
    .get('/' + octranspoConstants.endpoints.stopInfo)
    .query(true)
    .reply(200, GetNextTripsForStopAllRoutes_VALID);
  // noinspection EqualityComparisonWithCoercionJS
  nock(octranspoConstants.baseUrl)
  .get('/' + octranspoConstants.endpoints.stopInfo)
  .query(query => query.stopNo == "0000")
  .reply(200, GetNextTripsForStopAllRoutes_INVALID);
};