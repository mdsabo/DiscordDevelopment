exports.run = (config, client, message, args) => {
	if (message.author.id !== config.ownerID)
		return message.reply("Only the bot owner can reload modules.")
	if (!args || args.length < 1) 
		return message.reply("Must provide a command to name to reload.");

	delete require.cache[require.resolve(`./${args[0]}.js`)];
	message.reply(`The ${args[0]} command has been reloaded.`);
}