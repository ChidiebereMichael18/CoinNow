const axios = require('axios');

module.exports = {
  command: 'price',
  handler: async (bot, msg, args) => {
    // Join all args to support multi-word coins and trim spaces
    let coin = args.join(' ').trim().toLowerCase();
    // Remove angle brackets if user types /price <eth>
    coin = coin.replace(/^<|>$/g, '').replace(/<|>/g, '').trim();
    if (!coin) {
      return bot.sendMessage(msg.chat.id, "❌ Usage: `/price <coin>`");
    }

    try {
      // Try by id (e.g. bitcoin, ethereum)
      let url = `https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=usd&include_24hr_change=true`;
      let res = await axios.get(url);
      let data = res.data[coin];

      // If not found, try to resolve symbol or name to id
      if (!data) {
        // Search for coin id by symbol or name
        const searchRes = await axios.get(`https://api.coingecko.com/api/v3/search?query=${coin}`);
        const coins = searchRes.data.coins;
        if (coins.length > 0) {
          const coinId = coins[0].id;
          url = `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true`;
          res = await axios.get(url);
          data = res.data[coinId];
          coin = coinId;
        }
      }

      if (!data) {
        return bot.sendMessage(msg.chat.id, `❌ Coin "${coin}" not found.`);
      }

      const price = data.usd.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
      const change = data.usd_24h_change.toFixed(2);
      const emoji = change > 0 ? '📈' : '📉';

      const reply = `📊 *${coin.toUpperCase()} Price*\nPrice: ${price}\n24h Change: ${emoji} ${change}%`;
      bot.sendMessage(msg.chat.id, reply, { parse_mode: 'Markdown' });
    } catch {
      bot.sendMessage(msg.chat.id, '⚠️ Error fetching price. Try again later.');
    }
  }
};
