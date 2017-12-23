const Discord = require("discord.js");
const client = new Discord.Client();

client.on("ready", () => {
	console.log("I am ready.");
});

client.on("message", (message) => {
	if (message.content.startsWith("ping"))
	{
		message.channel.send("pong!");
	}
});

client.login("MzkzODk3OTg2ODk3MjE1NDk4.DR9elQ.kXpp3kAC9d9UrWgfucw7XirN0Ko");