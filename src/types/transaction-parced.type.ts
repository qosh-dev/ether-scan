import { WatchingWallet } from "src/models/watching-wallet";
import { CurrencyConverter } from "src/types/currency-converter.interface";
import { TokenTX } from "src/types/tokentx.type";
import { RequestBalancer } from "src/utils/request-balancer/request-balancer";
import { CovalenthqLogEvent } from "../requests/covalenthq/covalenthq.types";

export type TransactionParced = {
  walletInfo: {
    wallet: string;
    name: string;
  };
  token: {
    tokenName: string;
    tokenSymbol: string;
    tokenDecimal: number;
    contractAddress: string;
    price: number;
  };
  gas: {
    gas: string;
    gasPrice: string;
    gasUsed: string;
    cumulativeGasUsed: string;
    metadata?: {
      contract_decimals: number;
      contract_name: string;
      contract_ticker_symbol: string;
      contract_address: string;
      supports_erc: string | null;
      logo_url: string;
    };
  };
  action: "send" | "receive"
  nonce: string;
  blockNumber: string;
  transactionIndex: string;
  input: string;
  confirmations: string;
  value: number;
  hash: string;
  usd: number;
  sender: string;
  receiver: string;
  timeStamp: number;
  logs: CovalenthqLogEvent[]
};

export type TransactionParcedLog = {
  block_signed_at: string;
  block_height: number;
  tx_offset: number;
  log_offset: number;
  sender_contract_decimals: number;
  sender_name: string;
  sender_contract_ticker_symbol: string;
  sender_address: string;
  sender_address_label: string | null;
  sender_logo_url: string;
  name: TransactionMethodType;
  signature: string;
  params: TransactionParcedLogParam[]
};

export type TransactionParcedLogParam = {
  name: string;
  type: string;
  indexed: boolean;
  decoded: boolean;
  value: string;
};

export type TransactionMethodType = 'Transfer' | 'Withdrawal' | 'Swap' | 'Sync' | "Deposit"

export type PayloadType = TokenTX & {
  wallet: WatchingWallet;
  converter: RequestBalancer<CurrencyConverter>;
};
