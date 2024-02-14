import axios from 'axios';
import { CurrencyApiPayload, CurrencyConverter } from 'src/types/currency-converter.interface';
import { TemporaryStorage } from 'src/utils/temporary-storage';

export class CoinGeckoRequest extends CurrencyConverter {
  constructor(readonly currencyRateStorage: TemporaryStorage) {
    super(currencyRateStorage);
  }

  async getUSDEqualRequest(
    payload: CurrencyApiPayload,
  ): Promise<number | null> {
    const url = new URL(
      'https://api.coingecko.com/api/v3/simple/token_price/ethereum',
    );
    url.searchParams.append('contract_addresses', payload.address);
    url.searchParams.append('vs_currencies', 'usd');
    const response = await axios.get(url.toString(), { timeout: 10000 });
    if (!response.data[payload.address]) {
      return null;
    }
    return response.data[payload.address]['usd'];
  }

  isValidCurrencyRateProvider(payload: CurrencyApiPayload): boolean {
    if (!payload.address) return false;
    if (payload.token.startsWith('Visit')) return false;
    return true;
  }
}
