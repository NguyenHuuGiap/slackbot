pry = require('pryjs');

const { RTMClient } = require('@slack/client');
const token = 'xoxb-357272516532-SyviQIXCOLBYNu3nELRgxoCr'

const rtm = new RTMClient(token);
rtm.start();

const channelId = 'CAJGFDYDV'

var Parser = require('rss-parser');
var parser = new Parser();

var options = 'https://vnexpress.net/rss/tin-moi-nhat.rss';

var news;
var title_news;

var schedule = require('node-schedule');

var j = schedule.scheduleJob('30 * * * * *', function(){
  asynMgs();
});

function asynMgs() {
  (async () => {
    let feed = await parser.parseURL(options);
    title_news = feed.title;
    news = feed.items[0];
    sendMgsSlack();
  })();
};

function sendMgsSlack() {
  rtm.sendMessage(news.link, channelId)
    .then((res) => {
      console.log('Message sent: ' + title_news);
    })
    .catch(console.error);
};
