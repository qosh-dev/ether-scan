import { WatchWallet } from "src/types/tokentx.type";

export class WatchingWalletList {
  items: WatchingWallet[] = [];

  public get length(): number {
    return this.items.length;
  }

  static fromMany(wallets: WatchWallet[]) {
    const instance = new WatchingWalletList();
    for (let wallet of wallets) {
      instance.items.push(new WatchingWallet(wallet.address, wallet.name));
    }
    return instance;
  }
}

export class WatchingWallet {
  address: string;
  name: string;
  sharedBlocks: string[] = [];

  constructor(address: string, name: string) {
    this.address = address;
    this.name = name;
  }

  updateSharedBlocks(newBlockNumbers: string[]) {
    this.sharedBlocks.push(...newBlockNumbers);
  }

  blockExist(blockNumber: string) {
    return this.sharedBlocks.includes(blockNumber);
  }
}
