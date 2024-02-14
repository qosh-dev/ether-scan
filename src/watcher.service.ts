import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from 'src/config.service';
import { watchWallets } from 'src/constant';
import { DatasourceTransactionList } from 'src/models/transaction-list';
import { CoinmarketcapRequest } from 'src/requests/coinmarketcap/coinmarketcap.request';
import { CoinGeckoRequest } from 'src/requests/coinngecko/coinngecko.request';
import { EtherscanRequest } from 'src/requests/etherscan/etherscan.request';
import { CurrencyConverter } from 'src/types/currency-converter.interface';
import { IResourceProvider } from 'src/types/resources.types';
import { TransactionParced } from 'src/types/transaction-parced.type';
import { BaseUtils } from 'src/utils/base.utils';
import { Interval } from 'src/utils/interval';
import { RequestBalancer } from 'src/utils/request-balancer/request-balancer';
import { TemporaryStorage } from 'src/utils/temporary-storage';
import { WatchingWalletList } from './models/watching-wallet';

@Injectable()
export class WatcherService {
  // ------------------------------------------------------------------------------------
  currencyConverter: RequestBalancer<CurrencyConverter>;
  requestBalancer: RequestBalancer<IResourceProvider>;
  private interval: Interval;
  private watchWalletList: WatchingWalletList;

  // ------------------------------------------------------------------------------------

  constructor(readonly configService: ConfigService) {
    this.bootstrap();
  }

  // ------------------------------------------------------------------------------------

  async bootstrap() {
    const currencyRateStorage = new TemporaryStorage(
      this.configService.redisOptions,
      'token_price',
    );
    this.currencyConverter = new RequestBalancer([
      new CoinGeckoRequest(currencyRateStorage),
      new CoinmarketcapRequest(
        this.configService.confs.COIN_MARKET_CAP_TOKEN,
        currencyRateStorage,
      ),
    ]);

    this.watchWalletList = WatchingWalletList.fromMany(watchWallets);

    this.requestBalancer = new RequestBalancer([
      new EtherscanRequest(this.configService.confs.ETHERSCAN_TOKEN),
    ]);
    this.interval = new Interval('TRANSACTION_SCANNER', () =>
      this.fetchTransactions(),
    );

    await this.interval.start();
  }

  // ----------------------------------------------------------------------------------------
  // ----------------------------------------------------------------------------------------
  // ----------------------------------------------------------------------------------------

  async onFindNewTransactions(transactions: TransactionParced[]) {
    const data = transactions.filter((transaction) => {
      if (!transaction) return false;
      if (!transaction.token.price) return false;
      return true;
    });

    const telegramBotOptions = this.configService.telegramBotOptions;

    console.log('Find new transactions, count ' + data.length);

    if (!telegramBotOptions) {
      return;
    }

    await Promise.all(
      transactions.map(async (transaction) => {
        let message = '---------------------\n';

        message += BaseUtils.objectToText({
          wallet: transaction.walletInfo.wallet,
          hash: transaction.hash,
          token: transaction.token.tokenSymbol,
          value: transaction.value,
          price: transaction.token.price + '💵',
          usd: transaction.usd + '💵',
          time: transaction.timeStamp,
          sender: transaction.sender,
          receiver: transaction.receiver,
        });
        await BaseUtils.wait(500);
        await this.sendMessageToTelegram(
          telegramBotOptions.token,
          telegramBotOptions.chatId,
          message,
        );
      }),
    );
  }

  // ----------------------------------------------------------------------------------------
  // ----------------------------------------------------------------------------------------
  // ----------------------------------------------------------------------------------------

  async fetchTransactions() {
    const responses = await this.requestBalancer.request(
      'walletTransactions',
      ...this.watchWalletList.items,
    );

    const transactionGroups = responses.map(({ wallet, transactions }) =>
      transactions.map((transaction) => ({
        transaction,
        wallet,
      })),
    );

    if (!transactionGroups.length) {
      return;
    }

    for (const transactionGroup of transactionGroups) {
      const wallet = transactionGroup[0].wallet;
      const transactions = transactionGroup
        .flatMap((t) => t.transaction)
        .sort((a, b) => +a.blockNumber - +b.blockNumber);
      const transactionList = new DatasourceTransactionList(
        wallet,
        transactions,
        this.currencyConverter,
      );
      transactionList.excludeOldTransactions();
      const records = await transactionList.parce();
      await this.onFindNewTransactions(records);
    }
  }

  // ------------------------------------------------------------------------------

  private async sendMessageToTelegram(
    botToken: string,
    chatId: number,
    message: string,
  ) {
    try {
      await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown',
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }

  // ------------------------------------------------------------------------------
}
