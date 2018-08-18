const oct = require('./../services/octranspo-fetch-service.js');

module.exports = function (controller) {
  console.log("Attaching /bus behaviors");
    
    async function asyncreply(bot,message){
      console.log("Message received!", new Date().getTime());
      switch(message.command) {
        case "/nextbus":
        case "/stopinfo":
          try{
          console.log("[slash-bus] Replying when asynchronous data is returned.");
          octData = await oct.nextBus(7659);
          bot.replyPrivate(bot,octData);
          } catch(error){
            console.error(error);
          }
          break;
        default:
          bot.replyPrivate(message, `What does: \`${message.text}\` mean?`);
          break;
      }
      console.log("[slash-bus] Message sent!", new Date().getTime());
    }

    controller.on('slash_command', (bot,message) => asyncreply(bot, message));
};
