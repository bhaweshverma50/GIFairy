const { Message } = require("discord.js");

const prefix = process.env.PREFIX;

let dict = require('../words.json')

module.exports = {
    name: "game",
    desc: "Start the game",
    aliases: ['g', 'gm'],

    async execute(bot, msg, args, Discord) {
        x = dict[args];
        if (x) return msg.channel.send("Found!");
        else return msg.channel.send("Not Found!");
    }

}