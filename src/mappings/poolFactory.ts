import { ZERO_BD, ZERO, FX_ASSET_AGGREGATORS, VAULT_ADDRESS, ZERO_ADDRESS, ProtocolFeeType } from './helpers/constants';
import {
  getPoolTokenManager,
  getPoolTokens,
  isManagedPool,
  PoolType,
  setPriceRateProviders,
} from './helpers/pools';

import {
  newPoolEntity,
  createPoolTokenEntity,
  scaleDown,
  getBalancerSnapshot,
  tokenToDecimal,
  stringToBytes,
  bytesToAddress,
  getProtocolFeeCollector,
  getToken,
  getFXOracle,
} from './helpers/misc';
import { updatePoolWeights } from './helpers/weighted';
import { BigInt, Address, Bytes, ethereum } from '@graphprotocol/graph-ts';
import { PoolCreated } from '../types/WeightedPoolFactory/WeightedPoolFactory';
import { AaveLinearPoolCreated } from '../types/AaveLinearPoolV3Factory/AaveLinearPoolV3Factory';
import { ProtocolIdRegistered } from '../types/ProtocolIdRegistry/ProtocolIdRegistry';
import { Balancer, Pool, PoolContract, ProtocolIdData } from '../types/schema';
import { KassandraPoolCreated } from '../types/ManagedKassandraPoolControllerFactory/ManagedKassandraPoolControllerFactory';
// datasource
import { OffchainAggregator, WeightedPool as WeightedPoolTemplate } from '../types/templates';
import { WeightedPoolV2 as WeightedPoolV2Template } from '../types/templates';
import { WeightedPool2Tokens as WeightedPool2TokensTemplate } from '../types/templates';
import { ManagedPool as ManagedPoolTemplate } from '../types/templates';
import { WeightedPool } from '../types/templates/WeightedPool/WeightedPool';
import { WeightedPoolV2 } from '../types/templates/WeightedPoolV2/WeightedPoolV2';
import { StablePool } from '../types/templates/StablePool/StablePool';
import { ConvergentCurvePool } from '../types/templates/ConvergentCurvePool/ConvergentCurvePool';
import { Assimilator } from '../types/FXPoolDeployer/Assimilator';
import { ChainlinkPriceFeed } from '../types/FXPoolDeployer/ChainlinkPriceFeed';
import { Transfer } from '../types/Vault/ERC20';
import { handleTransfer, setPriceRateProvider } from './poolController';
import { ComposableStablePool } from '../types/ComposableStablePoolFactory/ComposableStablePool';

function createWeightedLikePool(event: PoolCreated, poolType: string, poolTypeVersion: i32 = 1): string | null {
  let poolAddress: Address = event.params.pool;
  let poolContract = WeightedPool.bind(poolAddress);

  let poolIdCall = poolContract.try_getPoolId();
  let poolId = poolIdCall.value;

  let swapFeeCall = poolContract.try_getSwapFeePercentage();
  let swapFee = swapFeeCall.value;

  let ownerCall = poolContract.try_getOwner();
  let owner = ownerCall.value;

  let pool = handleNewPool(event, poolId, swapFee);
  pool.poolType = poolType;
  pool.poolTypeVersion = poolTypeVersion;
  pool.owner = owner;

  let tokens = getPoolTokens(poolId);
  if (tokens == null) return null;
  pool.tokensList = tokens;

  if (isManagedPool(pool)) {
    pool.totalAumFeeCollectedInBPT = ZERO_BD;
  }

  // Get protocol fee via on-chain calls since ProtocolFeePercentageCacheUpdated
  // event is emitted before the PoolCreated
  if ((poolType == PoolType.Weighted && poolTypeVersion >= 2) || isManagedPool(pool)) {
    let weightedContract = WeightedPoolV2.bind(poolAddress);

    let protocolSwapFee = weightedContract.try_getProtocolFeePercentageCache(BigInt.fromI32(ProtocolFeeType.Swap));
    let protocolYieldFee = weightedContract.try_getProtocolFeePercentageCache(BigInt.fromI32(ProtocolFeeType.Yield));
    let protocolAumFee = weightedContract.try_getProtocolFeePercentageCache(BigInt.fromI32(ProtocolFeeType.Aum));

    pool.protocolSwapFeeCache = protocolSwapFee.reverted ? null : scaleDown(protocolSwapFee.value, 18);
    pool.protocolYieldFeeCache = protocolYieldFee.reverted ? null : scaleDown(protocolYieldFee.value, 18);
    pool.protocolAumFeeCache = protocolAumFee.reverted ? null : scaleDown(protocolAumFee.value, 18);
  }

  pool.save();

  handleNewPoolTokens(pool, tokens);

  // Load pool with initial weights
  updatePoolWeights(poolId.toHexString());

  // Create PriceRateProvider entities for WeightedPoolV2+
  if (poolType == PoolType.Weighted && poolTypeVersion >= 2) {
    setPriceRateProviders(poolId.toHex(), poolAddress, tokens);
  }

  return poolId.toHexString();
}

export function handleNewWeightedPool(event: PoolCreated): void {
  const pool = createWeightedLikePool(event, PoolType.Weighted);
  if (pool == null) return;
  WeightedPoolTemplate.create(event.params.pool);
}

export function handleNewWeightedPoolV2(event: PoolCreated): void {
  const pool = createWeightedLikePool(event, PoolType.Weighted, 2);
  if (pool == null) return;
  WeightedPoolV2Template.create(event.params.pool);
}

export function handleNewWeightedPoolV3(event: PoolCreated): void {
  const pool = createWeightedLikePool(event, PoolType.Weighted, 3);
  if (pool == null) return;
  WeightedPoolV2Template.create(event.params.pool);
}

export function handleNewWeightedPoolV4(event: PoolCreated): void {
  const pool = createWeightedLikePool(event, PoolType.Weighted, 4);
  if (pool == null) return;
  WeightedPoolV2Template.create(event.params.pool);
}

export function handleNewWeighted2TokenPool(event: PoolCreated): void {
  createWeightedLikePool(event, PoolType.Weighted);
  WeightedPool2TokensTemplate.create(event.params.pool);
}

export function handleNewLiquidityBootstrappingPool(event: PoolCreated): void {
  const pool = createWeightedLikePool(event, PoolType.LiquidityBootstrapping);
  if (pool == null) return;
  WeightedPoolTemplate.create(event.params.pool);
}

export function handleNewManagedPoolV2(event: PoolCreated): void {
  const pool = createWeightedLikePool(event, PoolType.Managed, 2);
  if (pool == null) return;
  ManagedPoolTemplate.create(event.params.pool);
}

export function handleNewManagedKassandraPool(event: KassandraPoolCreated): void {
  const pool = Pool.load(event.params.vaultPoolId.toHexString());
  if (pool == null) return;
  pool.poolType = PoolType.KassandraManaged;
  pool.save();
}

function createStableLikePool(event: PoolCreated, poolType: string, poolTypeVersion: i32 = 1): string | null {
  let poolAddress: Address = event.params.pool;
  let poolContract = StablePool.bind(poolAddress);

  let poolIdCall = poolContract.try_getPoolId();
  let poolId = poolIdCall.value;

  let swapFeeCall = poolContract.try_getSwapFeePercentage();
  let swapFee = swapFeeCall.value;

  let ownerCall = poolContract.try_getOwner();
  let owner = ownerCall.value;

  let pool = handleNewPool(event, poolId, swapFee);
  pool.poolType = poolType;
  pool.poolTypeVersion = poolTypeVersion;
  pool.owner = owner;

  let tokens = getPoolTokens(poolId);
  if (tokens == null) return null;
  pool.tokensList = tokens;

  // Get protocol fee via on-chain calls since ProtocolFeePercentageCacheUpdated
  // event is emitted before the PoolCreated
  if (poolType == PoolType.ComposableStable) {
    let composableContract = ComposableStablePool.bind(poolAddress);

    let protocolSwapFee = composableContract.try_getProtocolFeePercentageCache(BigInt.fromI32(ProtocolFeeType.Swap));
    let protocolYieldFee = composableContract.try_getProtocolFeePercentageCache(BigInt.fromI32(ProtocolFeeType.Yield));
    let protocolAumFee = composableContract.try_getProtocolFeePercentageCache(BigInt.fromI32(ProtocolFeeType.Aum));

    pool.protocolSwapFeeCache = protocolSwapFee.reverted ? null : scaleDown(protocolSwapFee.value, 18);
    pool.protocolYieldFeeCache = protocolYieldFee.reverted ? null : scaleDown(protocolYieldFee.value, 18);
    pool.protocolAumFeeCache = protocolAumFee.reverted ? null : scaleDown(protocolAumFee.value, 18);
  }

  pool.save();

  handleNewPoolTokens(pool, tokens);

  return poolId.toHexString();
}


export function handleLinearPoolProtocolId(event: AaveLinearPoolCreated): void {
  let poolAddress = event.params.pool;
  let poolContract = PoolContract.load(poolAddress.toHexString());
  if (poolContract == null) return;

  let pool = Pool.load(poolContract.pool) as Pool;
  pool.protocolId = event.params.protocolId.toI32();
  const protocolIdData = ProtocolIdData.load(event.params.protocolId.toString());
  pool.protocolIdData = protocolIdData ? protocolIdData.id : null;
  pool.save();
}

function findOrInitializeVault(): Balancer {
  let vault: Balancer | null = Balancer.load('2');
  if (vault != null) return vault;

  // if no vault yet, set up blank initial
  vault = new Balancer('2');
  vault.poolCount = 0;
  vault.totalLiquidity = ZERO_BD;
  vault.totalSwapVolume = ZERO_BD;
  vault.totalSwapFee = ZERO_BD;
  vault.totalSwapCount = ZERO;

  // set up protocol fees collector
  vault.protocolFeesCollector = getProtocolFeeCollector();

  return vault;
}

function handleNewPool(event: PoolCreated, poolId: Bytes, swapFee: BigInt): Pool {
  let poolAddress: Address = event.params.pool;

  let pool = Pool.load(poolId.toHexString());
  if (pool == null) {
    pool = newPoolEntity(poolId.toHexString());

    pool.swapFee = scaleDown(swapFee, 18);
    pool.createTime = event.block.timestamp.toI32();
    pool.address = poolAddress;
    pool.factory = event.address;
    pool.oracleEnabled = false;
    pool.tx = event.transaction.hash;
    pool.swapEnabled = true;
    pool.swapEnabledInternal = true;
    pool.isPaused = false;

    let bpt = getToken(poolAddress);

    pool.name = bpt.name;
    pool.symbol = bpt.symbol;

    pool.save();

    let vault = findOrInitializeVault();
    vault.poolCount += 1;
    vault.save();

    let vaultSnapshot = getBalancerSnapshot(vault.id, event.block.timestamp.toI32());
    vaultSnapshot.poolCount += 1;
    vaultSnapshot.save();
  }

  let poolContract = PoolContract.load(poolAddress.toHexString());
  if (poolContract == null) {
    poolContract = new PoolContract(poolAddress.toHexString());
    poolContract.pool = poolId.toHexString();
    poolContract.save();
  }

  return pool;
}

function handleNewPoolTokens(pool: Pool, tokens: Bytes[]): void {
  let tokensAddresses = changetype<Address[]>(tokens);

  for (let i: i32 = 0; i < tokens.length; i++) {
    let poolId = stringToBytes(pool.id);
    let assetManager = getPoolTokenManager(poolId, tokens[i]);

    if (!assetManager) continue;

    createPoolTokenEntity(pool, tokensAddresses[i], i, assetManager);
  }
}

export function handleProtocolIdRegistryOrRename(event: ProtocolIdRegistered): void {
  let protocol = ProtocolIdData.load(event.params.protocolId.toString());

  if (protocol == null) {
    protocol = new ProtocolIdData(event.params.protocolId.toString());
    protocol.name = event.params.name;
  } else {
    protocol.name = event.params.name;
  }
  protocol.save();
}
