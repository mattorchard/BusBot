const COLORS = {
  noArrivals: "#202020"
};


function bold(text) {
  return `*${text}*`
}

function italics(text) {
  return `_${text}_`;
}

function removeFrench(text) {
  if (text.indexOf("/") === -1) {
    return text;
  } else {
    return /^(.*?) ?\/.*$/.exec(text)[1];
  }
}

function formatTrip(trip) {
  return `  ${removeFrench(trip.destination)} in ${bold(trip.time)}`;
}

function formatRoute(route) {
  const titleText = bold(`${route.routeId} ${route.heading}`);
  if (route.trips.length === 0) {
    return `${titleText}\n  No upcoming arrivals\n`;
  } else {
    const tripsText = route.trips.map(formatTrip).join("\n");
    return `${titleText}\n${tripsText}\n`;
  }
}

function getColorForTrips(trips) {
  const minimum = trips
    .map(trip => parseInt(trip.time))
    .reduce((min, current) => Math.min(min, current), Infinity);
  if (minimum < 5) {
    return "good"
  } else if (minimum < 15) {
    return "warning"
  } else {
    return "danger"
  }
}

function formatTrips(trips) {
  const destinations = trips.reduce((accumulator, trip) => {
    if (accumulator[trip.destination]) {
      accumulator[trip.destination] = `${accumulator[trip.destination]}, ${trip.time}`;
    } else {
      accumulator[trip.destination] = trip.time.toString();
    }
    return accumulator;
  }, {});
  const destinationEntries = Object.entries(destinations);
  const includeDestination = (destinationEntries.length > 1);
  return destinationEntries.map(entry => { return {
      title: includeDestination ? removeFrench(entry[0]) : null,
      value: `${entry[1]} minutes`,
      short: true
  }});
}

function formatRouteAsAttachment (route) {
  const titleText = `${route.routeId} ${route.heading}`;
  if (route.trips.length === 0) {
    return {
      title: titleText,
      text: "No upcoming arrivals",
      color: COLORS.noArrivals,
    }
  }

  return {
    title: titleText,
    fields: formatTrips(route.trips),
    color: getColorForTrips(route.trips),
  }
}

module.exports = {
  formatStopInfo: (stopInfo) => {
    if (stopInfo.routes.length === 0) {
      return `No upcoming arrivals for stop ${bold(italics(stopInfo.stopName))}`;
    }
    const attachments = stopInfo.routes.map(formatRouteAsAttachment);
    attachments[0].pretext = `Upcoming arrivals for ${stopInfo.stopName}`;
    return {attachments}
  }
};