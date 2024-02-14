# Ethereum Transactions Scanner Project

This project is an example of a transaction scanner for the Ethereum network.

The core of the project lies in the file /src/constant.ts, where there is a variable:

~~~
const watchWallets: WatchWallet[] = [
  {
    address: '0x21a31ee1afc51d94c2efccaa2092ad1028285549', // Wallet address
    name: 'Binance 15', // Arbitrary wallet name
  },
];
~~~

The application scans the transactions of this wallet and returns only the most recent ones.

## Getting Started

To run the project, follow these steps:

1. Clone the repository.
2. Install dependencies by running <code>npm install</code>.
3. Create a .env file and specify the following variables:
~~~
NODE_ENV=development
ETHERSCAN_TOKEN=<Your Etherscan API Token>
COIN_MARKET_CAP_TOKEN=<Your CoinMarketCap API Token>
COVALENT_TOKEN=<Your Covalent API Token>

REDIS_PASSWORD=<Your Redis Password>
REDIS_PORT=<Your Redis Port>
REDIS_HOST=<Your Redis Host>

TELEGRAM_BOT_TOKEN=<Your Telegram Bot Token> (Optional)
TELEGRAM_BOT_CHAT_ID=<Your Telegram Bot Chat ID> (Optional)
~~~

4. Start the application <code>npm run start:dev</code>.

## Note

Make sure to replace <Your API Tokens> with your actual API tokens.

Feel free to reach out for any questions or issues.
