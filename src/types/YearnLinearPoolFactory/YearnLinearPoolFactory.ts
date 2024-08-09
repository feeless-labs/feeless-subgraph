// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt
} from "@graphprotocol/graph-ts";

export class FactoryDisabled extends ethereum.Event {
  get params(): FactoryDisabled__Params {
    return new FactoryDisabled__Params(this);
  }
}

export class FactoryDisabled__Params {
  _event: FactoryDisabled;

  constructor(event: FactoryDisabled) {
    this._event = event;
  }
}

export class PoolCreated extends ethereum.Event {
  get params(): PoolCreated__Params {
    return new PoolCreated__Params(this);
  }
}

export class PoolCreated__Params {
  _event: PoolCreated;

  constructor(event: PoolCreated) {
    this._event = event;
  }

  get pool(): Address {
    return this._event.parameters[0].value.toAddress();
  }
}

export class YearnLinearPoolCreated extends ethereum.Event {
  get params(): YearnLinearPoolCreated__Params {
    return new YearnLinearPoolCreated__Params(this);
  }
}

export class YearnLinearPoolCreated__Params {
  _event: YearnLinearPoolCreated;

  constructor(event: YearnLinearPoolCreated) {
    this._event = event;
  }

  get pool(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get protocolId(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }
}

export class YearnLinearPoolFactory__getCreationCodeContractsResult {
  value0: Address;
  value1: Address;

  constructor(value0: Address, value1: Address) {
    this.value0 = value0;
    this.value1 = value1;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromAddress(this.value0));
    map.set("value1", ethereum.Value.fromAddress(this.value1));
    return map;
  }
}

export class YearnLinearPoolFactory__getPauseConfigurationResult {
  value0: BigInt;
  value1: BigInt;

  constructor(value0: BigInt, value1: BigInt) {
    this.value0 = value0;
    this.value1 = value1;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromUnsignedBigInt(this.value0));
    map.set("value1", ethereum.Value.fromUnsignedBigInt(this.value1));
    return map;
  }
}

export class YearnLinearPoolFactory extends ethereum.SmartContract {
  static bind(address: Address): YearnLinearPoolFactory {
    return new YearnLinearPoolFactory("YearnLinearPoolFactory", address);
  }

  create(
    name: string,
    symbol: string,
    mainToken: Address,
    wrappedToken: Address,
    upperTarget: BigInt,
    swapFeePercentage: BigInt,
    owner: Address,
    protocolId: BigInt
  ): Address {
    let result = super.call(
      "create",
      "create(string,string,address,address,uint256,uint256,address,uint256):(address)",
      [
        ethereum.Value.fromString(name),
        ethereum.Value.fromString(symbol),
        ethereum.Value.fromAddress(mainToken),
        ethereum.Value.fromAddress(wrappedToken),
        ethereum.Value.fromUnsignedBigInt(upperTarget),
        ethereum.Value.fromUnsignedBigInt(swapFeePercentage),
        ethereum.Value.fromAddress(owner),
        ethereum.Value.fromUnsignedBigInt(protocolId)
      ]
    );

    return result[0].toAddress();
  }

  try_create(
    name: string,
    symbol: string,
    mainToken: Address,
    wrappedToken: Address,
    upperTarget: BigInt,
    swapFeePercentage: BigInt,
    owner: Address,
    protocolId: BigInt
  ): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "create",
      "create(string,string,address,address,uint256,uint256,address,uint256):(address)",
      [
        ethereum.Value.fromString(name),
        ethereum.Value.fromString(symbol),
        ethereum.Value.fromAddress(mainToken),
        ethereum.Value.fromAddress(wrappedToken),
        ethereum.Value.fromUnsignedBigInt(upperTarget),
        ethereum.Value.fromUnsignedBigInt(swapFeePercentage),
        ethereum.Value.fromAddress(owner),
        ethereum.Value.fromUnsignedBigInt(protocolId)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  getActionId(selector: Bytes): Bytes {
    let result = super.call("getActionId", "getActionId(bytes4):(bytes32)", [
      ethereum.Value.fromFixedBytes(selector)
    ]);

    return result[0].toBytes();
  }

  try_getActionId(selector: Bytes): ethereum.CallResult<Bytes> {
    let result = super.tryCall("getActionId", "getActionId(bytes4):(bytes32)", [
      ethereum.Value.fromFixedBytes(selector)
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBytes());
  }

  getAuthorizer(): Address {
    let result = super.call("getAuthorizer", "getAuthorizer():(address)", []);

    return result[0].toAddress();
  }

  try_getAuthorizer(): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "getAuthorizer",
      "getAuthorizer():(address)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  getCreationCode(): Bytes {
    let result = super.call("getCreationCode", "getCreationCode():(bytes)", []);

    return result[0].toBytes();
  }

  try_getCreationCode(): ethereum.CallResult<Bytes> {
    let result = super.tryCall(
      "getCreationCode",
      "getCreationCode():(bytes)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBytes());
  }

  getCreationCodeContracts(): YearnLinearPoolFactory__getCreationCodeContractsResult {
    let result = super.call(
      "getCreationCodeContracts",
      "getCreationCodeContracts():(address,address)",
      []
    );

    return new YearnLinearPoolFactory__getCreationCodeContractsResult(
      result[0].toAddress(),
      result[1].toAddress()
    );
  }

  try_getCreationCodeContracts(): ethereum.CallResult<
    YearnLinearPoolFactory__getCreationCodeContractsResult
  > {
    let result = super.tryCall(
      "getCreationCodeContracts",
      "getCreationCodeContracts():(address,address)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new YearnLinearPoolFactory__getCreationCodeContractsResult(
        value[0].toAddress(),
        value[1].toAddress()
      )
    );
  }

  getLastCreatedPool(): Address {
    let result = super.call(
      "getLastCreatedPool",
      "getLastCreatedPool():(address)",
      []
    );

    return result[0].toAddress();
  }

  try_getLastCreatedPool(): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "getLastCreatedPool",
      "getLastCreatedPool():(address)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  getPauseConfiguration(): YearnLinearPoolFactory__getPauseConfigurationResult {
    let result = super.call(
      "getPauseConfiguration",
      "getPauseConfiguration():(uint256,uint256)",
      []
    );

    return new YearnLinearPoolFactory__getPauseConfigurationResult(
      result[0].toBigInt(),
      result[1].toBigInt()
    );
  }

  try_getPauseConfiguration(): ethereum.CallResult<
    YearnLinearPoolFactory__getPauseConfigurationResult
  > {
    let result = super.tryCall(
      "getPauseConfiguration",
      "getPauseConfiguration():(uint256,uint256)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new YearnLinearPoolFactory__getPauseConfigurationResult(
        value[0].toBigInt(),
        value[1].toBigInt()
      )
    );
  }

  getPoolVersion(): string {
    let result = super.call("getPoolVersion", "getPoolVersion():(string)", []);

    return result[0].toString();
  }

  try_getPoolVersion(): ethereum.CallResult<string> {
    let result = super.tryCall(
      "getPoolVersion",
      "getPoolVersion():(string)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toString());
  }

  getProtocolFeePercentagesProvider(): Address {
    let result = super.call(
      "getProtocolFeePercentagesProvider",
      "getProtocolFeePercentagesProvider():(address)",
      []
    );

    return result[0].toAddress();
  }

  try_getProtocolFeePercentagesProvider(): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "getProtocolFeePercentagesProvider",
      "getProtocolFeePercentagesProvider():(address)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  getVault(): Address {
    let result = super.call("getVault", "getVault():(address)", []);

    return result[0].toAddress();
  }

  try_getVault(): ethereum.CallResult<Address> {
    let result = super.tryCall("getVault", "getVault():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  isDisabled(): boolean {
    let result = super.call("isDisabled", "isDisabled():(bool)", []);

    return result[0].toBoolean();
  }

  try_isDisabled(): ethereum.CallResult<boolean> {
    let result = super.tryCall("isDisabled", "isDisabled():(bool)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  isPoolFromFactory(pool: Address): boolean {
    let result = super.call(
      "isPoolFromFactory",
      "isPoolFromFactory(address):(bool)",
      [ethereum.Value.fromAddress(pool)]
    );

    return result[0].toBoolean();
  }

  try_isPoolFromFactory(pool: Address): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "isPoolFromFactory",
      "isPoolFromFactory(address):(bool)",
      [ethereum.Value.fromAddress(pool)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  version(): string {
    let result = super.call("version", "version():(string)", []);

    return result[0].toString();
  }

  try_version(): ethereum.CallResult<string> {
    let result = super.tryCall("version", "version():(string)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toString());
  }
}

export class ConstructorCall extends ethereum.Call {
  get inputs(): ConstructorCall__Inputs {
    return new ConstructorCall__Inputs(this);
  }

  get outputs(): ConstructorCall__Outputs {
    return new ConstructorCall__Outputs(this);
  }
}

export class ConstructorCall__Inputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }

  get vault(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get protocolFeeProvider(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get queries(): Address {
    return this._call.inputValues[2].value.toAddress();
  }

  get factoryVersion(): string {
    return this._call.inputValues[3].value.toString();
  }

  get poolVersion(): string {
    return this._call.inputValues[4].value.toString();
  }

  get initialPauseWindowDuration(): BigInt {
    return this._call.inputValues[5].value.toBigInt();
  }

  get bufferPeriodDuration(): BigInt {
    return this._call.inputValues[6].value.toBigInt();
  }
}

export class ConstructorCall__Outputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class CreateCall extends ethereum.Call {
  get inputs(): CreateCall__Inputs {
    return new CreateCall__Inputs(this);
  }

  get outputs(): CreateCall__Outputs {
    return new CreateCall__Outputs(this);
  }
}

export class CreateCall__Inputs {
  _call: CreateCall;

  constructor(call: CreateCall) {
    this._call = call;
  }

  get name(): string {
    return this._call.inputValues[0].value.toString();
  }

  get symbol(): string {
    return this._call.inputValues[1].value.toString();
  }

  get mainToken(): Address {
    return this._call.inputValues[2].value.toAddress();
  }

  get wrappedToken(): Address {
    return this._call.inputValues[3].value.toAddress();
  }

  get upperTarget(): BigInt {
    return this._call.inputValues[4].value.toBigInt();
  }

  get swapFeePercentage(): BigInt {
    return this._call.inputValues[5].value.toBigInt();
  }

  get owner(): Address {
    return this._call.inputValues[6].value.toAddress();
  }

  get protocolId(): BigInt {
    return this._call.inputValues[7].value.toBigInt();
  }
}

export class CreateCall__Outputs {
  _call: CreateCall;

  constructor(call: CreateCall) {
    this._call = call;
  }

  get value0(): Address {
    return this._call.outputValues[0].value.toAddress();
  }
}

export class DisableCall extends ethereum.Call {
  get inputs(): DisableCall__Inputs {
    return new DisableCall__Inputs(this);
  }

  get outputs(): DisableCall__Outputs {
    return new DisableCall__Outputs(this);
  }
}

export class DisableCall__Inputs {
  _call: DisableCall;

  constructor(call: DisableCall) {
    this._call = call;
  }
}

export class DisableCall__Outputs {
  _call: DisableCall;

  constructor(call: DisableCall) {
    this._call = call;
  }
}
