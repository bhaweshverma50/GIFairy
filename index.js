console.log("Starting...");

require('dotenv').config();
const fetch = require('node-fetch');

const http = require('http');

const hostname = '0.0.0.0';
const port = process.env.PORT;

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World');
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

const Discord = require('discord.js');
const client = new Discord.Client();

client.login(process.env.TOKEN);

client.on('ready', startBot);
client.on('message', msgRecieved);


function startBot() {
    console.log("Connected Successfully!");
}

async function msgRecieved(msg) {

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

    console.log(msg.content);

    let tokens = msg.content.split(" ");

    if (tokens[0].toLowerCase() === "fairy" || tokens[0].toLowerCase() === "fy") {
        // msg.reply("I am here!");
        const i = Math.floor(Math.random() * reply.length);
        msg.channel.send(reply[i]);
    } else if (tokens[0].toLowerCase() === "gifairy" || tokens[0].toLowerCase() === "gfy" || tokens[0].toLowerCase() === "gf") {

        let tags = "cute";
        msg.channel.send("Here is your GIF!");

        if (tokens.length > 1) {
            tags = tokens.slice(1, tokens.length).join(" ");
        }

        let url = `https://api.tenor.com/v1/search?q=${tags}&key=${process.env.TENOR}&limit=5`;
        let response = await fetch(url);
        let json = await response.json();
        console.log(json);

        const i = Math.floor(Math.random() * json.results.length);
        msg.channel.send(json.results[i].url);

    }
}