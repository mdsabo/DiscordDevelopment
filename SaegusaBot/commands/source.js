
const text = "You can view my documentation\
and source code on [GitHub](https://github.com/slabo101/DiscordDevelopment/tree/master/SaegusaBot).";

exports.run = (config, client, message, args) => {
	message.channel.send(
		{embed:{
			color: config.colors.white,
			description: text
	}});
}