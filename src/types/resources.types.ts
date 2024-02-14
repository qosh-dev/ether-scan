import { WatchingWallet } from 'src/models/watching-wallet';
import {
  TokenTXPayload,
  TokenTXResponse,
  WalletTransactionsResponse,
} from 'src/types/tokentx.type';
import { EthTransactionInfo } from '../requests/etherscan/etherscan.types';

// Specify only one argument
export interface IResourceProvider {
  tokenTX: (payload: TokenTXPayload) => Promise<TokenTXResponse>;
  walletTransactions: (
    wallet: WatchingWallet,
  ) => Promise<WalletTransactionsResponse>;
  transactionInfo(hash: string): Promise<EthTransactionInfo>;
}
