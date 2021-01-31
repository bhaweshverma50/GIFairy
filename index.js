// Seting up custom port for hosting purpose (Solved Heroku Can't connect to port 60, i.e. default port provided by Heroku)
const http = require('http');
require('dotenv').config();
const hostname = '0.0.0.0';
const port = process.env.PORT;

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('GIFairy is up and running!');
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
// ****** Port setup END ******


// Discord Connection Establishment
console.log("Starting...");

const fetch = require('node-fetch');

const Discord = require('discord.js');
const client = new Discord.Client();

client.login(process.env.TOKEN);

client.on('ready', startBot);

function startBot() {
    console.log("Connected Successfully!");
}
// ****** Connection Est. END ******


// Listening for every message on the server and replying with appropriate result (listening to every text channel)
client.on('message', msgRecieved);

async function msgRecieved(msg) {

    console.log(msg.content);

    const reply = [
        "What can I do for you <@" + msg.author.id + ">?",
        "How can I help you <@" + msg.author.id + ">?",
        "<@" + msg.author.id + ">, you summoned me?",
        "I am here <@" + msg.author.id + ">",
        "Mele ko apne bulaya <@" + msg.author.id + ">?",
        "Aapne hume yaad kiya <@" + msg.author.id + ">?",
        "Han boliye <@" + msg.author.id + ">, kya takleef hai aapko?",
        "kya hai <@" + msg.author.id + ">?"
    ]

    let command = msg.content.split(" ");   //splits the text message from the place where there is " ", i.e. space and stores as array

    if (command[0].toLowerCase() === "fairy" || command[0].toLowerCase() === "fy") {
        // msg.reply("I am here!");
        const i = Math.floor(Math.random() * reply.length);
        msg.channel.send(reply[i]);
    } else if (command[0].toLowerCase() === "gifairy" || command[0].toLowerCase() === "gfy" || command[0].toLowerCase() === "gf") {

        let tags = "cute";
        msg.channel.send("Here is your GIF!");

        if (command.length > 1) {
            tags = command.slice(1, command.length).join(" ");
        }

        let url = `https://api.tenor.com/v1/search?q=${tags}&key=${process.env.TENOR}&limit=5`;
        let response = await fetch(url);
        let json = await response.json();
        console.log(json);

        const i = Math.floor(Math.random() * json.results.length);
        msg.channel.send(json.results[i].url);

    } else if (command[0] === "gfav") {
        const user = msg.mentions.users.first() || msg.author;
        console.log(user);
        const avatarEmbed = new Discord.MessageEmbed()
            .setColor("#D31C1F")
            .setAuthor(user.username + "'s Avatar")
            .setTimestamp()
            .setFooter("Requested By: " + user.username, msg.author.displayAvatarURL())
            .setImage(user.displayAvatarURL({ dynamic: true, size: 256 }));
        msg.channel.send(avatarEmbed);
    } else if (command[0].toLowerCase() === "gfcl" || command[0].toLowerCase() === "gfclr") {

        let args = 1;
        // msg.channel.send("clear command activated!");

        if (command.length <= 1 || command.length > 2) {
            msg.channel.send("Invalid <args>! Please enter single integer after the prefix")
        } else {
            args = command.slice(1, command.length).join(" ");
            if (isNaN(args)) {
                msg.channel.send("Invalid <args>! Please enter single integer after the prefix")
            } else if (args > 100) {
                msg.channel.send("Can't clear more than 100 messages! Enter a number <= 100")
            } else {
                await msg.channel.messages.fetch({ limit: args }).then(messages => {
                    msg.channel.bulkDelete(messages)
                });
            }
        }
    }

}
// ****** Listening ENDS ******