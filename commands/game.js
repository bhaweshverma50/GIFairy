const Discord = require("discord.js");

var start = false;
const alphabets = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]
let done = []
let letter = '';
let count = 0;

function rGen() {
    let rletter = Math.floor(Math.random() * alphabets.length);
    letter = alphabets[rletter];
    // console.log("rgen")
    return letter;
}

function fGen(args) {
    let fletter = args.charAt(args.length - 1);
    letter = fletter;
    // console.log("fgen")
    return letter;
}

let dict = require('../words.json')


module.exports = {
    name: "game",
    desc: "Type in words begining with given letter and the next person will write a word beginning with the letter your word ends with. Sounds confusing, right? Don't worry, it's simple once you get into it.",
    aliases: ['g', 'gm'],

    async execute(bot, msg, args, Discord) {

        if (!args[0]) return msg.channel.send(invalid);

        console.log(`Args: ${args[0].toLowerCase()}`)
        args = args[0].toLowerCase()
        exist = dict[args];

        if (!args[0]) return msg.channel.send(invalid);

        else if (args === 'xlr8') {
            if (start) return msg.channel.send(starterr);
            else {
                start = true;
                done = []
                count = 0
                const gstart = new Discord.MessageEmbed()
                    .setColor('#86B543')
                    .setTitle('Game Started Successfully!')
                    .setDescription(`Begin the word with letter \`${rGen()}\``)
                    .setTimestamp()

                return msg.channel.send(gstart);
            }
        }

        else if (!start) return msg.channel.send(adminerr);

        else if (exist) {

            check_letter = args.startsWith(letter);
            check_include = done.includes(args);

            const naWord = new Discord.MessageEmbed()
                .setColor('#BF2A37')
                .setTitle('Invalid Word!')
                .setDescription(`Write a word starting with letter \`${letter}\``)
                .setTimestamp()

            const avWord = new Discord.MessageEmbed()
                .setColor('#BF2A37')
                .setTitle('This word is already used!')
                .setDescription(`Try another word starting with letter \`${letter}\``)
                .setTimestamp()

            if (!check_letter) return msg.channel.send(naWord);
            else if (check_include) return msg.channel.send(avWord);
            else {
                done.push(args);
                count += 1
                const accWord = new Discord.MessageEmbed()
                    .setColor('#86B543')
                    .setTitle('Good Job!')
                    .setDescription(`Now write a word starting with letter \`${fGen(args)}\``)
                    .setFooter(`Word count : ${count}`)
                    .setTimestamp()
                return msg.channel.send(accWord);
            }
        }
        else return msg.channel.send(new Discord.MessageEmbed()
            .setColor('#BF2A37')
            .setTitle('Word not found!')
            .setDescription(`Try again buddy! Write a valid word starting with letter \`${letter}\``)
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

const starterr = new Discord.MessageEmbed()
    .setColor('#BF2A37')
    .setTitle('Error!')
    .setDescription(`Game has already been started and is currently running.\n You can stop the current game session using \`stop\` command and restart the game.`)
    .addFields(
        {
            name: `\nYou may use :`, value: `\`gfhelp\` or \`gfhelp [command name]\` for command related assistance.`
        }
    )
    .setTimestamp()

const adminerr = new Discord.MessageEmbed()
    .setColor('#BF2A37')
    .setTitle('Error!')
    .setDescription(`Game has not been started yet!\n Ask the \*\*Admin\*\* to start the game first.`)
    .addFields(
        {
            name: `\nYou may use :`, value: `\`gfhelp\` or \`gfhelp [command name]\` for command related assistance.`
        }
    )
    .setTimestamp()