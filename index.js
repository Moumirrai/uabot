const { Client, Intents } = require('discord.js');
const fs = require("fs");
const mongoose = require('mongoose');
const loadCMDS = require("./utils/loadcmds.js");
const news = require("./utils/news.js");
const guildSettings = require('./models/guildSettings');
require('dotenv').config();
var CronJob = require('cron').CronJob;
const { MessageEmbed } = require('discord.js');
const db = require("./utils/db.js");



const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES]
});

const config = require("./config.json");
client.config = config;


client.on("ready", () => {
  console.log(`${client.user.tag} is ready!`);
});

client.on('messageCreate', async (msg) => {
    if (msg.content.startsWith(client.config.prefix) && !msg.author.bot && msg.guild) { //check if the message starts with the prefix and if the message is not from a bot
        const args = msg.content.slice(config.prefix.length).split(" ");
        console.log(args)
        const command = args.shift().toLowerCase();
        const findcmd = client.commands.get(command) || client.aliases.get(command); //find command or alias
        
        if (findcmd) {
            findcmd.execute(client, msg, args);    
        }
    }
});
client.on('interactionCreate', button => {
	if (!button.isButton()) return;
    button.deferUpdate()
    switch (button.customId) {
        case 'chart':
            chart.button(client, button)
        break;
    }
});
process.stdin.on('data', function(data) {
    if (data.toString().trim() === 'reload') {
        loadCMDS(client);
    }
});

loadCMDS(client);

mongoose.connect(process.env.MONGODB_SRV, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: false,
}).then(() => {
    console.log('Connected to Database');
}).catch(err => {
    console.log('Error connecting to Database: ', err.message);
});

var checkForUpdates = new CronJob('0 */25 5,0-1 * * *', async function() {
    await news.getNews(client);
});

//create cronjob taht will run every 25 minutes from 5am to 1am

checkForUpdates.start();

client.login(process.env.TOKEN);
