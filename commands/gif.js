// const prefix = process.env.PREFIX;
const fetch = require('node-fetch');

module.exports = {
    name: "search",
    desc: "Search for a GIF based on provided tag/keyword and send one of them.",
    aliases: ['s', 'srch', 'sch', ''],

    async execute(bot, msg, args, Discord, db, pfx) {
        let tags = 0;

        if (args.length != 0) {
            tags = args.slice(0, args.length).join(" ");
            let url = `https://api.tenor.com/v1/search?q=${tags}&key=${process.env.TENOR}&limit=15&contentfilter=high`;
            let response = await fetch(url);
            let json = await response.json();

            const i = Math.floor(Math.random() * json.results.length);
            msg.channel.send(json.results[i].url);
        } else if (args.length == 0) {
            const error = new Discord.MessageEmbed()
                .setColor('#BF2A37')
                .setTitle('Oops!')
                .setDescription(`\`${msg}\` has missing arguments.`)
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