const prefix = process.env.PREFIX;
const fetch = require('node-fetch');

module.exports = {
    name: "search",
    desc: "Search for a GIF based on provided tag/keyword and send one of them.",
    aliases: ['s', 'srch', 'sch', ''],

    async execute(bot, msg, args, Discord) {
        let tags = 0;
        // msg.channel.send("Here is your GIF!");
        console.log(`Args length: ${args.length}`);

        if (args.length != 0) {
            tags = args.slice(0, args.length).join(" ");
            console.log(tags);
            let url = `https://api.tenor.com/v1/search?q=${tags}&key=${process.env.TENOR}&limit=15`;
            let response = await fetch(url);
            let json = await response.json();
            // console.log(json);

            const i = Math.floor(Math.random() * json.results.length);
            msg.channel.send(json.results[i].url);
        } else if (args.length == 0) {
            const error = new Discord.MessageEmbed()
                .setColor('#BF2A37')
                .setTitle('Error!')
                .setDescription(`\`${msg}\` is not a valid command`)
                .setTimestamp()
            msg.channel.send(error);
        }


    }
}