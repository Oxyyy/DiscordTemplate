module.exports = {
  name: "ping",
  aliases: ["p"],

  execute(client, msg) {
    msg.channel.send("`Pong!`");
  },
};
