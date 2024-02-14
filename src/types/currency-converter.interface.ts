import { StableCoins } from 'src/constant';
import { TemporaryStorage } from 'src/utils/temporary-storage';

export type CurrencyApiPayload = {
  address?: string;
  token?: string;
};

export abstract class CurrencyConverter {
  abstract isValidCurrencyRateProvider(payload: CurrencyApiPayload): boolean;

  abstract getUSDEqualRequest(
    payload: CurrencyApiPayload,
  ): Promise<number | null>;

  constructor(readonly currencyRateStorage: TemporaryStorage) {}

  async getUSDEqual(payload: CurrencyApiPayload) {
    const isValidPayload = this.isValidCurrencyRateProvider(payload);
    if (!isValidPayload) {
      throw new Error('Invalid payload');
    }

    const isStableCoin = StableCoins.includes(payload.token);
    if (isStableCoin) {
      return 1;
    }

    let price = await this.getCachedPrice(payload);

    if (price) {
      return price;
    }

    price = await this.getUSDEqualRequest(payload);

    if (!price) {
      return;
    }

    await this.cachePrice(payload, price);

    return price;
  }

  private async getCachedPrice(payload: CurrencyApiPayload) {
    let price = +(await this.currencyRateStorage.get(
      payload.address,
      payload.token,
    ));

    if (Number.isNaN(price)) {
      return;
    }
    return price;
  }

  private async cachePrice(payload: CurrencyApiPayload, price: number) {
    await this.currencyRateStorage.set(payload.address, String(price));
    await this.currencyRateStorage.set(payload.token, String(price));
  }
}
