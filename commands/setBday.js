const admin = require('firebase-admin');

module.exports = {
    name: "setBday",
    desc: "Set custom Prefix of your server",
    aliases: ['sbd'],

    async execute(bot, msg, args, Discord, db, pfx) {
        let tags = 0;

        if (args.length == 0) {
            msg.channel.send("Please enter a date to set.");
        } else if (args.length == 2) {
            let day = args[0]
            let month = args[1]
            // console.log(prefix);

            db.collection(msg.guild.id).doc('birthdays').set({
                'users': admin.firestore.FieldValue.arrayUnion(msg.author.username),
                'days': admin.firestore.FieldValue.arrayUnion(day),
                'months': admin.firestore.FieldValue.arrayUnion(month)
            }).then(() => {
                msg.channel.send(`Data added : ${msg.author.username}'s birthday on ${day}/${month}`)
            })
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