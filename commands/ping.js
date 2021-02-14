module.exports = {
    name: "ping",
    desc: "Ping the bot and check it's latency.",
    aliases: ['p'],
    async execute(bot, msg, args, Discord) {
        const ping = new Discord.MessageEmbed()
            .setColor('#0D9FD9')
            .setDescription(`📈 **Ping:** ${bot.ws.ping}ms`)
        msg.channel.send(ping);
    }
}