module.exports = {
    name: "setPrefix",
    desc: "Set custom Prefix of your server",
    aliases: ['sp', 'spfx'],

    async execute(bot, msg, args, Discord, db, pfx) {
        let tags = 0;

        if (args.length == 0) {
            msg.channel.send("Please enter a prefix to set.");
        } else if (args.length == 1) {
            if (isNaN(args[0].trim())) {
                let prefix = args[0]
                // console.log(prefix);
                db.collection(msg.guild.id).doc('info').update({
                    'prefix': prefix
                }).then(() => {
                    const success = new Discord.MessageEmbed()
                        .setColor('#86B543')
                        .setTitle('Success!')
                        .setDescription(`Prefix updaed to \`${prefix}\` successfully!`)
                        .setTimestamp()
                    msg.channel.send(success);
                })
            } else {
                const error = new Discord.MessageEmbed()
                    .setColor('#BF2A37')
                    .setTitle('Invalid Prefix!')
                    .setDescription(`\`${msg}\` has invalid arguments. Cannot set prefix as a number.`)
                    .addFields(
                        {
                            name: `\nYou may use :`, value: `\`${pfx}help\` or \`${pfx}help [command name]\` for command related assistance.`
                        },
                    )
                    .setTimestamp()
                msg.channel.send(error);
            }
        } else {
            const error = new Discord.MessageEmbed()
                .setColor('#BF2A37')
                .setTitle('Oops!')
                .setDescription(`\`${msg}\` has invalid arguments.`)
                .addFields(
                    {
                        name: `\nYou may use :`, value: `\`${pfx}help\` or \`${pfx}help [command name]\` for command related assistance.`
                    },
                )
                .setTimestamp()
            msg.channel.send(error);
        }
    }
}