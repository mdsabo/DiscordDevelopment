const sql = require("sqlite");
sql.open("./data/score.db");

exports.run = (config, client, message, args) => {
	sql.get(`SELECT * FROM scores WHERE userid = "${message.author.id}"`)
	.then(row => {
		if(!row)
		{
			sql.run("INSERT INTO scores (userid, points, level) VALUES (?, ?, ?)", [message.author.id, 1, 0]);
			message.reply(` currently has 1 point.`);
		}
		else
		{
			message.reply(` currently has ${row.points +1} points.`);
			let curLvl = Math.floor(Math.sqrt(row.points+1));
			if(curLvl > row.level)
			{
				sql.run(`UPDATE scores SET level = ${curLvl} WHERE userid = ${message.author.id}`);
				message.reply(` leveled up to level ${curLvl}!`);
			}
			sql.run(`UPDATE scores SET points = ${row.points + 1} WHERE userid = ${message.author.id}`);
		}
	}).catch(() => {
		console.error;
		sql.run("CREATE TABLE IF NOT EXISTS scores (userid TEXT, points INTEGER, level INTEGER)")
		.then(() => {
			sql.run("INSERT INTO scores (userid, points, level) VALUES (?, ?, ?)", [message.author.id, 1, 0]);
			console.log("Created new score database.");
		}).catch(() => {
			console.error;
		});
	});
}