pry = require('pryjs');
var request = require('request');
const cheerio = require('cheerio');
const { RTMClient } = require('@slack/client');
const token = 'xoxb-357272516532-qq1TaIqjaZ1fcsUpQuvx9D4b'

const rtm = new RTMClient(token);
rtm.start();

const channelId = 'CA78Y9Y1E'

var Parser = require('rss-parser');
var htmlToJson = require('html-to-json');
var parser = new Parser();

var options = 'https://vnexpress.net/rss/tin-moi-nhat.rss';

var news;
var title_news;

var schedule = require('node-schedule');

var j = schedule.scheduleJob('42 * * * *', function(){
  asynMgs();
  sendMgsGenK();
});

function asynMgs() {
  (async () => {
    let feed = await parser.parseURL(options);
    title_news = feed.title;
    news = feed.items[0];
    sendMgsSlack(news.link);
  })();
};

function sendMgsSlack(link) {
  rtm.sendMessage(link, channelId)
    .then((res) => {
      console.log('Message sent: ' + link);
    })
    .catch(console.error);
};

function sendMgsGenK() {
  request('http://genk.vn', function (error, response, html) {
    if (!error && response.statusCode == 200) {
      var $ = cheerio.load(html);
      var links = ("http://genk.vn" + $('.knswli-title a')[0].attribs.href)
      sendMgsSlack(links);
    }
  });
}
