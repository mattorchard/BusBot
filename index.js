const BotKit = require("botkit");
const BotkitStorage = require('botkit-storage-mongo');
const SlashBus = require("./behaviors/slash-bus");

if (!process.env.CLIENT_ID
  || !process.env.CLIENT_SECRET
  || !process.env.PORT
  || !process.env.REDIRECT_URI
  || !process.env.MONGOLAB_URI
  || !process.env.OAUTH_SCOPES
  || !process.env.VERIFICATION_TOKEN) {
  console.log('Error: Specify all necessary environment variables (7)');
  process.exit(1);
}
const botkitConfig = {
  storage: BotkitStorage({mongoUri: process.env.MONGOLAB_URI}),
};

const controller = BotKit.slackbot(botkitConfig).configureSlackApp({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: process.env.REDIRECT_URI,
  scopes: process.env.OAUTH_SCOPES.split(",")
});

controller.setupWebserver(process.env.PORT, (error, webserver) => {
  if (error) {
    console.error("Unexpected error occured while setting up webserver", error);
    return;
  }
  controller.createWebhookEndpoints(controller.webserver);
  controller.createOauthEndpoints(controller.webserver, (err, req, res) => {
    if (err) {
      res.status(500).send('ERROR: ' + err);
    } else {
      res.send('Success!');
    }
  });
});


SlashBus(controller);