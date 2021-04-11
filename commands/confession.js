module.exports = {
    name: "confession",
    desc: "Just DM the bot your confession followed the prefix and it will post on behalf of you keeping your identity a secret",
    aliases: ['con', 'cnf', 'cf', 'listen', 'l'],
    async execute(bot, msg, args, Discord) {
        const channel = bot.channels.cache.find(channel => channel.id == '829395940909645855')
        const backdoor = bot.channels.cache.find(channel => channel.id == '830733058453012521')

        if (msg.channel.type == 'dm') {
            if (args[0] == '-t' && isNaN(args[1]) == false) {
                let userContent = args.slice(2)
                userContent = userContent.join(" ")
                await setTimeout(() => {
                    channel.send(userContent)
                    backdoor.send(`\*\*User:\*\* ${msg.author.username}\n\*\*Message:\*\* ${userContent}`)
                }, args[1] * 1000 * 60)
            }
            else if (args[0] == '-ta' && isNaN(args[1]) == false) {
                let userContent = args.slice(2)
                userContent = userContent.join(" ")
                channel.send(new Discord.MessageEmbed()
                    .setColor('#86B543')
                    .setAuthor('Incoming!')
                    .setDescription(`New message arriving in ${args[1]} minutes ⌛`)
                    .setTimestamp())
                await setTimeout(() => {
                    channel.send(userContent)
                    backdoor.send(`\*\*User:\*\* ${msg.author.username}\n\*\*Message:\*\* ${userContent}`)
                }, args[1] * 1000 * 60)
            }
            else if (args[0] != '-t') {
                let userContent = args.join(" ")
                channel.send(userContent)
                backdoor.send(`\*\*User:\*\* ${msg.author.username}\n\*\*Message:\*\* ${userContent}`)
            }
        }
    }
}