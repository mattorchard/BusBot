const fetch = require('node-fetch');

const url = "https://maps.googleapis.com/maps/api/staticmap?center=Brooklyn+Bridge,New+York,NY&zoom=13&size=600x300&maptype=roadmap&markers=color:blue%7Clabel:S%7C40.702147,-74.015794&markers=color:green%7Clabel:G%7C40.711614,-74.012318&markers=color:red%7Clabel:C%7C40.718217,-73.998284";

module.exports = function(webserver, storage) {
  webserver.get("/maps/:uid", async (req, res) => {
    console.log("UID:", req.params.uid);
    const response = await fetch(url);
    response.body.pipe(res);
  });
};