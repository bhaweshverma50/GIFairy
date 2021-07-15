const http = require('http');
require('dotenv').config();
const hostname = '0.0.0.0';
const port = process.env.PORT;
let prefix;

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

const firebase = require('firebase/app')
const FieldValue = require('firebase-admin').firestore.FieldValue
const admin = require('firebase-admin')
const serviceAccount = require('./service.json')

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})

let db = admin.firestore()

bot.on('guildCreate', async guild_data => {
    let fetchOwner = await guild_data.members.fetch(guild_data.ownerID)
    // console.log(guild_data)
    db.collection(guild_data.id).doc('info').set({
        'guild_id': guild_data.id,
        'guild_name': guild_data.name,
        'guild_owner_ID': guild_data.ownerID,
        'guild_owner': fetchOwner.user.username,
        'guild_member_count': guild_data.memberCount,
        'confession': null,
        'confess': null,
        // 'anonymous_logs': null,
        'prefix': 'gf'
    })

    db.collection(guild_data.id).doc('birthdays').set({
        'users': [],
        'days': [],
        'months': []
    })

    db.collection(guild_data.id).doc('game').set({
        'start': false,
        'code': null,
        'done': [],
        'letter': null,
        'count': 0,
        'highscore': 0
    })
    // console.log(guild_data.member())
})

bot.on('ready', () => console.log(`${bot.user.tag} is online!\n`));

bot.on('message', msg => {
    // console.log(msg.channel.type);
    if (msg.channel.type == 'dm') {
        prefix = 'gf'
        if (!msg.content.toLowerCase().startsWith(prefix) || msg.author.bot) return;
        const args = msg.content.slice(prefix.length).split(/ +/);
        const cmdName = args.shift().toLowerCase();

        const cmd = bot.commands.get(cmdName)
            || bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(cmdName));

        if (!cmd) {
            console.log("invalid command")
        }

        try {
            // console.log(cmd);
            cmd.execute(bot, msg, args, Discord, db, prefix);
            // msg.author.send('Hi!')
        } catch (e) {
            const error = new Discord.MessageEmbed()
                .setColor('#D31C1F')
                .setTitle('Error!')
                .setDescription(`\`${msg.content}\` is not a valid command`)
                .addFields(
                    {
                        name: `\nYou may use :`, value: `\`gfhelp\` or \`gfhelp [command name]\` for command related assistance.`
                    }
                )
            msg.author.send(error)
            console.log(msg.author)
        }
    } else {

        db.collection(msg.guild.id).doc('info').get().then((q) => {
            // console.log(q.data());
            if (q.exists) {
                prefix = q.data().prefix
            }
        }).then(() => {
            // console.log(msg.guild)
            if (!msg.content.toLowerCase().startsWith(prefix) || msg.author.bot) return;
            const args = msg.content.slice(prefix.length).split(/ +/);
            const cmdName = args.shift().toLowerCase();
            // console.log("CMD Name: " + cmdName);
            // console.log("Args: " + args);


            const cmd = bot.commands.get(cmdName)
                || bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(cmdName));

            if (!cmd) {
                console.log("invalid command")
            }

            try {
                // console.log(cmd);
                cmd.execute(bot, msg, args, Discord, db, prefix);
            } catch (e) {
                const error = new Discord.MessageEmbed()
                    .setColor('#D31C1F')
                    .setTitle('Error!')
                    .setDescription(`\`${msg.content}\` is not a valid command`)
                    .addFields(
                        {
                            name: `\nYou may use :`, value: `\`gfhelp\` or \`gfhelp [command name]\` for command related assistance.`
                        }
                    )
                msg.channel.send(error)
            }
        })
    }

})

bot.login(process.env.TOKEN);