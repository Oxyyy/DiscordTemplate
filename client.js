const { token } = require("./secrets.json");
const Discord = require("discord.js");
const client = new Discord.Client();
client.commands = new Discord.Collection();

client.login(token);

module.exports = client;
