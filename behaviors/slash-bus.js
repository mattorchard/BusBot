module.exports = function (controller) {
  console.log("Attaching /bus behaviors");

    controller.on('slash_command', (bot, message) => {
      console.log("Message received!", new Date().getTime());
      switch(message.command) {
        case "/bus":
          bot.replyPrivate(message, "What is a bus?");
          bot.replyPrivateDelayed(message, "....?");
          break;
        default:
          bot.replyPrivate(message, `What does: \`${message.text}\` mean?`);
          break;
      }
      console.log("Message sent!", new Date().getTime());

    });

};
