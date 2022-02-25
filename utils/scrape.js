const scrapeIt = require("scrape-it");
const moment = require('moment');

async function scrape() {
  let content = await scrapeIt(
    "https://www.e15.cz/ukrajina-vs-rusko-konflikt-valka-aktualne#headerComments",
    {
      // Fetch the articles
      articles: {
        listItem: ".report-item",
        data: {
          // Get the article date and convert it into a Date object
          createdDate: {
            selector: ".date",
          },
  
          createdTime: {
            selector: ".time",
          },
  
          // Get the title (strong)
          title: "strong",
  
          // Nested list
          content: {
            //get all paragraphs
            listItem: "p",
          },
  
          //get div with class 'social-media__wrapper twitter-media' and then get its 'data-url' attribute
          twitter: {
            selector: ".social-media__wrapper.twitter-media",
            attr: "data-url",
          },

          image: {
            selector: ".reportImage",
            attr: "href",
            convert: x => x.split('?v=')[0]
          },
  
          important: {
            selector: ".important",
          },
        },
      },
    },
  );
  for (let i = 0; i < content.data.articles.length; i++) {
    let date = (content.data.articles[i].createdDate).replace(/\s\s+/g, '');
    let time = content.data.articles[i].createdTime
    let timestamp = moment(`${date.replace(/\./g, '/')} ${time}`, 'DD/MM/YYYY HH:mm').toDate();
    content.data.articles[i].timestamp = timestamp;
  }
  return content.data
}

module.exports.scrape = scrape;