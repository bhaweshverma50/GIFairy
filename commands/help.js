const prefix = process.env.prefix;

module.exports = {
    name: "help",
    desc: "Shows a list of cmds or info about a specific command.",
    aliases: ['h', 'hlp', 'cmd', 'cmds'],
    async execute(bot, msg, args) {
        const data = [];
        const { commands } = msg.client;

        if (!args.length) {
            data.push("Here is a list of my commands.");
            data.push(`${prefix}` + commands.map(c => c.name).join(`\n${prefix}`));
            data.push(`\nYou can use ${prefix}help [command name] to get info about a specific command.`);
            msg.channel.send(data);

            return;
        }

        const name = args[0];
        const cmd = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));
        console.log("Name: " + name);
        console.log("cmd1: " + cmd);


        if (!cmd) {
            msg.channel.send(`${name} is not a valid command.`);

            return;
        }

        data.push(`Name: ${cmd.name}`);

        if (cmd.desc) data.push(`Description: ${cmd.desc}`);
        if (cmd.aliases) data.push(`Aliases: ${cmd.aliases.join(', ')}`);

        msg.channel.send(data);
    },
} // !help test