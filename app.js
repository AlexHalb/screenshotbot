var Irc = require('irc-framework');
var bot = new Irc.Client({
  nick: 'eternabot',
  username: 'eternabot',
  gecos: 'eternabot',
  encoding: 'utf8',
  version: 'node.js irc-framework',
});
bot.connect({
	host: 'wss://irc.eternagame.org/chatws/websocket',
	port: process.env.PORT,
	nick: 'ScreenshotBot'
});

var urlArray = [];
bot.on('message', function(event) {
    if (event.nick === bot.nick) return;
    let msg = event.message;
    msg = msg.toLowerCase();
    if (msg.includes('!')) {
      msg = msg.substring(msg.indexOf('!') + 1);
      const parts = msg.split(' ');
      const cmd = parts[0];
      let params = msg.replace(`${cmd} `, '').split(' ');
      var arr = urlArray;
      switch (cmd) {
        case 'screenshotbot':
        case 'screenshbot': 
        case 'screenbshot':
        case 'screenshot':
        case 'bot':
        case 'help': event.reply(formatMessage("I'm Eterna's screenshot bot. I automatically record screenshots sent in the chat and store them so they can be easily accessed in the future. To access the most recent 15 screenshots, use `!all`. To choose how many you view, use `!last <number>`")); break;
        case 'all': params[0] = '15';
        case 'last':
          if (parseInt(params[0])) {
            if (parseInt(params[0]) > 15) {
              params[0] = '15';
            }
            while (arr.length > parseInt(params[0])) {
              arr.pop()
            }
            if (arr.length > 0) {
              arr.reverse().forEach((e, i) => {
                setTimeout(() => { event.reply(formatMessage(`${e[0]} at ${e[1]} - [${i + 1}](${e[2]})`))}, i * 1000);
              });
            }
            break;
          }
          break;
        default: bot.say(event.nick, formatMessage('Invalid command')); break;
      }
    }
    if (msg.includes('.screen')) {
      event.reply(formatMessage("If you were trying to summon me, use the `!` prefix instead. For more information, type `!help`."));
    }
    if (msg.match(/https:\/\/eternagame.org\/sites\/default\/files\/chat_screens\/\d{6}_\d{10}\.png/)) {
      var today = new Date();
      var dd = today.getDate();
      var mm = today.getMonth() + 1;
      var yyyy = today.getFullYear();
      var hh = String(today.getHours()).padStart(2, '0');
      var min = String(today.getMinutes()).padStart(2, '0');
      var ss = String(today.getSeconds()).padStart(2, '0');
      today = `${hh}:${min}:${ss} on ${mm}/${dd}/${yyyy}`
      var username = event.nick.substring(0, event.nick.lastIndexOf('__'));
      var uid = event.nick.replace(`${username}__`, '')
        .replace(/\^\d+/, '');
      var link = `[${username}]("https://eternagame.org/players/${uid}")`;
      urlArray.push([link, today, msg.substring(msg.search(/https:\/\/eternagame.org\/sites\/default\/files\/chat_screens\/\d{6}_\d{10}\.png/))]);
    }
});

bot.on('raw', (e) => {
  console.log(e.from_server ? e.line : '');
})

function formatMessage(msg) {
  return `000000_<font color="#FFFFFF">ScreenshotBot</font>_${getDateString()} UTC_${msg}`;
}

function getDateString() {
  const date = new Date()
  const year = date.getUTCFullYear();
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthsOfYear = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = monthsOfYear[date.getUTCMonth()];
  const day = daysOfWeek[date.getUTCDay()];
  const dateNum = date.getUTCDate().toString().padStart(2, '0');
  const hours = date.getUTCHours().toString().padStart(2, '0');
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  const seconds = date.getUTCSeconds().toString().padStart(2, '0');
  return `${day} ${month} ${dateNum} ${hours}:${minutes}:${seconds} ${year}`
}

const channels = ['#general', '#labs', '#help', '#off-topic', '#test'];
setTimeout(() => { 
  channels.forEach(c => bot.join(c));
}, 1500);
