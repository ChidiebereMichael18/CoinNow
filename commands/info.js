const axios = require('axios');

module.exports = {
  command: 'info',
  handler: async (bot, msg, args) => {
    // Join all args to support multi-word coins and trim spaces
    let coin = args.join(' ').trim().toLowerCase();
    coin = coin.replace(/^<|>$/g, '').replace(/<|>/g, '').trim();
    if (!coin) return bot.sendMessage(msg.chat.id, "❌ Usage: `/info <coin>`");

    // Try to resolve symbol or name to id first (more robust for user input)
    try {
      const searchRes = await axios.get(`https://api.coingecko.com/api/v3/search?query=${coin}`);
      const coins = searchRes.data.coins;
      if (coins.length > 0) {
        const coinId = coins[0].id;
        const res = await axios.get(`https://api.coingecko.com/api/v3/coins/${coinId}`);
        const data = res.data;
        const reply = `
🔍 *${data.name} (${data.symbol.toUpperCase()})*
Rank: ${data.market_cap_rank}
Homepage: [Website](${data.links.homepage[0]})
Blockchain: ${data.asset_platform_id || 'Unknown'}
Genesis Date: ${data.genesis_date || 'N/A'}
        `;
        return bot.sendMessage(msg.chat.id, reply, { parse_mode: 'Markdown' });
      } else {
        // If not found in search, try direct id as fallback
        try {
          const res = await axios.get(`https://api.coingecko.com/api/v3/coins/${coin}`);
          const data = res.data;
          const reply = `
🔍 *${data.name} (${data.symbol.toUpperCase()})*
Rank: ${data.market_cap_rank}
Homepage: [Website](${data.links.homepage[0]})
Blockchain: ${data.asset_platform_id || 'Unknown'}
Genesis Date: ${data.genesis_date || 'N/A'}
          `;
          return bot.sendMessage(msg.chat.id, reply, { parse_mode: 'Markdown' });
        } catch {
          // fall through to error below
        }
      }
      bot.sendMessage(msg.chat.id, `❌ Could not find info for "${coin}".`);
    } catch {
      bot.sendMessage(msg.chat.id, `❌ Could not find info for "${coin}".`);
    }
  }
};
