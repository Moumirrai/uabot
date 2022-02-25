require("dotenv").config();
const { MessageEmbed } = require("discord.js");
const guildSettings = require("../models/guildSettings");
const dataBase = require("../models/data");
const hash = require('hash-it');
const scrape = require('./scrape').scrape

async function getNews(client) {
  let data = await scrape()
  let newHashes = []
  for (let i = 0; i < data.articles.length; i++) {
    newHashes.push(hash(data.articles[i]));
  }

  //get data from database
  let dbRawData = await  dataBase.findOne({ ID: "news" })
  if (!dbRawData) {
    dbRawData = new dataBase({
      ID: "news",
      data: newHashes,
    });
    dbRawData.save().catch((err) => console.log(err));
    return;
  }
  //create array of hashes from database
  let oldHashes = dbRawData.data;

  let newArticles = [];

  for (let i = 0; i < newHashes.length; i++) {
    if (!oldHashes.includes(newHashes[i])) {
      newArticles.push(data.articles[i]);
      oldHashes.push(newHashes[i]);
    }
  }

  if (newArticles.length === 0) {
    console.log("No new articles");
    return;
  }

  dbRawData.data = oldHashes;
  dbRawData.save().catch((err) => console.log(err));

  newArticles.reverse();

  const embedArray = await formatEmbeed(newArticles);

  var guildSet = await guildSettings.find();
  for (var i = 0; i < guildSet.length; i++) {
    var statusChannel = client.channels.cache.get(guildSet[i].statusChannelId);
    if (!statusChannel) return console.log("Status channel not found");
    // send every new article and add 2 seconds to the delay
    for (var j = 0; j < embedArray.length; j++) {
      statusChannel.send({
        embeds: [
          embedArray[j],
        ],
      });
      await sleep(2000);
    }
  }

}

async function formatEmbeed(articles) {
  let embeds = [];
  for (let i = 0; i < articles.length; i++) {
    let embed = new MessageEmbed()
    let description = "";
    if (articles[i].title) embed.setTitle(articles[i].title);
    if (articles[i].content) {
      let rawcontent = articles[i].content.filter((item) => typeof item === "string");
      //join all paragraphs with space
      content = rawcontent.join(" ");
      description += content;
    }
    if (articles[i].important) {
      embed.setColor("#eed202");
    } else {
      embed.setColor("#000000");
    }
    if (articles[i].twitter) {
      //split link on '?ref_src' and get first part
      let link = articles[i].twitter.split("?ref_src")[0];
      embed.addField("Links", `[Tweet](${link})`);
    }
    if (articles[i].image) {
      embed.setImage(articles[i].image)
    }
    if (description.match(/^(http|https):\/\/[^ "]+$/)) {
      let url = description.match(/^(http|https):\/\/[^ "]+$/);
      embed.setURL(url[0]);
    }
    embed.setTimestamp(articles[i].timestamp);
    if (description.startsWith("\n\n")) {
      description = description.slice(2);
    }
    //if description is not empty string
    if (description) {
      embed.setDescription(description);
    }
    embeds.push(embed);
  }
  return embeds;
}

// create sleep function
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

//export functions
module.exports.getNews = getNews;
