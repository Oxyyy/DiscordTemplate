const client = require("./client");
const db = require("./db");
const fs = require("fs");

const commandFiles = fs.readdirSync("./commands").filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("guildCreate", (g) => {
  db.collection("guilds").doc(g.id).set({
    id: g.id,
    name: g.name,
    owner: g.ownerID,
    prefix: "!",
  });
  console.log(`(Logs) [T-TRIO] Set database entry for "${g.name}"`);
});

client.on("guildDelete", (g) => {
  db.collection("guilds").doc(g.id).delete();
  console.log(`(Logs) [T-TRIO] Deleted database entry for "${g.name}"`);
});

client.on("message", (msg) => {
  if (msg.channel.type === "dm" || msg.author.bot) return;
  console.log(`(${msg.channel.guild.name} / ${msg.channel.name}) [${msg.author.tag}]: ${msg.content}`);

  db.collection("guilds")
    .doc(msg.channel.guild.id)
    .get()
    .then((q) => {
      if (q.exists) {
        prefix = q.data().prefix;
      }
    })
    .then(() => {
      if (!msg.content.startsWith(prefix)) return;

      let msg_array = msg.content.split(" "); // splitting msg's content in an array
      let commandName = msg_array[0].slice(prefix.length); // retrieving the first item (i.e the command that's called) in the array
      let args = msg_array.slice(1); // removing the command from the msg array (1st item) to retrieve all the arguments

      const command = client.commands.get(commandName) || client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName)); // getting the command through name/aliases

      if (command) {
        // if command (file) has a value
        console.log(`(Logs) [T-TRIO] Command execution request detected: "${command.name}"`);
        command.execute(client, msg, args, db); // execute the command
      }
    });
});
