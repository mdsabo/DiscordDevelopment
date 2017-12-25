const sql = require("sqlite");
sql.open("./data/rpg.db");

const commands = [
	"create",
	"delete",
	"stats",
	"dungeon",
	"shop",
	"boss",
	"mine",
	"chop",
	"fish",
	"eraseall"
]

exports.run = (config, client, message, args) => {

	if(!args || args.length < 1)
	{
		message.reply({embed:{
			title:"Adventure Saga",
			color:config.colors.light_pink,
			description:"You do nothing, gaining 0 exp."
		}});
		return;
	}

	const cmd = args[0];

	if (!commands.includes(cmd))
	{
		message.reply({embed:{
			title:"Adventure Saga",
			color:config.colors.light_pink,
			description:"You try do do something strange, gaining 0 exp."
		}});
	}

	switch(cmd)
	{
	case "create":
		OnCreate(config, message);
		break;
	case "delete":
		OnDelete(config, message);
		break;
	case "stats":
		OnStats(config, message);
		break;	
	case "dungeon":
		OnDungeon(config, message);
		break;
	case "eraseall":
		OnEraseAll(config, message);
		break;
	}

}

function OnCreate(config, message)
{
	sql.get(`SELECT * FROM rpg WHERE guild = "${message.guild.id}" AND userid = "${message.author.id}"`)
	.then(row => {
		if(!row)
		{
			sql.run("INSERT INTO rpg (guild, userid, attack, defense, life, weapon, gold) VALUES (?, ?, ?, ?, ?, ?, ?)", [message.guild.id, message.author.id, 0, 0, 0, "Dagger", 0]);
			message.reply({embed:{
				title:"Adventure Saga",
				color:config.colors.light_pink,
				description:
					`Added character for ${message.author.username}.\n`+
					`**Attack**: EXP=0 | LVL=0\n`+
					`**Defense**: EXP=0 | LVL=0\n`+
					`**Life**: EXP=0 | LVL=0\n`+
					`**Weapon**: Dagger\n`+
					`**Gold**: 0 pieces`
				}});
		}
		else
		{
			message.reply({embed:{
				title:"Adventure Saga",
				color:config.colors.light_pink,
				description:
					`Found existing character data for ${message.author.username}.\n`+
					`**Attack**: EXP=${row.attack} | LVL=${GetLevel(row.attack)}\n`+
					`**Defense**: EXP=${row.defense} | LVL=${GetLevel(row.defense)}\n`+
					`**Life**: EXP=${row.life} | LVL=${GetLevel(row.life)}\n`+
					`**Weapon**: ${row.weapon}\n`+
					`**Gold**: ${row.gold} pieces`
				}});	
		}
	}).catch(() => {
		console.error;
		sql.run("CREATE TABLE IF NOT EXISTS rpg (guild TEXT, userid TEXT, attack INTEGER, defense INTEGER, life INTEGER, weapon TEXT, gold INTEGER)")
		.then(() => {
			sql.run("INSERT INTO rpg (guild, userid, attack, defense, life, weapon, gold) VALUES (?, ?, ?, ?, ?, ?, ?)", [message.guild.id, message.author.id, 0, 0, 0, "Dagger", 0]);
			console.log("Created new RPG database.");
			message.reply({embed:{
				title:"Adventure Saga",
				color:config.colors.light_pink,
				description:
					`Added character for ${message.author.username}.\n`+
					`**Attack**: EXP=0 | LVL=0\n`+
					`**Defense**: EXP=0 | LVL=0\n`+
					`**Life**: EXP=0 | LVL=0\n`+
					`**Weapon**: Dagger\n`+
					`**Gold**: 0 pieces`
				}});
		}).catch(() => {
			console.error;
		});
	});
}

function OnDelete(config, message)
{
	sql.run(`DELETE FROM rpg WHERE guild = "${message.guild.id}" AND userid = "${message.author.id}"`);
	message.reply({embed:{
				title:"Adventure Saga",
				color:config.colors.light_pink,
				description:`Deleted character data for ${message.author.username}.`
				}});
}

function OnStats(config, message)
{
	sql.get(`SELECT * FROM rpg WHERE guild = "${message.guild.id}" AND userid = "${message.author.id}"`)
	.then(row => {
		if(!row)
		{
			message.reply({embed:{
				title:"Adventure Saga",
				color:config.colors.light_pink,
				description:`No character data found for ${message.author.username}.`
				}});
		}
		else
		{
			message.reply({embed:{
				title:"Adventure Saga",
				color:config.colors.light_pink,
				description:
					`**Attack**: EXP=${row.attack} | LVL=${GetLevel(row.attack)}\n`+
					`**Defense**: EXP=${row.defense} | LVL=${GetLevel(row.defense)}\n`+
					`**Life**: EXP=${row.life} | LVL=${GetLevel(row.life)}\n`+
					`**Weapon**: ${row.weapon}\n`+
					`**Gold**: ${row.gold} pieces`
				}});
		}
		
	}).catch(() => {
		console.error;
		message.reply({embed:{
				title:"Adventure Saga",
				color:config.colors.light_pink,
				description:`No character data found for ${message.author.username}.`
			}});
	});
}

function OnDungeon(config, message)
{
	var floor = 0;
	sql.get(`SELECT * FROM rpg WHERE guild = "${message.guild.id}" AND userid = "${message.author.id}"`)
	.then(row => {
		if(!row)
		{
			message.reply({embed:{
				title:"Adventure Saga",
				color:config.colors.light_pink,
				description:`No character data found for ${message.author.username}.`
				}});
		}
		else
		{
			console.log("missing data.");
			var avg_lvl = (GetLevel(row.attack)+GetLevel(row.defense))/2;
			while(true)
			{
				var floor_chance = Math.pow(0.5, floor);
				var combined_chance = floor_chance*avg_lvl;
				if (Math.random() > (1 - combined_chance())) floor++;
				else break;
			}

			var attack_exp = 0;
			var defence_exp = 0;
			var gold = 0;
			for (var i = 1; i <= floor; i++)
			{
				attack_exp += Math.floor(90*Math.random()+10)*i;
				defence_exp += Math.floor(90*Math.random()+10)*i;
				if (i > 10 && ((Math.random()*100)+i - 100)) gold += Math.floor(Math.exp(0.1*i)*Math.random());
			}
			sql.run(`UPDATE rpg SET attack = ${row.attack + attack_exp} WHERE guild = ${message.guild.id} AND userid = ${message.author.id}`);
			sql.run(`UPDATE rpg SET defence = ${row.defence + defence_exp} WHERE guild = ${message.guild.id} AND userid = ${message.author.id}`);
			sql.run(`UPDATE rpg SET gold = ${row.gold + gold} WHERE guild = ${message.guild.id} AND userid = ${message.author.id}`);

			message.reply({embed:{
				title:"Adventure Saga",
				color:config.colors.light_pink,
				description:
					`You venture to floor ${floor} of the dungeon.\n`+
					`You gain ${attack_exp} attack exp for a total of ${row.attack + attack_exp} exp.\n`+
					`You gain ${defence_exp} defence exp for a total of ${row.defence + defence_exp} exp.\n`+
					`You gain ${gold} gold pieces for a total of ${row.gold + gold} pieces.`,
				footer:{
					text: "Use the stats command to view your updated experience and levels."
					}
				}});

		}
		
	}).catch(() => {
		console.error;
		message.reply({embed:{
				title:"Adventure Saga",
				color:config.colors.light_pink,
				description:`No character data found for ${message.author.username}.`
			}});
	});
}

function OnEraseAll(config, message)
{
	if (message.author.id === config.ownerID && message.channel.type === "dm")
	{
		sql.run(`DELETE FROM rpg`);
		message.channel.send("Erased all RPG data.");
	}
}

function GetLevel(exp)
{
	return Math.floor(0.1 * Math.sqrt(exp));
}