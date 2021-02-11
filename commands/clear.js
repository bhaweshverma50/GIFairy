module.exports = {
    name: "clear",
    desc: "Clear the messages",
    aliases: ['c', 'cl', 'clr'],
    async execute(bot, msg, args, Discord) {
        if (!msg.member.hasPermission('MANAGE_MESSAGES')) return msg.channel.send("You do not have required permissions to use this command!");
        else if (!args.length) {
            msg.channel.send("Missing <args>! Please specify the number of messages to clear (1-100)");
        } else {
            if (isNaN(args)) {
                msg.channel.send("Invalid <args>! Only numbers are allowed");
            } else if (args > 100) {
                msg.channel.send("Can't clear more than 100 messages! Enter a number less than 100");
            } else {
                // msg.channel.messages.fetch({ limit: parseInt(args) + 1 }).then(messages => {
                //     msg.channel.bulkDelete(messages)
                msg.channel.bulkDelete(parseInt(args) + 1)
                    .catch(err => console.log(err))
                const clear = new Discord.MessageEmbed()
                    .setColor('#FE0E2E')
                    .setDescription(`✅ Deleted ${args} messages successfully!`)
                msg.channel.send(clear).then(m => m.delete({ timeout: 3000 }));

            }
        }
    }
}
