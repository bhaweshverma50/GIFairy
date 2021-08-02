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

        function rGen() {
            let rletter = Math.floor(Math.random() * alphabets.length);
            gameRef.update({
                'letter': alphabets[rletter]
            })
            return alphabets[rletter]
        }

        function fGen(arg) {
            let fletter = arg.charAt(arg.length - 1);
            gameRef.update({
                'letter': fletter
            })
            return fletter
        }

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

        const stop = new Discord.MessageEmbed()
            .setColor('#86B543')
            .setDescription('Game Stopped Successfully 👍')

        const reset = new Discord.MessageEmbed()
            .setColor('#86B543')
            .setDescription('Game reset Successfully 👍')

        const invCode = new Discord.MessageEmbed()
            .setColor('#BF2A37')
            .setDescription('Invalid Sceret Code 👎')

        const stopErr = new Discord.MessageEmbed()
            .setColor('#BF2A37')
            .setTitle('No game to stop!')
            .setDescription(`To start the game use \`${pfx}g -start [secret-code]\` followed by secret code!`)

        async function clearPrev() {
            const fetched = await msg.channel.messages.fetch({ limit: 1 });

            msg.channel.bulkDelete(fetched)
                .catch(err => console.log(err))
        }

        if (!args[0]) return await msg.channel.send(invalid);

        arg = args[0].toLowerCase()
        exist = dict[arg];

        if (arg === '-stop') {
            if (gameData.start) {
                if (args[1] === gameData.code) {
                    gameRef.update({
                        'start': false,
                        'done': [],
                        'letter': null,
                        'count': 0
                    }).then(() => {
                        clearPrev()
                        msg.channel.send(stop)
                    })
                } else msg.channel.send(invCode)
            } else {
                clearPrev()
                msg.channel.send(stopErr)
            }
        }

        else if (arg === '-start') {
            if (!gameData.start) {
                if (args[1] === gameData.code) {
                    gameRef.update({
                        'start': true
                    })
                    const gstart = new Discord.MessageEmbed()
                        .setColor('#86B543')
                        .setTitle('Game Started Successfully!')
                        .setDescription(`Begin the word with letter \`${rGen()}\``)
                        .setTimestamp()
                    clearPrev()
                    return await msg.channel.send(gstart);
                } else msg.channel.send(invCode)
            } else {
                clearPrev()
                msg.channel.send(starterr)
            }
        }

        else if (arg === '-reset') {
            if (args[1] === gameData.code) {
                gameRef.update({
                    'start': false,
                    'done': [],
                    'letter': null,
                    'count': 0,
                    'highscore': 0
                }).then(() => {
                    clearPrev()
                    msg.channel.send(reset)
                })
            } else msg.channel.send(invCode)
        }

        else if (!gameData.start) return await msg.channel.send(adminerr);

        else if (exist) {

            check_letter = arg.startsWith(gameData.letter);
            check_include = gameData.done.includes(arg);

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
                var w = arg
                await gameRef.update({
                    done: admin.firestore.FieldValue.arrayUnion(arg),
                    count: admin.firestore.FieldValue.increment(1),
                }).then(async () => {


                    var gameIn = await gameRef.get();
                    var gameD = gameIn.data();

                    if (gameD.count > gameD.highscore) {

                        await gameRef.update({
                            highscore: admin.firestore.FieldValue.increment(1)
                        })
                    }

                    gameIn = await gameRef.get();
                    gameD = gameIn.data();

                    const accWord = await new Discord.MessageEmbed()
                        .setColor('#86B543')
                        .setTitle('Good Job!')
                        .setDescription(`Now write a word starting with letter \`${fGen(w)}\``)
                        .addFields(
                            {
                                name: `\nWord Count :`, value: `${gameD.count}`
                            })
                        .setFooter(`Highscore : ${gameD.highscore}`)
                        .setTimestamp()
                    return await msg.channel.send(accWord);
                })
            }
        }
        else return await msg.channel.send(new Discord.MessageEmbed()
            .setColor('#BF2A37')
            .setTitle('Word not found!')
            .setDescription(`Try again buddy! Write a valid word starting with letter \`${gameData.letter}\``)
            .setTimestamp())
    }
}