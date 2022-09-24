import { Wallet } from "@near-wallet-selector/core";
import { KeyPair, utils } from "near-api-js";
import { MULTISIG_GAS } from "near-api-js/lib/account_multisig";
import { base_encode } from "near-api-js/lib/utils/serialize";
import uuid4 from "uuid4";
import Api from "./api";

class Account {
  api = new Api();

  constructor(readonly wallet: Wallet) {}

  initialize() {
    const authKey = new URLSearchParams(window.location.search).get("auth");
    const base = window.location.origin + window.location.pathname;
    // window.history.pushState({}, document.title, base);

    if (authKey != null) {
      this.auth(authKey);
      return;
    }

    if (this.api.isAuth === false) {
      window.localStorage.setItem("payherewallet", "");
      this.login();
      return;
    }
  }

  async auth(authKey: string) {
    const keyPair = this.getKeypair();
    if (keyPair == null) return;

    const publicKey = keyPair.getPublicKey().toString();
    if (authKey !== publicKey) return;

    const account = (await this.wallet.getAccounts())[0].accountId;
    const deviceID = this.getDeviceID();

    const uint8arr = new Uint8Array(Buffer.from(account + deviceID, "utf-8"));
    const accountSign = base_encode(keyPair.sign(uint8arr).signature);

    await this.api.auth({
      device_id: deviceID,
      near_account_id: account,
      public_key: publicKey,
      account_sign: accountSign,
    });
  }

  getDeviceID() {
    const id = window.localStorage.getItem("deviceID") ?? uuid4();
    window.localStorage.setItem("deviceID", id);
    return id;
  }

  async login() {
    const keyPair = this.getKeypair();
    const account = (await this.wallet.getAccounts())[0];

    if (keyPair == null || account == null) return;
    const publicKey = keyPair.getPublicKey().toString();
    const base = window.location.origin + window.location.pathname;

    this.wallet.signAndSendTransaction({
      callbackUrl: `${base}?auth=${publicKey}`,
      receiverId: account.accountId,
      actions: [
        {
          type: "AddKey",
          params: {
            publicKey: publicKey.split(":")[1],
            accessKey: {
              permission: {
                receiverId: process.env.REACT_APP_CONTRACT!,
                allowance: utils.format.parseNearAmount("0.25")!,
                methodNames: ["send_near_to_phone", "receive_payments"],
              },
              nonce: 1,
            },
          },
        },
      ],
    });
  }

  async sendMoney(
    phone: string,
    amount: string,
    sender: string,
    receiver: string
  ) {
    const account = (await this.wallet.getAccounts())[0].accountId;
    const { hash } = await this.api.getPhoneHash(phone);
    const query = {
      amount,
      contact_name_from: sender,
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
            gas: MULTISIG_GAS.toString(),
            deposit: utils.format.parseNearAmount(amount) ?? "1",
          },
        },
      ],
    });

    if (result == null) return;
    await this.api.sendSms({
      transaction_hash: result.transaction_outcome.id,
      ...query,
    });
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
