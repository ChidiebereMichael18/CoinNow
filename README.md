# 🪙 Crypto Price Bot (Telegram)

A simple Telegram bot to get real-time crypto prices using the CoinGecko API.

## 🚀 Features
- `.price bitcoin` – Get live price and 24h change
- `.top` – Top 5 coins by market cap
- `.info solana` – View basic coin info
- `.help` – List all commands

## 🛠 Tech Stack
- Node.js
- Telegram Bot API (`node-telegram-bot-api`)
- CoinGecko API (no API key needed)

## 🧑‍💻 Getting Started

```bash
git clone https://github.com/ChidiebereMichael18/CoinNow.git
cd crypto
npm install
cp .env.example .env
# Add your Telegram bot token to .env
node bot.js
