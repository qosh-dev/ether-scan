export type USDEqualResponse = {
  status: {
    timestamp: string;
    error_code: 0 | 1;
    error_message?: string;
    elapsed: number;
    credit_count: number;
    notice?: string;
  };
  data: {
    [n in string]?: {
      id: number;
      name: string;
      symbol: string;
      slug: string;
      num_market_pairs: number;
      date_added: string;
      tags: string[];
      max_supply: number;
      circulating_supply: number;
      total_supply: number;
      platform: {
        id: number;
        name: string;
        symbol: string;
        slug: string;
        token_address: string;
      };
      is_active: number;
      infinite_supply: boolean;
      cmc_rank: number;
      is_fiat: number;
      self_reported_circulating_supply: number;
      self_reported_market_cap: number;
      tvl_ratio?: string;
      last_updated: string;
      quote?: {
        [n in string]?: {
          price: number;
          volume_24h: number;
          volume_change_24h: number;
          percent_change_1h: number;
          percent_change_24h: number;
          percent_change_7d: number;
          percent_change_30d: number;
          percent_change_60d: number;
          percent_change_90d: number;
          market_cap: number;
          market_cap_dominance: number;
          fully_diluted_market_cap: number;
          tvl?: string;
          last_updated: string
        };
      };
    };
  };
};
