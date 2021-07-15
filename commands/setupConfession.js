const { Guild } = require("discord.js")

module.exports = {
    name: "setConfession",
    desc: "Just DM the bot your confession followed the prefix and it will post on behalf of you keeping your identity a secret",
    aliases: ['sc'],
    async execute(bot, msg, args, Discord, db, pfx) {

        let confess;
        let confession;

        const success = new Discord.MessageEmbed()
            .setColor('#86B543')
            .setDescription(`Confession channel setup completed successfully ✅`)

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

        async function createConfess() {
            let category = await msg.guild.channels.create('Confession Box', {
                type: 'category',
                position: 1,

            }).then(async cat => {
                confess = await msg.guild.channels.create('Confess', {
                    type: 'text',
                    parent: cat,
                    permissionOverwrites: [{
                        id: msg.guild.roles.cache.find(r => r.name === '@everyone'),
                        allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
                        deny: ['READ_MESSAGE_HISTORY', 'MANAGE_MESSAGES']
                    }]
                })
                db.collection(msg.guild.id).doc('info').update({
                    'confess': confess.id
                })
                confession = await msg.guild.channels.create('Confessions', {
                    type: 'text',
                    parent: cat,
                    permissionOverwrites: [{
                        id: msg.guild.roles.cache.find(r => r.name === '@everyone'),
                        allow: ['VIEW_CHANNEL', 'READ_MESSAGE_HISTORY'],
                        deny: ['SEND_MESSAGES']
                    },
                    {
                        id: msg.guild.roles.cache.find(r => r.name === 'GIFairy'),
                        allow: ['VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'SEND_MESSAGES'],
                    }]
                })
                db.collection(msg.guild.id).doc('info').update({
                    'confession': confession.id
                })
            })
            return category
        }

        if (msg.member.hasPermission('ADMINISTRATOR') || msg.guild.ownerID == msg.author.id || msg.member.roles.find(r => r.name === "Admin") || msg.member.roles.find(r => r.name === "Moderator") || msg.member.roles.find(r => r.name === "Mod")) {
            createConfess()
            // createConfession()
            const fetched = await msg.channel.messages.fetch({ limit: 1 });
            msg.channel.bulkDelete(fetched)
                .catch(err => console.log(err))
            msg.channel.send(success)
                .then(m => m.delete({ timeout: 5000 }));
        } else {
            msg.channel.send(err())
        }
    }
}