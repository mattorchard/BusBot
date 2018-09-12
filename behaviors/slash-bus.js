const octranspoService = require('./../services/octranspo-fetch-service.js');
const slackFormatService = require('./../services/slack-format-service');

// Regex for pulling arguments: stopNo, busNo, and directionId
const STOP_INFO_MESSAGE_PATTERN = /^(\d\d\d\d) ?(\d{1,3})? ?(\d)?$/;

async function getStopInfoReply(messageText) {
  const [/*Unused*/, stopId, routeId, directionId] = STOP_INFO_MESSAGE_PATTERN.exec(messageText).map(num => parseInt(num));
  if (!stopId) {
    return "Looks like your message may not be formatted correctly" +
      "The correct format is: `/stopinfo <your four digit stop code> [your bus number] [the bus direction number]`";
  }
  console.log(`Fetching stop data for: stop[${stopId}], route[${routeId}], direction[${directionId}]`);
  const stopInfo = await octranspoService.stopInfo(stopId, routeId, directionId);
  const reply = slackFormatService.formatStopInfo(stopInfo);
  console.log("Reply:", reply);
  return reply;
}


module.exports = function (controller) {
  console.log("Attaching /bus behaviors");

    async function replyAsync(bot,message) {
      console.log("Message received", new Date().getTime(), message.command, message.text);

      switch(message.command.toLowerCase()) {
        case "/stopinfo":
          try {
            bot.replyPrivate(message, await getStopInfoReply(message.text));
          } catch (error) {
            console.error("Failed to respond:", error);
            bot.replyPrivate(message, "Uh oh, something went wrong :face_palm:");
          }
          break;
        default:
          bot.replyPrivate(message, `What does: \`${message.text}\` mean?`);
          break;
      }
      console.log("Message sent!", new Date().getTime());
    }

    controller.on('slash_command', (bot,message) => replyAsync(bot, message));
};
