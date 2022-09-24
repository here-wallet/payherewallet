import { Wallet } from "@near-wallet-selector/core";
import { KeyPair, utils } from "near-api-js";
import uuid4 from "uuid4";
import Api from "./api";

const BOATLOAD_OF_GAS = utils.format.parseNearAmount("0.00000000003")!;

class Account {
  api = new Api();

  constructor(readonly wallet: Wallet) {}

  getDeviceID() {
    const id = window.localStorage.getItem("deviceID") ?? uuid4();
    window.localStorage.setItem("deviceID", id);
    return id;
  }

  async sendMoney(phone: string, amount: string, receiver: string) {
    const account = (await this.wallet.getAccounts())[0].accountId;
    const { hash } = await this.api.getPhoneHash(phone);
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

  async receiveMoney() {
    // const result = await this.wallet.signAndSendTransaction({
    //   callbackUrl: [route, new URLSearchParams(query)].join("?"),
    //   receiverId: process.env.REACT_APP_CONTRACT,
    //   actions: [
    //     {
    //       type: "FunctionCall",
    //       params: {
    //         methodName: "send_near_to_phone",
    //         args: { phone: hash },
    //         gas: MULTISIG_GAS.toString(),
    //         deposit: utils.format.parseNearAmount(amount) ?? "1",
    //       },
    //     },
    //   ],
    // });
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

  getKeypair() {
    const item = window.localStorage.getItem("payherewallet");
    const keypair = item
      ? KeyPair.fromString(item)
      : KeyPair.fromRandom("ed25519");

    window.localStorage.setItem("payherewallet", keypair.toString());
    return keypair;
  }

  async logout() {
    await this.wallet.signOut();
    this.api.logout();
    window.localStorage.setItem("payherewallet", "");
  }
}

export default Account;
