const eightball = require("./eightball_reply.json");
let eightball_questions = [];

exports.run = (config, client, message, args) => {
    let reply = GetEightballReply(message, args);
    if (eightball_questions &&
        eightball_questions.length > 0 &&
        eightball_questions[message.channel.id] &&
        eightball_questions[message.channel.id].length > 5)
    {
        eightball_questions[message.channel.id]
        .splice(0, eightball_questions[message.channel.id].length-5);
    }
    message.channel.send({embed :{
        color: config.colors.blue,
        author: {
            name: message.author.username,
            icon_url:message.author.avatarURL
        },
        title: "Magic 8 Ball",
        description: reply
    }}).catch(console.error);
};

function GetEightballReply(message, args)
{
    let index = Math.floor(Math.random() * 5);

    if (typeof args === "undefined" ||
        args === null ||
        args.length === null ||
        args.length === 0)
    {
        return eightball.empty[index];
    }

    let question = args.join(' ');

    if (!eightball_questions.includes(message.channel.id))
    {
        eightball_questions.push(message.channel.id);
        eightball_questions[message.channel.id] = [];
    }
    for (var i = eightball_questions[message.channel.id].length - 1;
        i >= 0;
        i--)
    {
        if (eightball_questions[message.channel.id][i].question === question)
        {
            var reply = eightball_questions[message.channel.id][i].reply;
            eightball_questions[message.channel.id].push({
                "question":question,
                "reply": reply
            });
            eightball_questions[message.channel.id].splice(i, 1);
            return reply;
        }
    }

    var reply = "";

    switch(args[0].toLowerCase())
    {
    case "who":
        reply = eightball.who[index];
    case "what":
        reply = eightball.what[index];
    case "when":
        reply = eightball.when[index];
    case "where":
        reply = eightball.where[index];
    case "why":
        reply = eightball.why[index];
    case "should":
        reply = eightball.why[index];
    case "take":
        if (args.join(" ").toLowerCase() === "take off your coat.")
        {
            reply = eightball.mans;
            break;
        }
    default:
        reply = eightball.default[index];
    }
    eightball_questions[message.channel.id].push({
        "question":question,
        "reply": reply
    });
    return reply;
}