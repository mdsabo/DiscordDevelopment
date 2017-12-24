const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const fs = require("fs");

client.on("ready", () => {
    console.log("SaegusaBot is now online.");
});

/*fs.readdir("./events/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        let eventFunction = require(`./events/${file}`);
        let eventName = file.split(".")[0];
        client.on(eventName, (...args)=>eventFunction.run(client, ...args));
    })
});*/

const commands = [
    "eightball",
    "score",
    "reload",
    "source",
    "help"
];

client.on("message", (message) => {

    if (!message.content.startsWith(config.prefix) || message.author.bot) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    let cmd = args.shift().toLowerCase();

    if (cmd === "8ball") cmd = "eightball";

    if (!commands.includes(cmd)) 
    {
        message.reply(`${cmd} is not a command.`);
        return;
    }

    try 
    {
        let cmdFile = require(`./commands/${cmd}.js`);
        cmdFile.run(config, client, message, args);
    } 
    catch (err)
    {
        console.error(err);
    }

});

client.on("guildMemberAdd", (member) => {
    const channel = member.guild.channels.find('name', 'general');
    const role = member.guild.roles.find('name', config.join_notify);
    if (!channel) return;
    else if (role) channel.send(role +" welcome <@"+member.id+"> to the server!");
    else channel.send("Welcome <@"+member.id+"> to the server!");
});

client.login(config.token);
