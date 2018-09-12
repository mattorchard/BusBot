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
    .reduce((min, current) => current < min ? current : min, Infinity);
  if (minimum < 5) {
    return "good"
  } else if (minimum < 15) {
    return "warning"
  } else {
    return "danger"
  }
}

const formatRouteAsAttachment = timestamp => route =>{
  const titleText = bold(`${route.routeId} ${route.heading}`);
  if (route.trips.length === 0) {
    return {
      title: titleText,
      text: "No upcoming arrivals",
      color: COLORS.noArrivals,
      ts: timestamp
    }
  }

  return {
    title: titleText,
    text: "Unset",
    color: getColorForTrips(route),
    ts: timestamp
  }
};

module.exports = {
  formatStopInfo: (stopInfo) => {
    const formattedStopName = bold(italics(stopInfo.stopName));
    if (stopInfo.routes.length === 0) {
      return `No upcoming arrivals for stop ${formattedStopName}`;
    }
    const timestamp = new Date().getTime().toString();
    const attachments = stopInfo.routes.map(formatRouteAsAttachment(timestamp));
    attachments[0].pretext = formattedStopName;
    return {attachments}
  }
};