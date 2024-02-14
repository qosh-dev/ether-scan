import axios from 'axios';
import { WatchingWallet } from 'src/models/watching-wallet';
import {
  TokenTXPayload,
  TokenTXResponse,
  WalletTransactionsResponse,
} from 'src/types/tokentx.type';
import { IResourceProvider } from '../../types/resources.types';
import {
  EthTransactionInfo,
  EthTransactionInfoResponse,
} from './etherscan.types';

export class EtherscanRequest implements IResourceProvider {
  public get baseUrl(): URL {
    const url = new URL('https://api.etherscan.io/api');
    url.searchParams.append('apikey', this.token);
    return url;
  }

  constructor(readonly token: string) {}

  async walletTransactions(
    wallet: WatchingWallet,
  ): Promise<WalletTransactionsResponse> {
    const args = {
      address: wallet.address,
      startblock: 1,
      endblock: 'latest',
      page: 1,
      offset: 5,
      sort: 'desc',
    };
    const response = await this.tokenTX(args);
    return {
      wallet,
      transactions: response.result,
    };
  }

  async tokenTX(payload: TokenTXPayload): Promise<TokenTXResponse> {
    const url = this.baseUrl;
    url.searchParams.append('module', 'account');
    url.searchParams.append('action', 'tokentx');
    if (payload.contractaddress) {
      url.searchParams.append('contractaddress', payload.contractaddress);
    }
    url.searchParams.append('address', payload.address);
    url.searchParams.append('page', String(payload.page));
    url.searchParams.append('offset', String(payload.offset));
    url.searchParams.append('startblock', String(payload.startblock));

    url.searchParams.append('endblock', String(payload.endblock));
    url.searchParams.append('startblock', String(payload.startblock));
    url.searchParams.append('sort', String(payload.sort));
    url.searchParams.append('apikey', String(this.token));

    const response = await axios.get(url.toString(), { timeout: 10000 });
    const data = response.data;
    if (data.message === 'No transactions found') {
      return null;
    }

    if (data.message === 'NOTOK') {
      throw new Error("'Max rate limit reached");
    }

    return data;
  }

  async transactionInfo(hash: string): Promise<EthTransactionInfo> {
    const url = this.baseUrl;
    url.searchParams.append('module', 'proxy');
    url.searchParams.append('action', 'eth_getTransactionByHash');
    url.searchParams.append('txhash', hash);
    url.searchParams.append('apikey', this.token);

    const response = await axios.get<EthTransactionInfoResponse>(
      url.toString(),
      { timeout: 10000 },
    );
    if (!response.data.result) {
      return null;
    }
    return response.data.result;
  }
}
