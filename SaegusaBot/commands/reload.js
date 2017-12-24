exports.run = (config, client, message, args) => {
	if (!args || args.length < 1) 
		return message.reply("Must provide a command to name to reload.");

	delete require.cache[require.resolve(`./${args[0]}.js`)];
	message.reply(`The command ${args[0]} has been reloaded.`);
}