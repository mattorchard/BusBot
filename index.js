const BotKit = require("botkit");
const BotkitStorage = require('botkit-storage-mongo');
const SlashBus = require("./behaviors/slash-bus");
const StaticMaps = require("./endpoints/static-maps");

function startupError(error) {
  console.error(error);
  process.exit(1);
}

const requiredEnvVariables = [
  // For hosting
  "PORT",
  // For Slack
  "CLIENT_ID",
  "CLIENT_SECRET",
  "VERIFICATION_TOKEN",
  "OAUTH_SCOPES",
  "REDIRECT_URI",
  // For MongoLab
  "MONGOLAB_URI",
  //For OCTranspo
  "OCTRANSPO_APP_ID",
  "OCTRANSPO_API_KEY"
];

const missingEnvVariables = requiredEnvVariables.filter(variable => !process.env[variable]);

if (missingEnvVariables.length > 0) {
  startupError(`Error, missing: ${missingEnvVariables} in environment variables`);
}

const botkitConfig = {
  storage: BotkitStorage({mongoUri: process.env.MONGOLAB_URI, tables: ['maps']}),
};
console.log(botkitConfig.storage);
const controller = BotKit.slackbot(botkitConfig).configureSlackApp({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: process.env.REDIRECT_URI,
  scopes: process.env.OAUTH_SCOPES.split(",")
});

controller.setupWebserver(process.env.PORT, setupError => {
  if (setupError) {
    startupError(setupError);
  }
  StaticMaps(controller.webserver, botkitConfig.storage);
  controller.createWebhookEndpoints(controller.webserver);
  controller.createOauthEndpoints(controller.webserver, (oauthError, req, res) => {
    if (oauthError) {
      res.status(500).send(oauthError);
      startupError("unable to serve OAuth Endpoints", oauthError);
    } else {
      res.send('Success!');
    }
  });
});


SlashBus(controller);