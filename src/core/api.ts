export interface SmsRequest {
  amount: string;
  token?: string;
  nft?: string;
  send_to_phone: string;
  transaction_hash: string;
  near_account_id: string;
  comment: string;
}

export interface NFTModel {
  url: string;
  contract: {
    base_uri: string;
    contract_id: string;
    name: string;
  };
  metadata: {
    media: string;
    token_id: string;
  };
}

export interface FTModel {
  name: string;
  symbol: string;
  icon: string;
  contract_id: string;
  currency: number;
  token_id: number;
  description: string;
  decimal: number;
  amount: number;
  usd_rate: number;
  usd_rate_yesterday: number;
}

export enum SmsStatus {
  undelivered = "undelivered",
  delivered = "delivered",
  sent = "sent",
  queued = "queued",
  pending = "pending",
}

class Api {
  private endpoint = "https://api.herewallet.app";

  async fetch(route: string, request: RequestInit) {
    const res = await fetch(`${this.endpoint}/api/v1/${route}`, {
      ...request,
      headers: {
        ...request.headers,
      },
    });

    if (res.status >= 200 && res.status <= 300) {
      return await res.json();
    }

    const data = await res.text();
    throw Error(data);
  }

  async getPhoneHash(phone: string) {
    return this.fetch(`phone/calc_phone_hash?phone=${phone}`, {
      method: "GET",
    });
  }

  async sendPhone(phone: string, account: string) {
    const data = await this.fetch("phone/send_code", {
      method: "POST",
      body: JSON.stringify({ phone, near_account_id: account }),
    });

    return data.phone_number_id;
  }

  async loadTokens(account: string): Promise<FTModel[]> {
    const data = await this.fetch("user/fts?near_account_id=" + account, {
      method: "GET",
    });

    return data.fts;
  }

  async loadNFTs(account: string): Promise<NFTModel[]> {
    const data = await this.fetch("user/nfts?near_account_id=" + account, {
      method: "GET",
    });

    return data.nfts;
  }

  async checkSms(trx: string): Promise<{ status: SmsStatus }> {
    return await this.fetch(
      "phone/get_sms_by_transaction?transaction_hash=" + trx,
      { method: "GET" }
    );
  }

  async allocateNearAccount(code: string, phoneId: number, account: string) {
    const data = await this.fetch("phone/allocate_near_account_id", {
      method: "POST",
      body: JSON.stringify({
        code,
        near_account_id: account,
        phone_number_id: phoneId,
      }),
    });

    return data.phone_number_id;
  }
}

export default Api;
