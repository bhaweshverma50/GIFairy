require('dotenv').config();
const port = process.env.PORT;

const Discord = require('discord.js');
const client = new Discord.Client();

const fs = require('fs');

const prefix = "gf";

client.commands = new Discord.Collection();
