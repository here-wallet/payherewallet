import { Wallet } from "@near-wallet-selector/core";
import { makeObservable, observable, runInAction } from "mobx";
import { JsonRpcProvider } from "near-api-js/lib/providers";
import { utils } from "near-api-js";
import CryptoJS from "crypto-js";
import uuid4 from "uuid4";
import BN from "bn.js";

import { delay, showError } from "./utils";
import Api, { FTModel } from "./api";

const BOATLOAD_OF_GAS = utils.format.parseNearAmount("0.00000000003")!;

class Account {
  api = new Api();
  hashes: Record<string, string> = {};
  phone: string | null = null;

  tokens: FTModel[] = [];
  _isDispose = false;

  constructor(
    readonly accountId: string,
    readonly wallet: Wallet,
    readonly provider: JsonRpcProvider
  ) {
    makeObservable(this, {
      tokens: observable,
      phone: observable,
    });

    this._autoupdateTokens().catch(() => {
      showError("Load tokens error");
    });
  }

  dispose() {
    this._isDispose = true;
  }

  async updateTokens() {
    const data = await this.api.loadTokens(this.accountId);
    runInAction(() => {
      this.tokens = data;
    });
  }

  async _autoupdateTokens() {
    await this.updateTokens();
    if (this._isDispose) return;
    await delay(20000);
    if (this._isDispose) return;
    await this._autoupdateTokens();
  }

  getDeviceID() {
    const id = window.localStorage.getItem("deviceID") ?? uuid4();
    window.localStorage.setItem("deviceID", id);
    return id;
  }

  async setupPhone(phone: string) {
    this.phone = phone;
  }

  async unlinkPhone(phone: string) {
    const hash = await this.getPhoneHash(phone);
    const result = await this.wallet.signAndSendTransaction({
      callbackUrl: `${window.location.origin}/`,
      receiverId: process.env.REACT_APP_CONTRACT,
      actions: [
        {
          type: "FunctionCall",
          params: {
            methodName: "delete_phone",
            args: { phone: hash },
            gas: BOATLOAD_OF_GAS,
            deposit: "1",
          },
        },
      ],
    });

    if (result == null) {
      throw Error("Transaction hash is not defined");
    }

    return "/";
  }

  /** Memoize phone hash (+ prefix agnostic)*/
  async getPhoneHash(phone: string) {
    const formatted = "+" + phone.replace("+", "");

    if (this.hashes[formatted]) {
      return this.hashes[formatted];
    }

    const { hash } = await this.api.getPhoneHash(formatted);
    this.hashes[formatted] = hash;
    return hash;
  }

  async sendNFT(phone: string, nft: string, comment: string) {
    const account = (await this.wallet.getAccounts())[0].accountId;
    const hash = await this.getPhoneHash(phone);
    const query = {
      nft,
      transactionHashes: "",
      near_account_id: account,
      send_to_phone: phone,
      comment,
    };

    const [nftContract, nftId] = nft.split("#");
    const route = `${window.location.origin}/send/success`;
    const result = await this.wallet.signAndSendTransaction({
      callbackUrl: [route, new URLSearchParams(query)].join("?"),
      receiverId: nftContract,
      actions: [
        {
          type: "FunctionCall",
          params: {
            methodName: "nft_transfer_call",
            args: {
              token_id: nftId,
              receiver_id: process.env.REACT_APP_CONTRACT,
              comment: this.encodeComment(phone, comment),
              msg: hash,
            },
            gas: "300" + "0".repeat(12),
            deposit: "1",
          },
        },
      ],
    });

    if (result == null) {
      throw Error("Transaction hash is not defined");
    }

    query.transactionHashes = result.transaction_outcome.id;
    return ["/send/success", new URLSearchParams(query)].join("?");
  }

  async sentFingToken(
    phone: string,
    amount: string,
    token: FTModel,
    comment: string
  ) {
    const hash = await this.getPhoneHash(phone);
    const query = {
      amount,
      token: token.symbol,
      transactionHashes: "",
      near_account_id: this.accountId,
      send_to_phone: phone,
      comment,
    };

    const route = `${window.location.origin}/send/success`;
    const decimal = +("1" + "0".repeat(token.decimal));

    const result = await this.wallet.signAndSendTransaction({
      callbackUrl: [route, new URLSearchParams(query)].join("?"),
      receiverId: token.contract_id,
      actions: [
        {
          type: "FunctionCall",
          params: {
            methodName: "ft_transfer_call",
            args: {
              receiver_id: process.env.REACT_APP_CONTRACT,
              amount: (+amount * decimal).toString(),
              comment: this.encodeComment(phone, comment),
              msg: hash,
            },
            gas: "300" + "0".repeat(12),
            deposit: "1",
          },
        },
      ],
    });

    if (result == null) {
      throw Error("Transaction hash is not defined");
    }

    query.transactionHashes = result.transaction_outcome.id;
    return ["/send/success", new URLSearchParams(query)].join("?");
  }

  encodeComment(phone: string, msg: string) {
    const iv = CryptoJS.lib.WordArray.random(16);
    const encrypted = CryptoJS.AES.encrypt(msg, CryptoJS.SHA256(phone), {
      format: CryptoJS.format.Hex,
      mode: CryptoJS.mode.CBC,
      iv,
    });

    const base64 = iv
      .clone()
      .concat(encrypted.ciphertext)
      .toString(CryptoJS.enc.Base64);

    return base64;
  }

  async sendMoney(phone: string, amount: string, comment: string) {
    const hash = await this.getPhoneHash(phone);
    const query = {
      amount,
      transactionHashes: "",
      near_account_id: this.accountId,
      send_to_phone: phone,
      comment,
    };

    const route = `${window.location.origin}/send/success`;
    const result = await this.wallet.signAndSendTransaction({
      callbackUrl: [route, new URLSearchParams(query)].join("?"),
      receiverId: process.env.REACT_APP_CONTRACT,
      actions: [
        {
          type: "FunctionCall",
          params: {
            methodName: "send_near_to_phone",
            args: { phone: hash, comment: this.encodeComment(phone, comment) },
            deposit: utils.format.parseNearAmount(amount) ?? "1",
            gas: BOATLOAD_OF_GAS,
          },
        },
      ],
    });

    if (result == null) {
      throw Error("Transaction hash is not defined");
    }

    query.transactionHashes = result.transaction_outcome.id;
    return ["/send/success", new URLSearchParams(query)].join("?");
  }

  async loadReceived(phone: string) {
    const hash = await this.getPhoneHash(phone);
    const args = JSON.stringify({ phone: hash });

    const res = await this.provider.query<any>({
      request_type: "call_function",
      account_id: process.env.REACT_APP_CONTRACT,
      method_name: "get_transfers",
      args_base64: Buffer.from(args).toString("base64"),
      finality: "optimistic",
    });

    const data = JSON.parse(Buffer.from(res.result).toString());
    if (data == null) return null;

    const total: BN = data.reduce((acc: BN, { amount = 0 }) => {
      const [ceil, epart = 0] = amount.toString().split("e+");
      return acc.add(new BN.BN(ceil + "0".repeat(+epart)));
    }, new BN.BN(0));

    return { near: utils.format.formatNearAmount(total.toString()) };
  }

  async checkRegistration(phone: string) {
    const hash = await this.getPhoneHash(phone);
    const args = JSON.stringify({ phone: hash });

    const res = await this.provider.query<any>({
      request_type: "call_function",
      account_id: process.env.REACT_APP_CONTRACT,
      method_name: "get_account_id",
      args_base64: Buffer.from(args).toString("base64"),
      finality: "optimistic",
    });

    const data = JSON.parse(Buffer.from(res.result).toString());
    return data;
  }

  async logout() {
    await this.wallet.signOut();
  }
}

export default Account;
