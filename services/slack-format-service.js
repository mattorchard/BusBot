
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

module.exports = {
  formatStopInfo: (stopInfo) => {
    return italics(bold(stopInfo.stopName)) + "\n" + stopInfo.routes.map(formatRoute).join("\n");
  }
};