const fetch = require('node-fetch');




module.exports = function(webserver, storage) {
  webserver.get("/maps/:uid", async (req, res) => {
    try {
      const uid = req.params.uid;
      console.log("UID:", uid);
      const savedUrl = await storage.maps.get(uid);
      const url = savedUrl.url;
      console.log("URL:", url);
      const response = await fetch(url);
      response.body.pipe(res);
    } catch (error) {
      console.warn("No URL found for UID:", uid);
      res.status(404).send("Map not found for UID:" + uid);
    }
  });
};