$bot_name = Read-Host - Prompt 'Enter the new bot name: '
$bot_path = Get-Location
$bot_path = $bot_path.tostring() + "\" + $bot_name
md $bot_path

cd $bot_path

npm init -y
npm i -S discord.js

$app_boiler = "const Discord = require(""discord.js"");
const client = new Discord.Client();
const config = require(""./config.json"")

client.on(""ready"", () => {
    console.log(""I am ready."");
});

client.on(""message"", (message) => {
    if (message.content.startsWith(""ping""))
    {
        message.channel.send(""pong!"");
    }
});

client.login(config.token);"

New-Item -Path . -Name "app.js" -ItemType "file"
Out-File -FilePath "app.js" -InputObject $app_boiler -Encoding ASCII

$cfg_boiler = "{
  ""token"": ""insert-bot-token-here""
}"

New-Item -Path . -Name "config.json" -ItemType "file"
Out-File -FilePath "config.json" -InputObject $cfg_boiler -Encoding ASCII

New-Item -Path . -Name "run.bat" -ItemType "file" -Value "node app.js"
