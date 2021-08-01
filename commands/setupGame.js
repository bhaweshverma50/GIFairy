const { Guild } = require("discord.js")

module.exports = {
    name: "setGame",
    desc: "Create Word Snake game category comprising of two channels which can be used to play the game.",
    aliases: ['sg'],
    async execute(bot, msg, args, Discord, db, pfx) {

        const gameRef = db.collection(msg.guild.id).doc('game');
        const gameInfo = await gameRef.get();
        const gameData = gameInfo.data();


        const success = new Discord.MessageEmbed()
            .setColor('#86B543')
            .setDescription(`Game channel setup completed successfully ✅`)


        function err() {
            const error = new Discord.MessageEmbed()
                .setColor('#BF2A37')
                .setTitle('Not Permitted')
                .setDescription(`Sorry! You need to be either owner of the server or must have one of below mentioned roles`)
                .addFields(
                    {
                        name: `\nRequired Roles :`, value: `\n\`Admin\`, \`Moderator\`, \`Mod\``
                    },
                )
                .setTimestamp()
            return error
        }

        function errCode() {
            const error = new Discord.MessageEmbed()
                .setColor('#BF2A37')
                .setTitle('Invalid Start Code')
                .setDescription(`Sorry! You need to enter a start code which will be used to start/stop the game`)
                .addFields(
                    {
                        name: `\nUsage:`, value: `\`${pfx}sg [start code]\` or \`${pfx}sg xlr8\``
                    },
                )
                .setTimestamp()
            return error
        }


        if (args[0]) {
            gameRef.update({
                'start': false,
                'code': args[0],
                'done': [],
                'letter': null,
                'count': 0,
                'highscore': 0
            }).then(console.log("done"))

            async function createGame() {

                let category = await msg.guild.channels.create('Word Snake', {
                    type: 'category',
                    position: 1,
                }).then(async cat => {
                    game = await msg.guild.channels.create('Play Here', {
                        type: 'text',
                        parent: cat,
                        permissionOverwrites: [{
                            id: msg.guild.roles.cache.find(r => r.name === '@everyone'),
                            allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
                        }]
                    })

                    dict = await msg.guild.channels.create('Dictionary', {
                        type: 'text',
                        parent: cat,
                        permissionOverwrites: [{
                            id: msg.guild.roles.cache.find(r => r.name === '@everyone'),
                            allow: ['VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'SEND_MESSAGES'],
                        },
                        {
                            id: msg.guild.roles.cache.find(r => r.name === 'GIFairy'),
                            allow: ['VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'SEND_MESSAGES'],
                        }]
                    })
                })
                return category
            }

            if (msg.member.hasPermission('ADMINISTRATOR') || msg.guild.ownerID == msg.author.id || msg.member.roles.find(r => r.name.toLowerCase() === "admin") || msg.member.roles.find(r => r.name.toLowerCase() === "administrator") || msg.member.roles.find(r => r.name.toLowerCase() === "moderator") || msg.member.roles.find(r => r.name.toLowerCase() === "mod")) {

                createGame()

                const fetched = await msg.channel.messages.fetch({ limit: 1 });

                msg.channel.bulkDelete(fetched)
                    .catch(err => console.log(err))
                msg.channel.send(success)
                    .then(m => m.delete({ timeout: 5000 }));
            } else {
                msg.channel.send(err())
            }

            // let ms = await msg.channel.send("First Message")

            // let x = await ms.react("👍")
            // let y = await ms.react("👎")

            // const filter = (reaction, user) => {
            //     return ['👍', '👎'].includes(reaction.emoji.name) && user.id === msg.author.id;
            // };

            // ms.awaitReactions(filter, { max: 1, time: 10000, errors: ['time'] })
            //     .then(collected => {
            //         const reaction = collected.first();

            //         if (reaction.emoji.name === '👍') {
            //             msg.reply('you reacted with a thumbs up.');
            //         } else {
            //             msg.reply('you reacted with a thumbs down.');
            //         }
            //     })
            //     .catch(collected => {
            //         msg.reply('you reacted with neither a thumbs up, nor a thumbs down.');
            //     });

            // setTimeout(() => {
            //     ms.edit('Hello');
            // }, 5000)

        } else {
            msg.channel.send(errCode())
        }
    }
}
