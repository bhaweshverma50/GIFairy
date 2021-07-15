module.exports = {
    name: "confession",
    desc: "Just DM the bot your confession followed the prefix and it will post on behalf of you keeping your identity a secret",
    aliases: ['con', 'cnf', 'cf', 'listen', 'l'],
    async execute(bot, msg, args, Discord, db, pfx) {
        function err() {
            const error = new Discord.MessageEmbed()
                .setColor('#BF2A37')
                .setTitle('Wrong Channel!')
                .setDescription(`Sorry buddy! Go confess on channel <#${confess.id}>`)
                .addFields(
                    {
                        name: `\nUsage :`, value: `\nYou can use \`${pfx}listen [your message]\``
                    },
                    {
                        name: `\nExample :`, value: `\n\`${pfx}listen I am bored.\`, \`${pfx}cf I am noob.\``
                    },
                )
                .setTimestamp()
            return error
        }

        const errFormat = new Discord.MessageEmbed()
            .setColor('#BF2A37')
            .setAuthor('Wrong Format!')
            .setDescription(`Below are all the formats you can use to send your confession.`)
            .addFields(
                {
                    name: `\nSend | Without Timer :`, value: `\nYou can use \`${pfx}listen [your message]\`, \`${pfx}listen I am noob.\``
                },
                {
                    name: `\nSend | With Timer :`, value: `\n\`${pfx}listen -t [time in minutes] [your message]\`, \`${pfx}listen -t 5 I am noob.\``
                },
                {
                    name: `\nSend and Announce Incoming Time | With Timer :`, value: `\n\`${pfx}listen -ta [time in minutes] [your message]\`, \`${pfx}listen -ta 5 I am noob.\``
                },
            )
            .setTimestamp()

        let channel;
        let confess;

        db.collection(msg.guild.id).doc('info').get().then((q) => {
            if (q.exists) {
                channel = bot.channels.cache.find(channel => channel.id == q.data().confession)
                confess = bot.channels.cache.find(confess => confess.id == q.data().confess)
                // backdoor = q.data().anonymous_logs
            }
        }).then(async () => {
            if (msg.channel.id == confess.id) {
                if (args.length) {
                    if (args[0] == '-t' && isNaN(args[1]) == false) {
                        let userContent = args.slice(2)
                        userContent = userContent.join(" ")
                        await setTimeout(() => {
                            channel.send(userContent)
                            // backdoor.send(`\*\*User:\*\* ${msg.author.username}\n\*\*Message:\*\* ${userContent}`)
                        }, args[1] * 1000 * 60)
                    } else if (args[0] == '-ta' && isNaN(args[1]) == false) {
                        let userContent = args.slice(2)
                        userContent = userContent.join(" ")
                        channel.send(new Discord.MessageEmbed()
                            .setColor('#86B543')
                            .setAuthor('Incoming!')
                            .setDescription(`New message arriving in ${args[1]} minutes ⌛`)
                            .setTimestamp())
                        await setTimeout(() => {
                            channel.send(userContent)
                            // backdoor.send(`\*\*User:\*\* ${msg.author.username}\n\*\*Message:\*\* ${userContent}`)
                        }, args[1] * 1000 * 60)
                    } else if (args[0] != '-t') {
                        let userContent = args.join(" ")
                        channel.send(userContent)
                        // backdoor.send(`\*\*User:\*\* ${msg.author.username}\n\*\*Message:\*\* ${userContent}`)
                    } else {
                        msg.channel.send(errFormat)
                    }
                } else return msg.channel.send(errFormat)
            } else {
                msg.channel.send(err())
            }
        })

    }
}