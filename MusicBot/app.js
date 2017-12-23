const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const fs = require("fs");

client.on("ready", () => {
    console.log("I am ready.");
});

client.on("message", (message) => {

    if (!message.content.startsWith(config.prefix) || message.author.bot) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    switch(cmd)
    {
    case "ping":
        message.channel.send("pong!");
        break;
    case "help":
        //Show help text
        break;
    }

    if (message.author.id !== config.ownerID) return;
    //Owner exclusive commands

});

client.login(config.token);
