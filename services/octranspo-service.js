const fetch = require('node-fetch');
const octranspoConstants = require("./octranspo-constants.json");

const BASE_QUERY_PARAMS = {
  format: "json",
  appID: process.env.OCTRANSPO_APP_ID,
  apiKey: process.env.OCTRANSPO_API_KEY
};

/* Generic OCTranspo Functions */

function getUrl(endpoint, queryParams) {
  const fullEndpoint = octranspoConstants.endpoints[endpoint];
  if (!fullEndpoint) {throw new Error(`Invalid endpoint [${endpoint}]`);}

  const queryEntries = Object.entries(Object.assign(BASE_QUERY_PARAMS, queryParams));
  const populatedQueryEntries = queryEntries.filter(entry => entry[0] && entry[1]);

  const queryList = populatedQueryEntries.map(entry => `${entry[0]}=${entry[1]}`);
  const queryString = queryList.join("&");

  return `${octranspoConstants.baseUrl}/${fullEndpoint}?${queryString}`;
}

async function fetchStopInfo(stopNo) {
  const queryParams = {stopNo};
  const response = await fetch(getUrl("getStopInfo", queryParams));
  if (!response.ok) {
    throw new Error(`Error contacting OCTranspo API status: [${response.status}]`);
  }
  let data;
  try {
    data = await response.json();
  } catch (e) {
    console.error("Malformed JSON from OCTranspo (typically credentials issue)");
    throw new Error("OCTranspo returned malformed json");
  }

  const stopData = data && data.GetRouteSummaryForStopResult;

  if (!stopData) {
    throw new Error("No data returned for stop");
  } else if (stopData.Error) {
    const octranspoErrorMessage = octranspoConstants.errors[stopData.Error];
    if (octranspoErrorMessage) {
      throw new Error(octranspoErrorMessage)
    } else {
      throw new Error(`Unknown OCTranspo error message [${stopData.Error}]\n${JSON.stringify(stopData, null, 2)}`);
    }
  }

  return stopData;
}

// Todo: Refactor once Node adds support for flatMap
function parseOctranspoArray(parent, name) {
  const namePlural = `${name}s`;
  if (parent[namePlural]) {
    const children = parent[namePlural];
    if (Array.isArray(children)) {
      return children;
    } else {
      if (children[name]) {
        const subChildren = children[name];
        if (Array.isArray(subChildren)) {
          return subChildren
        } else {
          return [subChildren]
        }
      }
      return [children];
    }
  } else if (parent[name]) {
    const child = parent[name];
    if (child[name]) {
      return [child[name]]
    }
    return [child];
  } else {
    return [];
  }
}

/* Stop Info Functions */

function formatTripsForStopInfo(trip) {
  return {
    destination: trip.TripDestination,
    time: trip.AdjustedScheduleTime
  };
}

function formatRoutesForStopInfo(route) {
  return {
    routeId: route.RouteNo,
    heading: route.RouteHeading,
    directionId: route.DirectionID,
    trips: parseOctranspoArray(route, "Trip").map(formatTripsForStopInfo)
  };
}

async function getStopInfo(stopId, routeId, directionId) {
  if (directionId && !routeId) {
    throw new Error("Must specify route to filter by direction");
  }

  const busData = await fetchStopInfo(stopId);
  let routes = parseOctranspoArray(busData, "Route").map(formatRoutesForStopInfo);

  if (routeId && directionId) {
    routes = routes.filter(route => route.routeId === routeId && route.directionId === directionId)
  } else if (routeId) {
    routes = routes.filter(route => route.routeId === routeId);
  }

  return {
    stopName: busData.StopDescription,
    routes: routes
  };
}


module.exports = { getUrl, getStopInfo };
