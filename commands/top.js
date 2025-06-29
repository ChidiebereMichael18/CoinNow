const axios = require('axios');

module.exports = {
  command: 'top5',
  handler: async (bot, msg) => {
    try {
      const res = await axios.get(`https://api.coingecko.com/api/v3/coins/markets`, {
        params: {
          vs_currency: 'usd',
          order: 'market_cap_desc',
          per_page: 5,
          page: 1
        }
      });

      const reply = res.data.map((coin, i) =>
        `#${i + 1} ${coin.name} (${coin.symbol.toUpperCase()}): $${coin.current_price.toLocaleString()}`
      ).join('\n');

      bot.sendMessage(msg.chat.id, `🏅 *Top 5 Coins by Market Cap*\n\n${reply}`, { parse_mode: 'Markdown' });
    } catch {
      bot.sendMessage(msg.chat.id, '❌ Error fetching top coins.');
    }
  }
};

// Add a new command for the top coin only
module.exports.topcoin = {
  command: 'topcoin',
  handler: async (bot, msg) => {
    try {
      const res = await axios.get(`https://api.coingecko.com/api/v3/coins/markets`, {
        params: {
          vs_currency: 'usd',
          order: 'market_cap_desc',
          per_page: 1,
          page: 1
        }
      });
      const coin = res.data[0];
      const reply = `🥇 *Top Coin by Market Cap*\n${coin.name} (${coin.symbol.toUpperCase()}): $${coin.current_price.toLocaleString()}`;
      bot.sendMessage(msg.chat.id, reply, { parse_mode: 'Markdown' });
    } catch {
      bot.sendMessage(msg.chat.id, '❌ Error fetching top coin.');
    }
  }
};
