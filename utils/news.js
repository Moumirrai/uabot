require("dotenv").config();
const NewsAPI = require("newsapi");
const { MessageEmbed } = require("discord.js");
const newsapi = new NewsAPI(process.env.NEWSAPI_KEY);
const guildSettings = require("../models/guildSettings");
const dataBase = require("../models/data");

async function getNews(client) {
  newsapi.v2
    .everything({
      q: "ukrajina",
      language: "cs",
    })
    .then((response) => {
      console.log(response.articles.length);
      if (!response | !response.articles.length) return;
      // get data from database
      dataBase.findOne({ ID: "news" }, (err, dbresponse) => {
        if (err) return console.log(err);
        if (!dbresponse) {
          dbresponse = new dataBase({
            ID: "news",
            data: response.articles,
          });
          dbresponse.save().catch((err) => console.log(err));
          return;
        }
        const oldData = dbresponse.data;
        const newData = response.articles;
        const newArticles = newData.filter(
          (article) =>
            !oldData.some((oldArticle) => oldArticle.title === article.title)
        );
        if (newArticles.length) {
          const mergedData = oldData.concat(newArticles);
          dbresponse.data = mergedData;
          dbresponse.save().catch((err) => console.log(err));
          return sendNews(client, newArticles);
        }
      });
    });
}

async function sendNews(client, newArticles) {
  var guildSet = await guildSettings.find();
  for (var i = 0; i < guildSet.length; i++) {
    var statusChannel = client.channels.cache.get(guildSet[i].statusChannelId);
    if (!statusChannel) return console.log("Status channel not found");
    // send every new article and add 2 seconds to the delay
    for (var j = 0; j < newArticles.length; j++) {
      //if article.content is more then 997 characters, cut it, keep the first 997 characters and add "..."
      if (newArticles[j].title.length > 147) {
        newArticles[j].title = newArticles[j].title.substring(0, 147) + "...";
      }
      if (newArticles[j].description.length > 147) {
        newArticles[j].description =
          newArticles[j].description.substring(0, 147) + "...";
      }
      if (newArticles[j].content.length > 997) {
        newArticles[j].content =
          newArticles[j].content.substring(0, 997) + "...";
      }

      var article = newArticles[j];
      statusChannel.send({
        embeds: [
          new MessageEmbed()
            .setTitle(article.title)
            .setURL(article.url)
            .setImage(article.urlToImage)
            .setDescription(article.description)
            .setColor("#000000")
            .setTimestamp(article.publishedAt),
        ],
      });
      await sleep(2000);
    }
  }
}

// create sleep function
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

//export functions
module.exports.getNews = getNews;
