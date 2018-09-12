const fetch = require('node-fetch');
const util = require('./octranspo-link-service.js');
const octranspoConstants = require("./octranspo-constants.json");

async function fetchStopInfo(stopNo) {
  const queryParams = {stopNo};
  const response = await fetch(util.getUrl("stopInfo", queryParams));

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

async function stopInfo(stop, route, direction) {
  if (direction && !route) {
    throw new Error("Must specify route to filter by direction");
  }

  const busData = await fetchStopInfo(stop);
  let routes = parseOctranspoArray(busData, "Route").map(formatRoutesForStopInfo);

  if (route && direction) {
    routes = routes.filter(route => route.routeId === route && route.directionId === direction)
  } else if (route) {
    routes = routes.filter(route => route.routeId === route);
  }

  return {
    stopName: busData.StopDescription,
    routes: routes
  };
}


module.exports = { stopInfo };
