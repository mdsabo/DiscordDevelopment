$bot_name = Read-Host - Prompt 'Enter the new bot name: '
$bot_path = Get-Location
$bot_path = $bot_path.tostring() + "\" + $bot_name
md $bot_path

cd $bot_path

npm init -y
npm i -S discord.js

$app_boiler = "const Discord = require(""discord.js"");
const client = new Discord.Client();
const config = require(""./config.json"");
const fs = require(""fs"");

client.on(""ready"", () => {
    console.log(""I am ready."");
});

client.on(""message"", (message) => {

    if (!message.content.startsWith(config.prefix) || message.author.bot) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    switch(cmd)
    {
    case ""ping"":
        message.channel.send(""pong!"");
        break;
    case ""help"":
        //Show help text
        break;
    }

    if (message.author.id !== config.ownerID) return;
    //Owner exclusive commands

});

client.login(config.token);"

New-Item -Path . -Name "app.js" -ItemType "file"
Out-File -FilePath "app.js" -InputObject $app_boiler -Encoding ASCII

$cfg_boiler = "{
  ""token"": ""insert-bot-token-here"",
  ""prefix"": ""insert-prefix"",
  ""ownerID"": ""insert-username""
}"

New-Item -Path . -Name "config.json" -ItemType "file"
Out-File -FilePath "config.json" -InputObject $cfg_boiler -Encoding ASCII

New-Item -Path . -Name "run.bat" -ItemType "file" -Value "node app.js"
