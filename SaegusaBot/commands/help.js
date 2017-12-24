const Discord = require("discord.js");

const description_text = "SaegusaBot is a multipurpose chat bot and\
 server helper.\nShe is kawaii.";

const command_text = "help - Get this message again.\n8ball\
 - Call upon gfate to answer your questions.\nreload - Refresh\
 a command with the latest version.";

const info_text = "Copywrite 2017.  Matthew Sabo.\nSee the docs\
and source code on [GitHub](https://github.com/slabo101/DiscordDevelopment/SaegusaBot.)";

exports.run = (config, client, message, args) => {

	let helpEmbed =  new Discord.RichEmbed()
		.setColor(config.pink)
		.setURL(config.url)
		.setTitle("SaegusaBot Help and Information")
		.setAuthor("Saegusa Mayumi", client.user.avatarURL)
		.setDescription(description_text)
		.addField("Commands", command_text)
		.addField("Info", info_text)

	message.author.send(helpEmbed);
}