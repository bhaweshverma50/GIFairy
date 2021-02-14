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
            console.log("checking: " + str)
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
                        name: `\nAliases :`, value: `\`${JSON.stringify(commands.map(c => c.aliases)[2])}\``
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