module.exports = {
    name: "avatar",
    desc: "Shows the avatar/profile picture of the user you mention. If you mention no one then it will show your profile picture by default.",
    aliases: ['av', 'pfp', 'dp'],
    async execute(bot, msg, args, Discord) {

        const user = msg.mentions.users.first() || msg.author;
        console.log(user);
        const avatarEmbed = new Discord.MessageEmbed()
            .setColor("#D31C1F")
            .setAuthor(user.username + "'s Avatar")
            .setTimestamp()
            .setFooter("Requested By: " + user.username, msg.author.displayAvatarURL())
            .setImage(user.displayAvatarURL({ dynamic: true, size: 256 }));
        msg.channel.send(avatarEmbed);
    }
}