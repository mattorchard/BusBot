const oct = require('./../services/octranspo-fetch-service.js');

module.exports = function (controller) {
  console.log("Attaching /bus behaviors");

    controller.on('slash_command', (bot, message) => {
      console.log("Message received!", new Date().getTime());
      switch(message.command) {
        case "/nextbus":
        case "/stopinfo":
          console.log("Message recieved, '"+message+"', replying.");
          bot.replyPrivate(message, "Grabbing bus info for stop 7659...");
          asyncreply(bot,message);
          break;
        default:
          bot.replyPrivate(message, `What does: \`${message.text}\` mean?`);
          break;
      }
      console.log("Message sent!", new Date().getTime());

    });

};

async function asyncreply(bot,message){
          bot.replyPrivate(message, "Replying when asynchronous data is returned.");
          octData = await oct.nextBus(7659);
          bot.replyPrivate(bot,octData);
}
