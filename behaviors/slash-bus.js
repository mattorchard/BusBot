const oct = require('./../services/octranspo-fetch-service.js');

module.exports = function (controller) {
  console.log("Attaching /bus behaviors");

    controller.on('slash_command', (bot, message) => {
      console.log("Message received!", new Date().getTime());
      switch(message.command) {
        case "/nextbus":
        case "/stopinfo":
          bot.replyPrivate(message, "Grabbing bus info for stop 7659...");
          bot.replyPrivateDelayed(oct.nextBus(7659).catch("Err"), "....?");
          break;
        default:
          bot.replyPrivate(message, `What does: \`${message.text}\` mean?`);
          break;
      }
      console.log("Message sent!", new Date().getTime());

    });

};
