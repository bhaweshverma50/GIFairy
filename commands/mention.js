module.exports = {
  name: "mention",
  desc: "Mention anyone multiple times easily.",
  aliases: ["m"],
  async execute(bot, msg, args, Discord) {
    if (args.length == 0 || msg.mentions.users.size == 0) {
      const error = new Discord.MessageEmbed()
        .setColor("#BF2A37")
        .setTitle("Oops!")
        .setDescription(`\`gfm\` has missing arguments.`);
      msg.channel.send(error);
    } else {
      if (!isNaN(args[0]) && args[0] > 0) {
        let count = args[0];
        let mentions = msg.mentions.users.map((user) => user.toString());
        let mention_count = mentions.length;
        let mention_string = "";
        for (let i = 0; i < mention_count; i++) {
          mention_string += `${mentions[i]} `;
        }
        for (let j = 0; j < count; j++) {
          msg.channel.send(mention_string);
        }
      } else {
        const error = new Discord.MessageEmbed()
          .setColor("#BF2A37")
          .setTitle("Oops!")
          .setDescription(`\`${args[0]}\` is not a valid number.`);
        msg.channel.send(error);
      }
      //   const ping = new Discord.MessageEmbed()
      //     .setColor("#0D9FD9")
      //     .setDescription(
      //       `Mentioned ${msg.mentions.users.size} users ${args[0]} times.`
      //     );
      //   msg.channel.send(ping);
    }
  },
};
