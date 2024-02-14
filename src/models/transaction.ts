import { CurrencyConverter } from 'src/types/currency-converter.interface';
import { BaseUtils } from 'src/utils/base.utils';
import { RequestBalancer } from 'src/utils/request-balancer/request-balancer';
import { StableCoins } from '../constant';
import { CovalenthqRequest } from '../requests/covalenthq/covalenthq.request';
import {
  PayloadType,
  TransactionParced,
} from '../types/transaction-parced.type';
import { WatchingWallet } from './watching-wallet';

export class TransactionM {
  wallet: WatchingWallet;
  blockNumber: string;
  hash: string;
  tokenSymbol: string;
  time: number;
  contractAddress: string;
  to: string;
  value: string;
  from: string;
  amount: number;
  tokenName: string;
  tokenDecimal: number;
  gasPrice: string;
  private converter: RequestBalancer<CurrencyConverter>;

  public get isStableCoin(): boolean {
    return StableCoins.includes(this.tokenSymbol);
  }

  constructor(readonly data: PayloadType) {
    this.wallet = data.wallet;
    this.blockNumber = data.blockNumber;
    this.hash = data.hash;
    this.tokenSymbol = data.tokenSymbol;
    this.time = +data.timeStamp * 1000;
    this.contractAddress = data.contractAddress;
    this.to = data.to;
    this.from = data.from;
    this.amount = +data.value / (1 * 10 ** +data.tokenDecimal);
    this.tokenName = data.tokenName;
    this.gasPrice = data.gasPrice;
    this.tokenDecimal =
      +data.tokenDecimal !== undefined ? +data.tokenDecimal : 0;
    this.converter = data.converter;
  }

  async parce(): Promise<TransactionParced> {
    const transactionInfo = await this.transactionInfo();
    let data: TransactionParced = {
      walletInfo: {
        wallet: this.wallet.address,
        name: this.wallet.name,
      },
      token: {
        tokenName: this.tokenName,
        tokenSymbol: this.tokenSymbol,
        tokenDecimal: this.tokenDecimal,
        contractAddress: this.contractAddress,
        price: 0,
      },
      gas: {
        gas: this.data.gas,
        gasPrice: this.data.gasPrice,
        gasUsed: this.data.gasUsed,
        cumulativeGasUsed: this.data.cumulativeGasUsed,
        metadata: transactionInfo?.gas_metadata,
      },
      action: this.wallet.address === this.to ? 'send' : 'receive',
      nonce: this.data.nonce,
      blockNumber: this.blockNumber,
      transactionIndex: this.data.transactionIndex,
      input: this.data.input,
      confirmations: this.data.confirmations,
      value: this.amount,
      hash: this.hash,
      usd: 0,
      sender: this.from,
      receiver: this.to,
      timeStamp: this.time,
      logs: transactionInfo?.log_events ?? [],
    };

    data = await this.calculateUsdAmount(data);
    return data;
  }

  private async calculateUsdAmount(data: TransactionParced) {
    const response = await this.converter.request('getUSDEqual', {
      address: data.token.contractAddress,
      token: data.token.tokenSymbol,
    });
    const price = response[0] ?? 0;
    data.usd = price && BaseUtils.fixedNumber(price * data.value);
    data.token.price = price;
    return data;
  }

  async transactionInfo() {
    try {
      const provider = new CovalenthqRequest(process.env.COVALENT_TOKEN);
      const resSender = await provider.getTransactionInfo(this.hash);
      return resSender.data.data.items[0];
    } catch (e) {
      const code = e.response?.data?.error_code;
      if (code === 400) {
        // Transaction not found
        return;
      }
      return;
    }
  }
}
