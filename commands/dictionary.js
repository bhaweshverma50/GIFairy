const Discord = require("discord.js");

let dict = require('../words.json')


module.exports = {
    name: "dictionary",
    desc: "Get the meaning of the word you are looking for.",
    aliases: ['d', 'dict'],

    async execute(bot, msg, args, Discord) {

        function toTitleCase(str) {
            return str.replace(
                /\w\S*/g,
                function (txt) {
                    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                }
            );
        }

        if (!args[0]) return msg.channel.send(invalid);

        // console.log(`Args: ${args[0].toLowerCase()}`)
        args = args[0].toLowerCase()
        meaning = dict[args];

        if (!args[0]) return msg.channel.send(invalid);

        else if (meaning) {

            const accWord = new Discord.MessageEmbed()
                .setColor('#0D9FD9')
                .setTitle(`Meaning of : ${toTitleCase(args)}`)
                .setDescription(`${meaning.substring(0, 2000)}`)
                .setTimestamp()
            // console.log(`Length of ${args} is ${meaning.length}`)
            return msg.channel.send(accWord);
        }
        else return msg.channel.send(new Discord.MessageEmbed()
            .setColor('#BF2A37')
            .setTitle('Word not found!')
            .setDescription(`Try another word buddy!`)
            .setTimestamp())
    }
}

const invalid = new Discord.MessageEmbed()
    .setColor('#BF2A37')
    .setTitle('Error!')
    .setDescription(`Invalid Argument!`)
    .addFields(
        {
            name: `\nYou may use :`, value: `\`gfhelp\` or \`gfhelp [command name]\` for command related assistance.`
        }
    )
    .setTimestamp()