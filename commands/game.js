const Discord = require("discord.js");
const admin = require('firebase-admin')

const alphabets = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]


let dict = require('../words.json')


module.exports = {
    name: "game",
    desc: "Type in words begining with given letter and the next person will write a word beginning with the letter your word ends with. Sounds confusing, right? Don't worry, it's simple once you get into it.",
    aliases: ['g', 'gm'],

    async execute(bot, msg, args, Discord, db, pfx) {

        const gameRef = db.collection(msg.guild.id).doc('game');
        const gameInfo = await gameRef.get();
        const gameData = gameInfo.data();
        // console.log(args[0] === 'rs');
        function rGen() {
            let rletter = Math.floor(Math.random() * alphabets.length);
            // letter = alphabets[rletter];
            gameRef.update({
                'letter': alphabets[rletter]
            })
            // console.log("rgen")
            return alphabets[rletter]
        }

        function fGen(args) {
            let fletter = args.charAt(args.length - 1);
            // letter = fletter;
            gameRef.update({
                'letter': fletter
            })
            // console.log("fgen")
            return fletter
        }
        // var start = gameData.start
        // let done = gameData.done
        // let letter = gameData.letter
        // let count = gameData.count

        const invalid = new Discord.MessageEmbed()
            .setColor('#BF2A37')
            .setTitle('Error!')
            .setDescription(`Invalid Argument!`)
            .addFields(
                {
                    name: `\nYou may use :`, value: `\`${pfx}help\` or \`${pfx}help [command name]\` for command related assistance.`
                }
            )
            .setTimestamp()

        const starterr = new Discord.MessageEmbed()
            .setColor('#BF2A37')
            .setTitle('Error!')
            .setDescription(`Game has already been started and is currently running.\n You can stop the current game session using \`stop\` command and restart the game.`)
            .addFields(
                {
                    name: `\nYou may use :`, value: `\`${pfx}help\` or \`${pfx}help [command name]\` for command related assistance.`
                }
            )
            .setTimestamp()

        const adminerr = new Discord.MessageEmbed()
            .setColor('#BF2A37')
            .setTitle('Error!')
            .setDescription(`Game has not been started yet!\n Ask the \*\*Admin\*\* to start the game first.`)
            .addFields(
                {
                    name: `\nYou may use :`, value: `\`${pfx}help\` or \`${pfx}help [command name]\` for command related assistance.`
                }
            )
            .setTimestamp()

        if (!args[0]) return await msg.channel.send(invalid);

        // console.log(`Args: ${args[0].toLowerCase()}`)
        args = args[0].toLowerCase()
        exist = dict[args];

        if (!args[0]) return msg.channel.send(invalid)

        if (args[0] === 'sd') {
            if (args[1] === gameData.code) {
                gameRef.update({
                    'start': false
                }).then(msg.channel.send("Shutdown!"))
            } else msg.channel.send('Cannot stop the game without secret code!')
        }

        if (args[0] === 'rs') {
            console.log("in");
            if (args[1] === gameData.code) {
                gameRef.update({
                    'start': false,
                    'code': args[0],
                    'done': [],
                    'letter': null,
                    'count': 0,
                    'highscore': 0
                }).then(msg.channel.send("Reset!"))
            } else msg.channel.send('Cannot reset the game without secret code!')
        }

        if (args[0] === gameData.code) {
            if (gameData.start) return msg.channel.send(starterr);
            else {
                gameRef.update({
                    'start': true
                })
                // start = true
                gameRef.update({
                    'done': []
                })
                // done = []
                gameRef.update({
                    'count': 0
                })
                // count = 0
                const gstart = new Discord.MessageEmbed()
                    .setColor('#86B543')
                    .setTitle('Game Started Successfully!')
                    .setDescription(`Begin the word with letter \`${rGen()}\``)
                    .setTimestamp()

                return await msg.channel.send(gstart);
            }
        }

        else if (!gameData.start) return await msg.channel.send(adminerr);

        else if (exist) {

            check_letter = args.startsWith(gameData.letter);
            check_include = gameData.done.includes(args);

            const naWord = new Discord.MessageEmbed()
                .setColor('#BF2A37')
                .setTitle('Invalid Word!')
                .setDescription(`Write a word starting with letter \`${gameData.letter}\``)
                .setTimestamp()

            const avWord = new Discord.MessageEmbed()
                .setColor('#BF2A37')
                .setTitle('This word is already used!')
                .setDescription(`Try another word starting with letter \`${gameData.letter}\``)
                .setTimestamp()

            if (!check_letter) return await msg.channel.send(naWord);
            else if (check_include) return await msg.channel.send(avWord);
            else {
                gameRef.update({
                    done: admin.firestore.FieldValue.arrayUnion(args),
                    count: admin.firestore.FieldValue.increment(1)
                })
                // done.push(args);
                // count += 1
                const accWord = new Discord.MessageEmbed()
                    .setColor('#86B543')
                    .setTitle('Good Job!')
                    .setDescription(`Now write a word starting with letter \`${fGen(args)}\``)
                    .addFields(
                        {
                            name: `\nWord Count :`, value: `${gameData.count}`
                        })
                    .setFooter(`Highscore : ${gameData.highscore}`)
                    .setTimestamp()
                return await msg.channel.send(accWord);
            }
        }
        else return await msg.channel.send(new Discord.MessageEmbed()
            .setColor('#BF2A37')
            .setTitle('Word not found!')
            .setDescription(`Try again buddy! Write a valid word starting with letter \`${gameData.letter}\``)
            .setTimestamp())
    }
}