const prefix = process.env.PREFIX;

module.exports = {
    name: "clear",
    desc: "Clear the messages.",
    aliases: ['c', 'cl', 'clr'],
    async execute(bot, msg, args, Discord) {
        function err() {
            const error = new Discord.MessageEmbed()
                .setColor('#BF2A37')
                .setTitle('Invalid Argument!')
                .setDescription(`Please enter number of messages to clear \`[1-99]\``)
                .addFields(
                    {
                        name: `\nUsage :`, value: `\nYou can use \`${prefix}clear [1-99]\``
                    },
                    {
                        name: `\nExample :`, value: `\n\`${prefix}clear 25\`, \`${prefix}c 10\``
                    },
                )
                .setTimestamp()
            return error;
        }
        if (!msg.member.hasPermission('MANAGE_MESSAGES')) return msg.channel.send("You do not have required permissions to use this command!");
        else if (!args.length) {
            msg.channel.send(err());
        } else {
            if (isNaN(args)) {
                msg.channel.send(err());
                // msg.channel.send("Invalid <args>! Only numbers are allowed");
            } else if (args > 99) {
                msg.channel.send(err());
                // msg.channel.send("Can't clear more than 100 messages! Enter a number less than 100");
            } else {
                // msg.channel.messages.fetch({ limit: parseInt(args) + 1 }).then(messages => {
                //     msg.channel.bulkDelete(messages)
                msg.channel.bulkDelete(parseInt(args) + 1)
                    .catch(err => console.log(err))
                const clear = new Discord.MessageEmbed()
                    .setColor('#86B543')
                    .setDescription(`Deleted ${args} messages successfully 👍`)
                msg.channel.send(clear).then(m => m.delete({ timeout: 4000 }));

            }
        }
    }
}
