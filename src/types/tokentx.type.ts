import { WatchingWallet } from '../models/watching-wallet';

export type WatchWallet = {
  address: string;
  name: string;
};

export type TokenTXPayload = {
  address: string;
  contractaddress?: string;
  startblock?: number | string;
  endblock?: string;
  page?: number;
  offset?: number;
  sort?: string;
};

export type TokenTXResponse = {
  status: 0 | 1;
  message: string;
  result: TokenTX[];
};

export type WalletTransactionsResponse = {
  wallet: WatchingWallet;
  transactions: TokenTX[];
};

export interface TokenTX {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  nonce: string;
  blockHash: string;
  from: string;
  contractAddress: string;
  to: string;
  value: string;
  tokenName: string;
  tokenSymbol: string;
  tokenDecimal: string;
  transactionIndex: string;
  gas: string;
  gasPrice: string;
  gasUsed: string;
  cumulativeGasUsed: string;
  input: string;
  confirmations: string;
}
