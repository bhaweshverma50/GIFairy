const prefix = process.env.PREFIX;

module.exports = {
    name: "help",
    desc: "Shows a list of cmds or info about a specific command.",
    aliases: ['h', 'hlp', 'cmd', 'cmds'],

    async execute(bot, msg, args, Discord) {
        const name = args[0];
        const { commands } = msg.client;
        const cmd = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        function toTitleCase(str) {
            return str.replace(
                /\w\S*/g,
                function (txt) {
                    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                }
            );
        }

        function check(str) {
            if (str === 'help') {
                return {
                    name: 'Usage', value: `\`${prefix}${cmd.name} [command name]\``
                }
            }
            else if (str === 'ping' || str === 'random') {
                return {
                    name: 'Usage', value: `\`${prefix}${cmd.name}\``
                }
            }
            else if (str === 'clear') {
                return {
                    name: 'Usage', value: `\`${prefix}${cmd.name} [1-100]\``
                }
            }
            else if (str === 'search') {
                return {
                    name: 'Usage', value: `\`${prefix}${cmd.name} [tag/keyword]\` or \`${prefix} [tag/keyword]\``
                }
            }
            else if (str === 'avatar') {
                return {
                    name: 'Usage', value: `\`${prefix}${cmd.name} [@username]\` or \`${prefix}av\` or \`${prefix}dp\``
                }
            }
            else if (str === 'game') {
                return {
                    name: 'Usage', value: `\`${prefix}${cmd.name} [start code]\` or \`${prefix}g [word]\` or \`${prefix}gm [word]\``
                }
            }
            else if (str === 'confession') {
                return {
                    name: 'Usage', value: `\`${prefix}listen [your confession]\` or \`${prefix}l [message]\` or \`${prefix}cf [message]\`\n
                    \*\*For Scheduled Confession:\*\*\nUse flag \`-t\` for unannounced scheduled confession followed by \`time [in minutes]\` \*\*For Example:\*\* \`gfl -t 5 [write your message]\`\n
                    Use flag \`-ta\` for announced scheduled confession followed by \`time [in minutes]\`. This will notify in the specific channel that an incoming message is on it's way (it will not reveal the sender). \n\*\*For Example:\*\* \`gfl -ta 5 [write your message]\`
                    `
                }
            }
            else if (str === 'dictionary') {
                return {
                    name: 'Usage', value: `\`${prefix}dict [word]\` or \`${prefix}d [word]\``
                }
            }
        }

        function cmnd() {
            return `- ` + commands.map(c => c.name).join(`\n- `);
        }

        if (!args.length) {
            const help = new Discord.MessageEmbed()
                .setColor('#8890BF')
                .setAuthor('Help Centre', 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Info_icon_002.svg/1200px-Info_icon_002.svg.png')
                .setDescription(`This is a multi purpose GIF bot which can send unlimited funny memes on demand. You can send random memes or based on search tags.`)
                .addFields(
                    {
                        name: `\nPrefix :`, value: `Prefix to use this bot is : \`${prefix}[command name]\` **Eg :** \`${prefix}ping\`, \`${prefix}clear [1-100]\``
                    },
                    {
                        name: `\nList of Command Names :`, value: `\n\`${cmnd()}\``
                    },
                    {
                        name: `\nUsage :`, value: `\nYou can use \`${prefix}help [command name]\` or \`${prefix}[alias] [command name]\` to get info about a specific command.`
                    },
                    {
                        name: `\nAliases :`, value: `\`${JSON.stringify(commands.map(c => c.aliases)[6])}\``
                    }
                )
                .setTimestamp()
            msg.channel.send(help);
            return;
        }

        if (!cmd) {
            const error = new Discord.MessageEmbed()
                .setColor('#BF2A37')
                .setTitle('Error!')
                .setDescription(`\`${name}\` is not a valid command`)
                .addFields(
                    {
                        name: `\nYou may use :`, value: `\`gfhelp\` or \`gfhelp [command name]\` for command related assistance.`
                    }
                )
                .setTimestamp()
            msg.channel.send(error);

            return;
        }

        const help = new Discord.MessageEmbed()
            .setColor('#636DA6')
            .setTitle(`${toTitleCase(cmd.name)} Command`)
            .setDescription(`${cmd.desc}`)
            .addFields(
                check(cmd.name),
                {
                    name: 'Aliases', value: `\`${cmd.aliases.join(', ')}\``
                },
            )
            .setTimestamp()
            .setFooter('From Help Centre')
        msg.channel.send(help);
    }
}