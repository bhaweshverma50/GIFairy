const { Message } = require("discord.js");

const prefix = process.env.PREFIX;
var start = false;
let done = []

let dict = require('../words.json')

module.exports = {
    name: "game",
    desc: "Start the game",
    aliases: ['g', 'gm'],

    async execute(bot, msg, args, Discord) {
        x = dict[args];
        if (!args[0]) return msg.channel.send("Inavlid Argument!");
        else if (args[0].toLowerCase() === 'start') {
            if (start) return msg.channel.send("Game already started!");
            else {
                start = true;
                done = []
                return msg.channel.send("Game Started!");
            }
        }
        else if (!start) return msg.channel.send("Ask the admin to start the game");
        else if (x) {
            check = done.includes(args[0]);
            console.log(check);
            console.log(args[0]);
            if (check) return msg.channel.send("This word is already used! Try again")
            else {
                done.push(args[0]);
                console.log(done);
                return msg.channel.send("Good Job!");
            }
        }
        else return msg.channel.send("Not Found!")
    }
}