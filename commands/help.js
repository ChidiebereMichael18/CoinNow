module.exports = {
  command: 'help',
  handler: (bot, msg) => {
    const text = `
🪙 *Crypto Price Bot Commands*
• /(coin name) – Get current price & 24h change of any coin
• /top5 – Show top 5 coins by market cap
• /topcoin – Show the top coin by market cap
• /help – Show this message
    `;
    bot.sendMessage(msg.chat.id, text, { parse_mode: 'Markdown' });
  }
};
