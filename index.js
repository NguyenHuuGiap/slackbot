pry = require('pryjs');
var request = require('request');
const cheerio = require('cheerio');
const { RTMClient } = require('@slack/client');
const token = process.env.tokenSlack;

const rtm = new RTMClient(token);
rtm.start();

const channelId = process.env.channelID;

var Parser = require('rss-parser');
var htmlToJson = require('html-to-json');
var parser = new Parser();

var options = 'https://vnexpress.net/rss/tin-moi-nhat.rss';

var news;
var title_news;

var schedule = require('node-schedule');

var rule = new schedule.RecurrenceRule();
rule.minute = 1;

var j = schedule.scheduleJob(rule, function(){
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
