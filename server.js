require('dotenv').config();
const port = process.env.PORT;

const Discord = require('discord.js');
const client = new Discord.Client();

const fs = require('fs');

const prefix = "gf";

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    client.commands.set(command.name, command);
}

client.login(process.env.TOKEN);

client.on('ready', startBot);

function startBot() {
    console.log("Connected Successfully!");
}

client.on('message', msgRecieved);

async function msgRecieved(msg) {

    if (!msg.content.startsWith(prefix) || msg.author.bot) return;

    const args = msg.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    // console.log(command);
    console.log(args);

}