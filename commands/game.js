const { Message } = require("discord.js");

const prefix = process.env.PREFIX;
var start = false;
const alphabets = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]
let done = []
let letter = '';
let run = false;

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
                letter = Math.floor(Math.random() * alphabets.length);
                return msg.channel.send(`Game Started! Begin the word with letter ${alphabets[letter]}`);
            }
        }
        else if (!start) return msg.channel.send("Ask the admin to start the game");
        else if (x) {
            let fletter;
            if (!run) {
                fletter = alphabets[letter]
                check_letter = args[0].startsWith(fletter);
                run = true;
            } else {
                fletter = args[0].charAt(args[0].length - 1);
                check_letter = args[0].startsWith(fletter);
            }
            check_include = done.includes(args[0]);
            console.log(`Starts With: ${check_letter}`);
            console.log(`Includes: ${check_include}`);
            if (!check_letter) return msg.channel.send(`Invalid word! Write a word starting with ${fletter}`);
            else if (check_include) return msg.channel.send("This word is already used! Try again");
            else {
                done.push(args[0]);
                console.log(done);
                return msg.channel.send(`Good Job! Now write a word starting with letter ${fletter}`);
            }
        }
        else return msg.channel.send("Not Found!")
    }
}