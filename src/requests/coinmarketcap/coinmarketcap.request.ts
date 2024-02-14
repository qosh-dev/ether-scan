import axios from 'axios';
import { CurrencyApiPayload, CurrencyConverter } from 'src/types/currency-converter.interface';
import { TemporaryStorage } from 'src/utils/temporary-storage';
import { USDEqualResponse } from './coinmarketcap.types';

export class CoinmarketcapRequest extends CurrencyConverter {
  constructor(
    readonly token: string,
    readonly currencyRateStorage: TemporaryStorage,
  ) {
    super(currencyRateStorage);
  }

  async getUSDEqualRequest(
    payload: CurrencyApiPayload,
  ): Promise<number | null> {
    const url = new URL(
      'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest',
    );
    url.searchParams.append('symbol', payload.token);
    url.searchParams.append('convert', 'USD');

    const response = await axios.get<USDEqualResponse>(url.toString(), {
      headers: {
        'X-CMC_PRO_API_KEY': this.token,
      },
      timeout: 10000,
    });

    return response.data.data[payload.token]?.quote?.USD?.price;
  }

  isValidCurrencyRateProvider(payload: CurrencyApiPayload): boolean {
    if (payload.token && payload.token.startsWith('Visit')) return false;
    return true;
  }
}
