require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const path = require('path');

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });


console.log('🤖 Bot is running ..');

// Auto-load all commands
const commands = {};
fs.readdirSync(path.join(__dirname, 'commands')).forEach(file => {
  const cmdModule = require(`./commands/${file}`);
  // Support for multiple exports (top.js exports both 'top' and 'topcoin')
  if (cmdModule && cmdModule.command && cmdModule.handler) {
    // Single command export
    commands[cmdModule.command] = cmdModule.handler;
  }
  // Support for named exports (e.g. module.exports.topcoin = {...})
  Object.keys(cmdModule).forEach(key => {
    const cmd = cmdModule[key];
    if (cmd && cmd.command && cmd.handler) {
      commands[cmd.command] = cmd.handler;
    }
  });
});

// Handle /start command with a welcome message
bot.onText(/^\/start$/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    `👋 Welcome to CryptoNow Bot!\n\nA simple Telegram bot to get real-time crypto prices \n\nUse /help to see available commands.`
  );
});

// Handle /help command to show help message
bot.onText(/^\/help$/, (msg) => {
  if (commands['help']) {
    commands['help'](bot, msg, []);
  }
});

// Handle /topcoin command
bot.onText(/^\/topcoin$/, (msg) => {
  if (commands['topcoin']) {
    commands['topcoin'](bot, msg, []);
  }
});

// Handle /top5 command to show top 5 coins
bot.onText(/^\/top5$/, (msg) => {
  if (commands['top5']) {
    commands['top5'](bot, msg, []);
  }
});

// Handle /<coin> commands like /btc, /eth, /doge, etc.
bot.onText(/^\/([a-z0-9\-]+)$/i, async (msg, match) => {
  const coin = match[1].toLowerCase();
  // Prevent conflict with /top5 and /topcoin commands
  if (['top5', 'topcoin', 'help', 'start'].includes(coin)) return;
  if (commands['price']) {
    // Call the price handler with the coin as argument
    commands['price'](bot, msg, [coin]);
  }
});

bot.on('message', (msg) => {
  if (!msg.text?.startsWith('.')) return;
  const [cmd, ...args] = msg.text.slice(1).trim().split(' ');
  const handler = commands[cmd.toLowerCase()];
  if (handler) handler(bot, msg, args);
});
