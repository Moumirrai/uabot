const { MessageEmbed } = require("discord.js");
const guildSettings = require("../models/guildSettings");

module.exports = {
  name: "statuschannel",
  aliases: ["subscribe", "sub"],
  description: "Set status channel",
  usage: `schannel`,
  async execute(client, msg, args) {
    if ((args[0] === "remove") | (args[0] === "r")) {
      // Remove status channel
      guildSettings.findOneAndDelete(
        { guildID: msg.guild.id },
        (err, settings) => {
          if (err) console.log(err);
          if (!settings) {
            msg.channel.send("You don't have any status channel!");
            return;
          }
          msg.channel.send(
            `Status channel \`${settings.statusChannelName}\` removed`
          );
          return;
        }
      );
    } else {
      // Set or change status channel
      guildSettings.findOne({ guildID: msg.guild.id }, (err, settings) => {
        if (err) return console.log(err);
        if (!settings) {
          settings = new guildSettings({
            guildID: msg.guild.id,
            statusChannelName: msg.channel.name,
            statusChannelId: msg.channel.id,
          });
          settings.save().catch((err) => console.log(err));
        } else {
          settings.statusChannelName = msg.channel.name;
          settings.statusChannelId = msg.channel.id;
          settings.save().catch((err) => console.log(err));
        }
        const Embed = new MessageEmbed().setColor(client.config.embedColor);
        Embed.setTitle(`\`${msg.channel.name}\` was set as status chanel!`);
        msg.channel.send({ embeds: [Embed] });
      });
    }
  },
};
