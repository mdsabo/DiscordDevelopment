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

    if (cmd === 'ping')
    {
        message.channel.send("pong!");
    }
    else if (cmd === 'pong')
    {
        message.channel.send("bar!");
    }
    else if (cmd === 'prefix')
    {
    	config.prefix = args[0];
    	fs.writeFile("./config.json", JSON.stringify(config), (err)=>console.error);
    }
    else if (cmd === 'kick')
    {
    	let member = message.mentions.first();
    	let reason = args.slice(1).join(" ");
    	member.kick(reason);
    }
    else if (cmd === 'say')
    {
    	let text = args.slice(1).join(" ");
    	message.delete();
    	message.channel.send(text);
    }
    

    if (message.author.id !== config.ownerID) return;
    //Owner exclusive commands
	if (cmd === 'owner')
    {
        message.channel.send("take me to your leader!");
    }
});

client.login(config.token);
