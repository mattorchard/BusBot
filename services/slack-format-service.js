const ATTACHMENT_COLORS = {
  noArrivals: "#202020",
  soon: "good",
  soonish: "warning",
  late: "danger"
};

const SOON_THRESHOLD = 5;
const SOONISH_THRESHOLD = 15;


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

function getColorForTrips(trips) {
  const soonestTripTime = trips
    .map(trip => parseInt(trip.time))
    .reduce((min, current) => Math.min(min, current), Infinity);
  if (soonestTripTime <= SOON_THRESHOLD) {
    return ATTACHMENT_COLORS.soon;
  } else if (soonestTripTime <= SOONISH_THRESHOLD) {
    return ATTACHMENT_COLORS.soonish;
  } else {
    return ATTACHMENT_COLORS.late;
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
  const multipleDestinations = (destinationEntries.length > 1);
  return destinationEntries.map(entry => { return {
      title: multipleDestinations ? removeFrench(entry[0]) : null,
      value: `${italics(entry[1])} minutes`
  }});
}

function formatRouteAsAttachment (route) {
  const titleText = `${route.routeId} ${route.heading}`;
  if (route.trips.length === 0) {
    return {
      title: titleText,
      text: "No upcoming arrivals",
      color: ATTACHMENT_COLORS.noArrivals
    }
  }
  return {
    title: titleText,
    fields: formatTrips(route.trips),
    color: getColorForTrips(route.trips),
    mrkdwn_in: ["fields"]
  }
}

module.exports = {
  formatStopInfo: (stopInfo) => {
    const titleText = bold(stopInfo.stopName);
    if (stopInfo.routes.length === 0) {
      return `No upcoming arrivals for stop ${titleText}`;
    }
    const attachments = stopInfo.routes.map(formatRouteAsAttachment);
    return {
      text: `Upcoming arrivals for ${titleText}`,
      attachments: attachments
    }
  },
  formatBusMap: (publicUrl, legend) => {
    return {
      attachments: [{
        text: " ",
        image_url: publicUrl
      }]
    };
  }
};