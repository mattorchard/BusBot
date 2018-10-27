const octranspoService = require('../services/octranspo-service.js');
const slackFormatService = require('./../services/slack-format-service');

module.exports = function (controller, storage) {
  const googleMapsService = require('./../services/google-maps-service')(storage);

  // Regex for pulling arguments: stopNo, busNo, and directionId
  const STOP_INFO_MESSAGE_PATTERN = /^(\d\d\d\d) ?(\d{1,3})? ?(\d)?$/;

  function getIdsFromMessage(messageText) {
    return STOP_INFO_MESSAGE_PATTERN.exec(messageText)
    .map(num => parseInt(num))
    .splice(1);
  }

  async function getStopInfoReply(messageText) {
    const [stopId, routeId, directionId] = getIdsFromMessage(messageText);
    if (!stopId) {
      return "Looks like your message may not be formatted correctly" +
        "The correct format is: `/stopinfo <your four digit stop code> [your bus number] [the bus direction number]`";
    }
    console.log(`Fetching stop data for: stop[${stopId}], route[${routeId}], direction[${directionId}]`);
    const stopInfo = await octranspoService.getStopInfo(stopId, routeId, directionId);
    const reply = slackFormatService.formatStopInfo(stopInfo);
    console.log("Reply:", reply);
    return reply;
  }

  async function getBusMapReply(messageText) {
    const [stopId, routeId, directionId] = getIdsFromMessage(messageText);
    if (!stopId) {
      return "Looks like your message may not be formatted correctly" +
        "The correct format is: `/busmap <your four digit stop code> [your bus number] [the bus direction number]`";
    }
    console.log(`Fetching map for: stop[${stopId}], route[${routeId}], direction[${directionId}]`);
    const publicUrl = await googleMapsService.getMapUrl(stopId, routeId, directionId);
    console.log("Public url:", publicUrl);
    const reply = slackFormatService.formatBusMap(publicUrl);
    console.log("Reply:", reply);
    return reply;
  }

  console.log("Attaching /bus behaviors");

    async function replyAsync(bot,message) {
      console.log("Message received", new Date().getTime(), message.command, message.text);
      try{
        switch(message.command.toLowerCase()) {
          case "/stopinfo":
            bot.replyPrivate(message, "Fetching data for stop...");
            bot.replyPrivateDelayed(message, await getStopInfoReply(message.text));
            break;
          case "/busmap":
            bot.replyPrivate(message, "Fetching map for stop...");
            bot.replyPrivateDelayed(message, await getBusMapReply(message.text));
            break;
          default:
            bot.replyPrivate(message, `What does: \`${message.text}\` mean?`);
            break;
        }
        console.log("Message sent!", new Date().getTime());
      } catch (error) {
        console.error("Failed to respond:", error);
        bot.replyPrivateDelayed(message, "Uh oh, something went wrong :face_palm:");
      }
    }

    controller.on('slash_command', (bot,message) => replyAsync(bot, message));
};
