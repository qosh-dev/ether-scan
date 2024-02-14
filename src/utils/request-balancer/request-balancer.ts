import { Logger } from '@nestjs/common';
import { AxiosError } from 'axios';
import { BaseUtils } from '../base.utils';
import { Iterator } from './iterator';
import {
  RequestBalancerMethodArgument,
  RequestBalancerMethodReturn,
} from './request-balancer.type';

/**
 * @class RequestBalancer
 * @description Distributes requests across multiple providers, handling errors and retries.
 * @template T Generic type for the provider sources.
 * @example
 * const balancer = new RequestBalancer([provider1, provider2, provider3]);
 * const responses = await balancer.request('getSomeDataById', 1, 2, 3, 4);
 */
export class RequestBalancer<T> {
  constructor(private readonly sources: T[]) {}

  async request<M extends keyof T>(
    methodName: M,
    ...args: RequestBalancerMethodArgument<T, M>[]
  ) {
    const responses = await Promise.all(
      args
        .map(async (argument) => {
          const iterator = new Iterator(this.sources);
          const response = await this._request(methodName, argument, iterator);
          return response;
        })
        .filter((v) => v !== undefined),
    );
    return responses;
  }

  private async _request<M extends keyof T>(
    methodName: M,
    argument: RequestBalancerMethodArgument<M, T>,
    iterator: Iterator<T>,
  ): Promise<RequestBalancerMethodReturn<M, T>> {
    const provider = iterator.next();
    try {
      iterator.setUsed(provider);
      const response: RequestBalancerMethodReturn<M, T> = await provider[
        methodName as any
      ](argument);

      if (this.shouldUseNextProvider(response, iterator)) {
        return this._request(methodName, argument, iterator);
      }

      return response;
    } catch (error) {
      if (this.shouldRetryThisProviderOnError(error)) {
        await BaseUtils.wait(4000);
        return this._request(methodName, argument, iterator);
      }

      if (this.shouldUseNextProviderOnError(error)) {
        iterator.setUsed(provider);
        return this._request(methodName, argument, iterator);
      }

      console.error('Unhandled error in request:', error.message);
      Logger.error(error, 'REQUEST_BALANCER');
      return;
      // throw error; // Re-throw the original error for further handling
    }
  }

  private shouldUseNextProvider<M extends keyof T>(
    response: RequestBalancerMethodReturn<M, T>,
    iterator: Iterator<T>,
  ) {
    return !response && !iterator.isEachProviderUsed;
  }

  private shouldUseNextProviderOnError(error: AxiosError): boolean {
    return (
      error.message === 'Invalid payload' ||
      error.message === "'Max rate limit reached" ||
      error.message === "Max rate limit reached" ||
      (error.response && error.response.status === 400)
    );
  }

  private shouldRetryThisProviderOnError(error: AxiosError): boolean {
    return (
      (error.response && error.response.status === 429) ||
      error.message === 'socket hang up' ||
      error.message ===
        'Client network socket disconnected before secure TLS connection was established' ||
      error.code === 'ECONNABORTED'
    );
  }
}
