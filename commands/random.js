const prefix = process.env.PREFIX;
const fetch = require('node-fetch');

module.exports = {
    name: "random",
    desc: "Search for random GIF and sends it.",
    aliases: ['r', 'rnd', 'rd'],

    async execute(bot, msg, args, Discord) {
        let tags = ['random', 'mood', 'weird', 'cute', 'blessed', 'good luck', 'meme', 'memes', 'dance', 'vibe', 'laugh', 'chill', 'high', 'naughty', 'yummy', 'yum', 'wow', 'weed'];

        gif = Math.floor(Math.random() * tags.length);
        console.log(tags[gif]);
        let url = `https://api.tenor.com/v1/random?q=${tags[gif]}&key=${process.env.TENOR}&limit=15&contentfilter=medium`;
        let response = await fetch(url);
        let json = await response.json();

        const i = Math.floor(Math.random() * json.results.length);
        msg.channel.send(tags[gif]);
        msg.channel.send(json.results[i].url);
    }
}