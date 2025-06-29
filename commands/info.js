const axios = require('axios');

module.exports = {
  command: 'info',
  handler: async (bot, msg, args) => {
    if (!args.length) return bot.sendMessage(msg.chat.id, "❌ Usage: `.info bitcoin`");

    const coin = args[0].toLowerCase();
    const url = `https://api.coingecko.com/api/v3/coins/${coin}`;

    try {
      const res = await axios.get(url);
      const data = res.data;

      const reply = `
🔍 *${data.name} (${data.symbol.toUpperCase()})*
Rank: ${data.market_cap_rank}
Homepage: [Website](${data.links.homepage[0]})
Blockchain: ${data.asset_platform_id || 'Unknown'}
Genesis Date: ${data.genesis_date || 'N/A'}
      `;

      bot.sendMessage(msg.chat.id, reply, { parse_mode: 'Markdown' });
    } catch {
      bot.sendMessage(msg.chat.id, `❌ Could not find info for "${coin}".`);
    }
  }
};
