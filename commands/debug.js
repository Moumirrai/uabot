const { MessageEmbed } = require("discord.js");
const { MessageActionRow, MessageButton } = require("discord.js");
const news = require("../utils/news.js");

module.exports = {
  name: "debug",
  aliases: ["test"],
  description: "Debug",
  usage: `none`,
  async execute(client, msg, args) {
    if (msg.author.id !== "414381675162894367") return;
    await news.getNews(client);
  },
};
