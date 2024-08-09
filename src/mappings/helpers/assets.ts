// This file is automatically generated and contains assets from iotatestnet.
// Generate for other networks by running: yarn generate-assets [network].
// Supported networks are: arbitrum, goerli, mainnet, and polygon.

import { Address } from '@graphprotocol/graph-ts';

class Assets {
  public stableAssets: Address[];
  public pricingAssets: Address[];
  public fxAssetAggregators: Address[][];
}

export const USDC_ADDRESS = Address.fromString('0xc4FA42632fea08274ACDB5c0d9331285C01717Ba');
export const DAI_ADDRESS = Address.fromString('0x68EA743120BaCf2C277910700116Eb4b1C0643AA');
export const USDT_ADDRESS = Address.fromString('0xCa2DBF6Ba5f3252Fd758C113A8c48D6D77406CaC');

export const assets: Assets = {
  stableAssets: [
    Address.fromString('0xc4FA42632fea08274ACDB5c0d9331285C01717Ba'), // USDC
    Address.fromString('0x68EA743120BaCf2C277910700116Eb4b1C0643AA'), // DAI
    Address.fromString('0xCa2DBF6Ba5f3252Fd758C113A8c48D6D77406CaC'), // USDT
  ],
  pricingAssets: [
    Address.fromString('0xd8058dA2dF3FBaBC03Ad8Ca51cAB4AAa3614B209'), // WETH
    Address.fromString('0x553D8A5927FBA1c3eC05DdA667D6Cda3F5543d3a'), // WBTC
    Address.fromString('0x1D148Eb4C213e560a6bad71536b96AC5D6F1cDE3'), // wFLS
    Address.fromString('0xB2E0DfC4820cc55829C71529598530E177968613'), // wIOTA
  ],
  fxAssetAggregators: [
  ],
};
