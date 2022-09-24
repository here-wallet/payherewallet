import { Wallet } from "@near-wallet-selector/core";
import BN from "bn.js";
import { makeObservable } from "mobx";
import { KeyPair, utils } from "near-api-js";
import { JsonRpcProvider } from "near-api-js/lib/providers";
import uuid4 from "uuid4";
import Api from "./api";

const BOATLOAD_OF_GAS = utils.format.parseNearAmount("0.00000000003")!;

class Account {
  api = new Api();
  hashes: Record<string, string> = {};
  phone: string | null = null;

  constructor(
    readonly accountId: string,
    readonly wallet: Wallet,
    readonly provider: JsonRpcProvider
  ) {
    makeObservable(this, {});
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

  /** Memoize phone hash */
  async getPhoneHash(phone: string) {
    if (this.hashes[phone]) {
      return this.hashes[phone];
    }

    const { hash } = await this.api.getPhoneHash(phone);
    this.hashes[phone] = hash;
    return hash;
  }

  async sendMoney(phone: string, amount: string, receiver: string) {
    const account = (await this.wallet.getAccounts())[0].accountId;
    const hash = await this.getPhoneHash(phone);
    const query = {
      amount,
      transactionHashes: "",
      contact_name_from: account,
      contact_name_to: receiver,
      near_account_id: account,
      send_to_phone: phone,
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
            args: { phone: hash },
            gas: BOATLOAD_OF_GAS,
            deposit: utils.format.parseNearAmount(amount) ?? "1",
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

  async receiveMoney(phone: string) {
    const hash = await this.getPhoneHash(phone);
    const result = await this.wallet.signAndSendTransaction({
      callbackUrl: `${window.location.origin}/receive/success`,
      receiverId: process.env.REACT_APP_CONTRACT,
      actions: [
        {
          type: "FunctionCall",
          params: {
            methodName: "receive_payments",
            args: { phone: hash },
            gas: BOATLOAD_OF_GAS,
            deposit: "0",
          },
        },
      ],
    });

    if (result == null) {
      throw Error("Transaction hash is not defined");
    }

    return "/receive/success";
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
      console.log(ceil + "0".repeat(+epart));
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
    return this.accountId === data;
  }

  async completeSendMoney() {
    const query = new URLSearchParams(window.location.search);
    const request = {
      amount: query.get("amount") ?? "",
      transaction_hash: query.get("transactionHashes") ?? "",
      contact_name_from: query.get("contact_name_from") ?? "",
      contact_name_to: query.get("contact_name_to") ?? "",
      near_account_id: query.get("near_account_id") ?? "",
      send_to_phone: query.get("send_to_phone") ?? "",
    };

    await this.api.sendSms(request);
    return request;
  }

  async logout() {
    await this.wallet.signOut();
  }
}

export default Account;
