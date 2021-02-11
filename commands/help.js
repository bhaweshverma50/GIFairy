const prefix = process.env.PREFIX;

module.exports = {
    name: "help",
    desc: "Shows a list of cmds or info about a specific command.",
    aliases: ['h', 'hlp', 'cmd', 'cmds'],

    async execute(bot, msg, args, Discord) {
        const data = [];
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
                    name: 'Usage', value: `\`${prefix}${cmd.name} <command>\``
                }
            }
            else if (str === 'ping') {
                return {
                    name: 'Usage', value: `\`${prefix}${cmd.name}\``
                }
            }
            else if (str === 'clear') {
                return {
                    name: 'Usage', value: `\`${prefix}${cmd.name} <number (1-100)>\``
                }
            }
        }

        if (!args.length) {
            data.push("Here is a list of my commands.");
            data.push(`${prefix}` + commands.map(c => c.name).join(`\n${prefix}`));
            data.push(`\nYou can use ${prefix}help [command name] to get info about a specific command.`);
            msg.channel.send(data);
            return;
        }

        if (!cmd) {
            msg.channel.send(`${name} is not a valid command.`);

            return;
        }

        const help = new Discord.MessageEmbed()
            .setColor('#FECF56')
            .setTitle(`${toTitleCase(cmd.name)} Command`)
            .setDescription(`${cmd.desc}`)
            .addFields(
                check(cmd.name),
                {
                    name: 'Aliases', value: `\`${cmd.aliases.join(', ')}\``
                },
            )
        msg.channel.send(help);
    }
}

// data.push(`Name: ${cmd.name}`);

// if (cmd.desc) data.push(`Description: ${cmd.desc}`);
// if (cmd.aliases) data.push(`Aliases: ${cmd.aliases.join(', ')}`);

// msg.channel.send(data);