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
			title:"Dungeon Quest",
			color:config.colors.light_pink,
			description:"You do nothing, gaining 0 exp."
			}});
		return;
	}

	const cmd = args[0];

	if (!commands.includes(cmd))
	{
		message.reply({embed:{
			title:"Dungeon Quest",
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
	case "shop":
		OnShop(config, message);
		break;
	case "mine":
		OnMine(config, message);
		break;
	case "chop":
		OnChop(config, message);
		break;
	case "fish":
		OnFish(config, message);
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
			sql.run("INSERT INTO rpg (guild, userid, attack, defense, professions, weapon, gold) VALUES (?, ?, ?, ?, ?, ?, ?)", [message.guild.id, message.author.id, 0, 0, 0, "Dagger", 0]);
			message.reply({embed:{
				title:"Dungeon Quest",
				color:config.colors.light_pink,
				description:
					`Added character for ${message.author.username}.\n`+
					`**Attack**: EXP=0 | LVL=1\n`+
					`**Defense**: EXP=0 | LVL=1\n`+
					`**Professions**: EXP=0 | LVL=1\n`+
					`**Weapon**: Dagger\n`+
					`**Gold**: 0 pieces`
				}});
		}
		else
		{
			message.reply({embed:{
				title:"Dungeon Quest",
				color:config.colors.light_pink,
				description:
					`Found existing character data for ${message.author.username}.\n`+
					`**Attack**: EXP=${row.attack} | LVL=${GetLevel(row.attack)}\n`+
					`**Defense**: EXP=${row.defense} | LVL=${GetLevel(row.defense)}\n`+
					`**Professions**: EXP=${row.professions} | LVL=${GetLevel(row.professions)}\n`+
					`**Weapon**: ${row.weapon}\n`+
					`**Gold**: ${row.gold} pieces`
				}});	
		}
	}).catch(() => {
		console.error;
		sql.run("CREATE TABLE IF NOT EXISTS rpg (guild TEXT, userid TEXT, attack INTEGER, defense INTEGER, professions INTEGER, weapon TEXT, gold INTEGER)")
		.then(() => {
			sql.run("INSERT INTO rpg (guild, userid, attack, defense, professions, weapon, gold) VALUES (?, ?, ?, ?, ?, ?, ?)", [message.guild.id, message.author.id, 0, 0, 0, "Dagger", 0]);
			console.log("Created new RPG database.");
			message.reply({embed:{
				title:"Dungeon Quest",
				color:config.colors.light_pink,
				description:
					`Added character for ${message.author.username}.\n`+
					`**Attack**: EXP=0 | LVL=1\n`+
					`**Defense**: EXP=0 | LVL=1\n`+
					`**Professions**: EXP=0 | LVL=1\n`+
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
		title:"Dungeon Quest",
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
				title:"Dungeon Quest",
				color:config.colors.light_pink,
				description:`No character data found for ${message.author.username}.`
				}});
		}
		else
		{
			message.reply({embed:{
				title:"Dungeon Quest",
				color:config.colors.light_pink,
				description:
					`**Attack**: EXP=${row.attack} | LVL=${GetLevel(row.attack)}\n`+
					`**Defense**: EXP=${row.defense} | LVL=${GetLevel(row.defense)}\n`+
					`**Professions**: EXP=${row.professions} | LVL=${GetLevel(row.professions)}\n`+
					`**Weapon**: ${row.weapon}\n`+
					`**Gold**: ${row.gold} pieces`
				}});
		}
	}).catch(() => {
		console.error;
		message.reply({embed:{
			title:"Dungeon Quest",
			color:config.colors.light_pink,
			description:`No character data found for ${message.author.username}.`
			}});
	});
}

function OnDungeon(config, message)
{
	var floor = 1;
	sql.get(`SELECT * FROM rpg WHERE guild = "${message.guild.id}" AND userid = "${message.author.id}"`)
	.then(row => {
		if(!row)
		{
				message.reply({embed:{
				title:"Dungeon Quest",
				color:config.colors.light_pink,
				description:`No character data found for ${message.author.username}.`
				}});
		}
		else
		{
			var avg_lvl = (GetLevel(row.attack)+GetLevel(row.defense))/2;
			var weapon_mod = 1;
			switch(row.weapon.toLowerCase())
			{
				case "Shortsword": weapon_mod = 2; break;
				case "Battle-Axe": weapon_mod = 3; break;
				case "Katana": weapon_mod = 4; break;
				case "Minotan": weapon_mod = 5; break;
			}
			while(true)
			{
				var floor_chance = Math.pow(0.1 * weapon_mod, floor);
				var combined_chance = floor_chance*avg_lvl;
				if (Math.random() > (1 - combined_chance)) floor++;
				else break;
			}

			if (floor === 1)
			{
				message.reply({embed:{
					title:"Dungeon Quest",
					color:config.colors.light_pink,
					description:
						`You fail to pass the first floor of the dungeon.\n`+
						`You gain 5 attack exp for a total of ${row.attack + 5} exp.\n`+
						`You gain 5 defense exp for a total of ${row.defense + 5} exp.\n`
					}});
				sql.run(`UPDATE rpg SET attack = ${row.attack + 5} WHERE guild = ${message.guild.id} AND userid = ${message.author.id}`);
				sql.run(`UPDATE rpg SET defense = ${row.defense + 5} WHERE guild = ${message.guild.id} AND userid = ${message.author.id}`);
				return;
			}

			var attack_exp = 0;
			var defense_exp = 0;
			var gold = 0;
			for (var i = 1; i < floor; i++)
			{
				attack_exp += Math.floor(90*Math.random()+10)*i;
				defense_exp += Math.floor(90*Math.random()+10)*i;
				if (i > 10 && ((Math.random()*100)+i - 100)) gold += Math.floor(Math.exp(0.1*i)*Math.random());
			}
			sql.run(`UPDATE rpg SET attack = ${row.attack + attack_exp} WHERE guild = ${message.guild.id} AND userid = ${message.author.id}`);
			sql.run(`UPDATE rpg SET defense = ${row.defense + defense_exp} WHERE guild = ${message.guild.id} AND userid = ${message.author.id}`);
			sql.run(`UPDATE rpg SET gold = ${row.gold + gold} WHERE guild = ${message.guild.id} AND userid = ${message.author.id}`);
			message.reply({embed:{
				title:"Dungeon Quest",
				color:config.colors.light_pink,
				description:
					`You venture to floor ${floor} of the dungeon.\n`+
					`You gain ${attack_exp} attack exp for a total of ${row.attack + attack_exp} exp.\n`+
					`You gain ${defense_exp} defense exp for a total of ${row.defense + defense_exp} exp.\n`+
					`You gain ${gold} gold pieces for a total of ${row.gold + gold} pieces.`,
				footer:{text: "Use the stats command to view your updated experience and levels."}
				}});
		}
	}).catch(() => {
		console.error;
		message.reply({embed:{
			title:"Dungeon Quest",
			color:config.colors.light_pink,
			description:`No character data found for ${message.author.username}.`
			}});
	});
}

function OnMine(config, message)
{
	sql.get(`SELECT * FROM rpg WHERE guild = "${message.guild.id}" AND userid = "${message.author.id}"`)
	.then(row => {
		if(!row)
		{
			message.reply({embed:{
				title:"Dungeon Quest",
				color:config.colors.light_pink,
				description:`No character data found for ${message.author.username}.`
				}});
		}
		else
		{
			var items = GetSkillingItems(GetLevel(row.professions));
			if (items === 0)
			{
				message.reply({embed:{
					title:"Dungeon Quest",
					color:config.colors.light_pink,
					description:
						`You fail to gain materials mining.\n`+
						`You gain 5 profession exp for a total of ${row.professions + 5} exp.\n`					
					}});
					sql.run(`UPDATE rpg SET professions = ${row.professions + 5} WHERE guild = ${message.guild.id} AND userid = ${message.author.id}`);
			}

			else
			{
				var gold = items * Math.floor(Math.random()*(5*GetLevel(row.professions)) + 5);
				var exp = items * Math.floor(Math.random()*(5*GetLevel(row.professions)) + 5);
				message.reply({embed:{
					title:"Dungeon Quest",
					color:config.colors.light_pink,
					description:
						`You gain ${items} item(s) mining.\n`+
						`You gain ${exp} profession exp for a total of ${row.professions + exp} exp.\n`+			
						`You sell your items for ${gold} gold pieces for a total of ${row.gold + gold} pieces.\n`					
					}});
				sql.run(`UPDATE rpg SET professions = ${row.professions + exp} WHERE guild = ${message.guild.id} AND userid = ${message.author.id}`);
				sql.run(`UPDATE rpg SET gold = ${row.gold + gold} WHERE guild = ${message.guild.id} AND userid = ${message.author.id}`);
			}
		}
	}).catch(() => {
		console.error;
		message.reply({embed:{
			title:"Dungeon Quest",
			color:config.colors.light_pink,
			description:`No character data found for ${message.author.username}.`
			}});
	});
}

function OnChop(config, message)
{
	sql.get(`SELECT * FROM rpg WHERE guild = "${message.guild.id}" AND userid = "${message.author.id}"`)
	.then(row => {
		if(!row)
		{
			message.reply({embed:{
				title:"Dungeon Quest",
				color:config.colors.light_pink,
				description:`No character data found for ${message.author.username}.`
				}});
		}
		else
		{
			var items = GetSkillingItems(GetLevel(row.professions));
			if (items === 0)
			{
				message.reply({embed:{
					title:"Dungeon Quest",
					color:config.colors.light_pink,
					description:
						`You fail to gain materials chopping wood.\n`+
						`You gain 5 profession exp for a total of ${row.professions + 5} exp.\n`					
					}});
					sql.run(`UPDATE rpg SET professions = ${row.professions + 5} WHERE guild = ${message.guild.id} AND userid = ${message.author.id}`);
			}

			else
			{
				var gold = items * Math.floor(Math.random()*(5*GetLevel(row.professions)) + 1);
				var exp = items * Math.floor(Math.random()*(10*GetLevel(row.professions)) + 10);
				message.reply({embed:{
					title:"Dungeon Quest",
					color:config.colors.light_pink,
					description:
						`You gain ${items} item(s) chopping wood.\n`+
						`You gain ${exp} profession exp for a total of ${row.professions + exp} exp.\n`+			
						`You sell your items for ${gold} gold pieces for a total of ${row.gold + gold} pieces.\n`					
					}});
				sql.run(`UPDATE rpg SET professions = ${row.professions + exp} WHERE guild = ${message.guild.id} AND userid = ${message.author.id}`);
				sql.run(`UPDATE rpg SET gold = ${row.gold + gold} WHERE guild = ${message.guild.id} AND userid = ${message.author.id}`);
			}
		}
	}).catch(() => {
		console.error;
		message.reply({embed:{
			title:"Dungeon Quest",
			color:config.colors.light_pink,
			description:`No character data found for ${message.author.username}.`
			}});
	});
}

function OnFish(config, message)
{
	sql.get(`SELECT * FROM rpg WHERE guild = "${message.guild.id}" AND userid = "${message.author.id}"`)
	.then(row => {
		if(!row)
		{
			message.reply({embed:{
				title:"Dungeon Quest",
				color:config.colors.light_pink,
				description:`No character data found for ${message.author.username}.`
				}});
		}
		else
		{
			var items = GetSkillingItems(GetLevel(row.professions));
			if (items === 0)
			{
				message.reply({embed:{
					title:"Dungeon Quest",
					color:config.colors.light_pink,
					description:
						`You fail to catch any fish.\n`+
						`You gain 5 profession exp for a total of ${row.professions + 5} exp.\n`					
					}});
					sql.run(`UPDATE rpg SET professions = ${row.professions + 5} WHERE guild = ${message.guild.id} AND userid = ${message.author.id}`);
			}

			else
			{
				var gold = items * Math.floor(Math.random()*(5*GetLevel(row.professions)) + 3);
				var exp = items * Math.floor(Math.random()*(10*GetLevel(row.professions)) + 5);
				message.reply({embed:{
					title:"Dungeon Quest",
					color:config.colors.light_pink,
					description:
						`You catch ${items} fish.\n`+
						`You gain ${exp} profession exp for a total of ${row.professions + exp} exp.\n`+			
						`You sell your items for ${gold} gold pieces for a total of ${row.gold + gold} pieces.\n`					
					}});
				sql.run(`UPDATE rpg SET professions = ${row.professions + exp} WHERE guild = ${message.guild.id} AND userid = ${message.author.id}`);
				sql.run(`UPDATE rpg SET gold = ${row.gold + gold} WHERE guild = ${message.guild.id} AND userid = ${message.author.id}`);
			}
		}
	}).catch(() => {
		console.error;
		message.reply({embed:{
			title:"Dungeon Quest",
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

function OnShop(config, message)
{
	
}

function GetLevel(exp)
{
	return Math.floor(0.1 * Math.sqrt(exp)) + 1;
}

function GetSkillingItems(level)
{
	return Math.round(Math.random() * (Math.log2(level)+1));
}