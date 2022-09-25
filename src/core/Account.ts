import { Wallet } from "@near-wallet-selector/core";
import BN from "bn.js";
import { makeObservable } from "mobx";
import { utils } from "near-api-js";
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

  async sendNFT(phone: string, nft: string, receiver: string) {
    const account = (await this.wallet.getAccounts())[0].accountId;
    const hash = await this.getPhoneHash(phone);
    const query = {
      nft,
      transactionHashes: "",
      near_account_id: account,
      send_to_phone: phone,
      comment: receiver,
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
              msg: hash,
              receiver_id: process.env.REACT_APP_CONTRACT,
              token_id: nftId,
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

  async sendMoney(phone: string, amount: string, receiver: string) {
    const account = (await this.wallet.getAccounts())[0].accountId;
    const hash = await this.getPhoneHash(phone);
    const query = {
      amount,
      transactionHashes: "",
      near_account_id: account,
      send_to_phone: phone,
      comment: receiver,
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
    return data;
  }

  async completeSendMoney() {
    const query = new URLSearchParams(window.location.search);
    const request = {
      amount: query.get("amount") ?? "",
      transaction_hash: query.get("transactionHashes") ?? "",
      near_account_id: query.get("near_account_id") ?? "",
      send_to_phone: query.get("send_to_phone") ?? "",
      comment: query.get("comment") ?? "",
    };

    await this.api.sendSms(request);
    return request;
  }

  async logout() {
    await this.wallet.signOut();
  }
}

export default Account;
