export type ResponseWithStatus<T> = {
  status: string;
  message: string;
  result: T;
};

export type EthTransactionInfoResponse = {
  jsonrpc: string;
  id: number;
  result: EthTransactionInfo;
};

export type EthTransactionInfo = {
  blockHash: string;
  blockNumber: string;
  from: string;
  gas: string;
  gasPrice: string;
  maxFeePerGas: string;
  maxPriorityFeePerGas: string;
  hash: string;
  input: string;
  nonce: string;
  to: string;
  transactionIndex: string;
  value: string;
  type: string;
  accessList: any[];
  chainId: string;
  v: string;
  r: string;
  s: string;
  yParity: string;
};

