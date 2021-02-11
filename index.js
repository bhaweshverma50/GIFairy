const http = require('http');
require('dotenv').config();
const hostname = '0.0.0.0';
const port = process.env.PORT;
const prefix = process.env.PREFIX;

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('GIFairy is up and running!');
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

console.log("********************")
console.log("Starting...")
console.log("********************\n")

const Discord = require('discord.js');
const bot = new Discord.Client();
const fs = require('fs');
// const { prefix, token } = require('./config.json');

bot.commands = new Discord.Collection();

const files = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of files) {
    const command = require(`./commands/${file}`);

    bot.commands.set(command.name, command)
}

bot.on('ready', () => console.log(`${bot.user.tag} is online!\n`));

bot.on('message', msg => {
    if (!msg.content.startsWith(prefix) || msg.author.bot) return;
    const args = msg.content.slice(prefix.length).split(/ +/);
    const cmdName = args.shift().toLowerCase();
    console.log("CMD Name: " + cmdName);
    console.log("Args: " + args);


    const cmd = bot.commands.get(cmdName)
        || bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(cmdName));

    if (!cmd) {
        console.log("invalid command")
    }

    try {
        console.log(cmd);
        cmd.execute(bot, msg, args, Discord);
    } catch (e) {
        const error = new Discord.MessageEmbed()
            .setColor('#D31C1F')
            .setTitle('Oops!')
            .setDescription(`\`${msg.content}\` is not a valid command`)
        msg.channel.send(error)
    }
})

bot.login(process.env.TOKEN);