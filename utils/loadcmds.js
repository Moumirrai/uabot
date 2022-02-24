const Discord = require('discord.js');
const fs = require("fs");

function loadCMDS(client) {

    client.commands = new Discord.Collection();
    client.aliases = new Discord.Collection()
    client.info = new Discord.Collection();

    fs.readdir(`./commands/`, (error, files) => { 

        if (error) {return console.log("Error while trying to get the commmands.");};
        files.forEach(file => {
            delete require.cache[require.resolve(`../commands/${file}`)];
            const command = require(`../commands/${file}`);
            const commandName = file.split(".")[0];
    
            client.commands.set(commandName, command);
            //console.log(`${commandName} loaded`);
    
            if (command.aliases) {
                command.aliases.forEach(alias => {
                    client.aliases.set(alias, command);
                });
            };
        });
        console.log(`${client.commands.size} commands loaded!`);
    });
}

module.exports = loadCMDS;