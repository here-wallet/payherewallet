interface AuthRequest {
  near_account_id: string;
  public_key: string;
  account_sign: string;
  device_id: string;
}

export interface SmsRequest {
  amount: string;
  send_to_phone: string;
  transaction_hash: string;
  near_account_id: string;
  contact_name_to: string;
  contact_name_from: string;
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

  async sendSms(request: SmsRequest) {
    await this.fetch("phone/send_near", {
      method: "POST",
      body: JSON.stringify(request),
    });
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
