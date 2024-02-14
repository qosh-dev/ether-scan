import { CurrencyConverter } from 'src/types/currency-converter.interface';
import { TokenTX } from 'src/types/tokentx.type';
import { RequestBalancer } from 'src/utils/request-balancer/request-balancer';
import { TransactionParced } from '../types/transaction-parced.type';
import { TransactionM } from './transaction';
import { WatchingWallet } from './watching-wallet';

export class DatasourceTransactionList {
  transactions: Omit<TokenTX, 'wallet'>[] = [];

  constructor(
    readonly wallet: WatchingWallet,
    transactions: Omit<TokenTX, 'wallet'>[],
    readonly currencyConverter: RequestBalancer<CurrencyConverter>,
  ) {
    this.transactions = transactions;
  }

  async parce(): Promise<TransactionParced[]> {
    if (this.transactions.length === 0) {
      return [];
    }
    const parsedTransactions = await Promise.all(
      this.transactions.map((record) => {
        const transaction = new TransactionM({
          ...record,
          converter: this.currencyConverter,
          wallet: this.wallet,
        });
        return transaction.parce();
      }),
    );
    return parsedTransactions.filter((t) => t);
  }

  excludeOldTransactions(): void {
    this.removeDuplicatesByBlockNumber();
    this.removeSharedBlocks();
    this.wallet.updateSharedBlocks(this.transactions.map((t) => t.blockNumber));
  }

  removeDuplicatesByBlockNumber() {
    const seen = new Set<string>();
    const result: Omit<TokenTX, 'wallet'>[] = [];

    for (const transaction of this.transactions) {
      if (!seen.has(transaction.blockNumber)) {
        seen.add(transaction.blockNumber);
        result.push(transaction);
      }
    }

    this.transactions = result;
  }

  private removeSharedBlocks() {
    this.transactions = this.transactions.filter(
      (t) => !this.wallet.blockExist(t.blockNumber),
    );
  }
}
