module.exports = {
    name: "confession",
    desc: "Just DM the bot your confession followed the prefix and it will post on behalf of you keeping your identity a secret.",
    aliases: ['con', 'cnf', 'cf', 'listen', 'l'],
    async execute(bot, msg, args, Discord) {
        const channel = bot.channels.cache.find(channel => channel.id == '827573135343353867')

        if (msg.channel.type == 'dm') {
            let userContent = args.join(" ")
            // const anonMsg = new Discord.MessageEmbed()
            //     .setColor('#df3576')
            //     .setAuthor("Anonymous User", "https://liquipedia.net/commons/images/thumb/f/f0/Incognito_Logo_V3_Black_Border.png/600px-Incognito_Logo_V3_Black_Border.png")
            //     .setDescription(userContent)
            //     .setTimestamp()
            channel.send(userContent)
        }
    }
}