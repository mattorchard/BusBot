const UIDGenerator = require('uid-generator');
const uidGenerator = new UIDGenerator();
const octranspoService = require('../services/octranspo-service.js');

const URL_BASE = "https://maps.googleapis.com/maps/api/staticmap?" +
  `key=${process.env.GMAPS_KEY}` +
  "&size=800x600" +
  "&maptype=roadmap";

const COLORS = ["green", "red", "blue"];
function tripToMarker(trip, index) {
  const color = "color:" + COLORS[index & COLORS.length];
  const label = "label:" + trip.label;
  const position = `${trip.latitude},${trip.longitude}`;
  const seperator = "%7c";
  return "&markers=" + [color, label, position].join(seperator);
}

function getGoogleMapsUrl(stopInfo) {
  const trips = getTripsFromRoutes(stopInfo.routes);
  return URL_BASE + trips.map(tripToMarker).join("");
}

function getTripsFromRoutes(routes) {
  const trips = [];
  routes.forEach(route => route.trips.forEach(trip => {
    if (trip) {
      trips.push({label: route.routeId, ...trip})
    }
  }));
  return trips;
}

function getPublicUrl(uid) {
  return process.env.PUBLIC_URL + "/maps/" + uid;
}

module.exports = function(storage){
  return {
    tripToMarker, getGoogleMapsUrl, getTripsFromRoutes, getPublicUrl,
    getMapUrl: async function(stopId, routeId, directionId) {
      const stopInfo = await octranspoService.getStopInfo(stopId, routeId, directionId);
      const googleMapsUrl = getGoogleMapsUrl(stopInfo);

      const uid = await uidGenerator.generate();
      console.log("Map url generated:", googleMapsUrl, "Saving to:", uid);
      storage.maps.save({id: uid, url: googleMapsUrl});

      return getPublicUrl(uid)
    }
  }
};