const octranspoService = require('./../services/octranspo-fetch-service.js');
const slackFormatService = require('./../services/slack-format-service');

// Regex for pulling arguments: stopNo, busNo, and directionId
const STOP_INFO_MESSAGE_PATTERN = /^(\d\d\d\d)( ?\d{1,3})?( ?\d)?$/;

async function stopInfoReply(bot, message) {
  const arguments = STOP_INFO_MESSAGE_PATTERN.exec(message.text);
  if (!arguments || arguments.length < 2) {
    bot.replyPrivate(bot, "Looks like your message may not be formatted correctly");
    bot.replyPrivate(bot, "The correct format is: `/stopinfo <your four digit stop code> [your bus number] [the bus direction number]`");
    return;
  }
  try {
    const stopInfo = await octranspoService.stopInfo(arguments[1], arguments[2], arguments[3]);
    const reply = slackFormatService.formatStopInfo(stopInfo);
    bot.replyPrivate(bot, reply);
  } catch(error){
    console.error(error);
  }
}


module.exports = function (controller) {
  console.log("Attaching /bus behaviors");

    async function replyAsync(bot,message) {
      console.log("Message received", new Date().getTime(), message.command, message.text);

      switch(message.command.toLowerCase()) {
        case "/stopinfo":
          return stopInfoReply(bot, message);
        default:
          bot.replyPrivate(message, `What does: \`${message.text}\` mean?`);
          break;
      }
      console.log("Message sent!", new Date().getTime());
    }

    controller.on('slash_command', (bot,message) => replyAsync(bot, message));
};
