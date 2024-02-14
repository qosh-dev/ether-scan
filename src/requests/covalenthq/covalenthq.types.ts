import { TransactionMethodType } from 'src/types/transaction-parced.type';

export interface CovalenthqTransactionResponse {
  data: CovalenthqTransactionData;
  error: boolean;
  error_message: string | null;
  error_code: string | number | null;
}

export interface CovalenthqTransactionData {
  address: string;
  updated_at: string;
  next_update_at: string;
  quote_currency: string;
  chain_id: number;
  chain_name: string;
  current_page: number;
  links: {
    prev: string | null;
    next: string | null;
  };
  items: CovalenthqTransactionItem[];
}

export interface CovalenthqTransactionItem {
  block_signed_at: string;
  block_height: number;
  block_hash: string;
  tx_hash: string;
  tx_offset: number;
  successful: boolean;
  miner_address: string;
  from_address: string;
  from_address_label: string | null;
  to_address: string;
  to_address_label: string | null;
  value: string;
  value_quote: number;
  pretty_value_quote: string;
  gas_metadata: {
    contract_decimals: number;
    contract_name: string;
    contract_ticker_symbol: string;
    contract_address: string;
    supports_erc: string | null;
    logo_url: string;
  };
  gas_offered: number;
  gas_spent: number;
  gas_price: number;
  fees_paid: string;
  gas_quote: number;
  pretty_gas_quote: string;
  gas_quote_rate: number;
  explorers: CovalenthqExplorerLink[];
  log_events: CovalenthqLogEvent[];
}

export interface CovalenthqExplorerLink {
  label: string | null;
  url: string;
}

export interface CovalenthqLogEvent {
  block_signed_at: string;
  block_height: number;
  tx_offset: number;
  log_offset: number;
  tx_hash: string;
  raw_log_topics: string[];
  sender_contract_decimals: number;
  sender_name: string;
  sender_contract_ticker_symbol: string;
  sender_address: string;
  sender_address_label: string | null;
  sender_logo_url: string;
  raw_log_data: string;
  decoded: CovalenthqDecodedLogEvent;
}

export interface CovalenthqDecodedLogEvent {
  name: TransactionMethodType;
  signature: string;
  params: CovalenthqDecodedLogEventParams[];
}

export type CovalenthqDecodedLogEventParams = {
  name: string;
  type: string;
  indexed: boolean;
  decoded: boolean;
  value: string;
};
