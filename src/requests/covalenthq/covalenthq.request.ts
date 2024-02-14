import axios, { AxiosResponse } from 'axios';
import { CovalenthqTransactionResponse } from './covalenthq.types';

export class CovalenthqRequest {
  constructor(readonly token: string) {}

  async getTransactionInfo(
    txHash: string,
  ): Promise<AxiosResponse<CovalenthqTransactionResponse, any>> {
    const url = `https://api.covalenthq.com/v1/eth-mainnet/transaction_v2/${txHash}/?key=${this.token}`;
    return axios.get<CovalenthqTransactionResponse>(url);
  }
}
