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

class AuthStorage {
  STORAGE_KEY = "payherewallet:token";

  setToken(token: string | null) {
    localStorage.setItem(this.STORAGE_KEY, token ? token : "");
  }

  getToken() {
    return localStorage.getItem(this.STORAGE_KEY);
  }
}

class Api {
  private storage = new AuthStorage();
  private endpoint = "https://api.herewallet.app";

  get isAuth() {
    return !!this.storage.getToken();
  }

  logout() {
    this.storage.setToken(null);
  }

  async fetch(route: string, request: RequestInit) {
    const res = await fetch(`${this.endpoint}/api/v1/${route}`, {
      ...request,
      headers: {
        ...request.headers,
        Authorization: this.storage.getToken() ?? "",
      },
    });

    return await res.json();
  }

  async auth(request: AuthRequest) {
    const data = await this.fetch("user/auth", {
      method: "POST",
      body: JSON.stringify(request),
    });

    this.storage.setToken(data.token);
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

  async sendPhone(phone: string) {
    const data = await this.fetch("phone/send_code", {
      method: "POST",
      body: JSON.stringify({ phone }),
    });

    return data.phone_number_id;
  }
}

export default Api;
