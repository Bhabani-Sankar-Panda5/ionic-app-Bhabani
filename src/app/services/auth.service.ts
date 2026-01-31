import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private USE_MOCK_RESET_PASSWORD = false; // 🔴 turn OFF when backend is ready
  private _storage: Storage | null = null;
  private baseUrl = 'https://ars-steels-app-0fd20ff3663d.herokuapp.com'; // 🔹 replace with your backend URL

  constructor(
    private storage: Storage,
    private http: HttpClient   // ✅ ADD THIS
  ) {
    this.init();
  }

  // Initialize storage
  async init(): Promise<void> {
    this._storage = await this.storage.create();
  }

// -----------------------------
// VALIDATE PHONE NUMBER (API)
// -----------------------------
async validatePhone(mobile: string): Promise<boolean> {
  const payload = {
    mainPhoneNo: mobile
  };

  try {
    const response: any = await this.http
      .post(`${this.baseUrl}/api/validatePhone`, payload)
      .toPromise();
      console.log('Validate phone Succesess',response);

    // API should return token or success flag
    return !!response?.token;

  } catch (error) {
    console.error('Validate phone failed', error);
    return false;
  }
}



      // -----------------------------
    // VALIDATE SESSION WITH BACKEND
    // -----------------------------
    async validateSession(): Promise<'VALID' | 'INVALID'> {

      const token = await this._storage?.get('token');
      const sessionId = await this._storage?.get('sessionId');

      if (!token || !sessionId) {
        return 'INVALID';
      }

      // 🔴 STATIC LOGIC FOR NOW (replace with backend API later)
      // Assume session IDs starting with "OTP_SESSION_" are valid
      if (sessionId.startsWith('OTP_SESSION_') || sessionId.startsWith('SESSION_')) {
        return 'VALID';
      }

      return 'INVALID';
    }

    // -----------------------------
// CHECK PARTIAL SESSION STATE
// -----------------------------
async hasTokenButNoSession(): Promise<boolean> {
  const token = await this._storage?.get('token');
  const sessionId = await this._storage?.get('sessionId');

  return !!token && !sessionId;
}
    


  async isOtpRequired(): Promise<boolean> {
      const lastLoginDate = await this._storage?.get('loginDate');
      const today = this.getTodayDate();

      // First app open OR new day
      return lastLoginDate !== today;
  }

  async verifyOtp(otp: string): Promise<boolean> {
    // 🔴 Dummy OTP logic (replace with API later)
    return otp === '5656';
  }

  async markOtpVerified() {
    const today = this.getTodayDate();
    await this._storage?.set('loginDate', today);
  }


  // -----------------------------
  // Real Backend LOGIN (replace later with API)
  // -----------------------------
async login(credentials: { employeeId: string; password: string })
: Promise<{ token: string; isFirstLogin: boolean }> {

  const payload = {
    username: credentials.employeeId, // backend expects "username"
    password: credentials.password
  };
  //console.log('LOGIN PAYLOAD 👉', payload);

  try {
    const response: any = await this.http
      .post(`${this.baseUrl}/api/login`, payload)
      .toPromise();
      if (!response.token) {
        throw 'Invalid Employee ID or Password';
      }
      console.log('🔵 LOGIN API FULL RESPONSE 👉', response);
      console.log('🟡 isFirstLogin raw 👉', response.isFirstLogin);
      console.log(
          '🟢 isFirstLogin boolean 👉',
          response.isFirstLogin === 'Y'
        );

    // ✅ store session
    const sessionId = response.sessionId || ('SESSION_' + Date.now());
    await this.setSession(response.token, sessionId);

    return {
      token: response.token,
      isFirstLogin: response.isFirstLogin === 'Y'
    };

    // return {
    //     token: response.token,
    //     isFirstLogin: this.FORCE_FIRST_LOGIN
    //       ? true
    //       : response.isFirstLogin === 'Y'
    //   };

  } catch (error: any) {

    // 🔴 Backend sends 404 for invalid login
    if (error.status === 404) {
      throw 'Invalid Employee ID or Password';
    }

    throw 'Something went wrong. Please try again.';
  }
}

async resetPassword(username: string, newPassword: string): Promise<void> {

  // 🟡 MOCK MODE (NO BACKEND)
  if (this.USE_MOCK_RESET_PASSWORD) {
    console.log('🧪 MOCK reset password for:', username);
    console.log('🧪 New password:', newPassword);

    // simulate API delay
    await new Promise(res => setTimeout(res, 500));

    // pretend success
    return;
  }

  // 🔵 REAL BACKEND (later)
  const token = await this._storage?.get('token');

  const payload = {
    username,
    password: newPassword
  };

  const headers = {
    Authorization: `Bearer ${token}`
  };

  try {
    await this.http
      .post(`${this.baseUrl}/api/resetPwsd`, payload, { headers })
      .toPromise();

  } catch (error) {
    console.error('RESET PASSWORD API ERROR 👉', error);
    throw 'Password reset failed';
  }
}




  // -----------------------------
  // STORE TOKEN + TODAY DATE
  // -----------------------------
  async setSession(token: string, sessionId: string) {
      if (!token || !sessionId) {
        return;
      }

      const today = this.getTodayDate();
      await this._storage?.set('token', token);
      await this._storage?.set('sessionId', sessionId);
      await this._storage?.set('loginDate', today);
  }

  // -----------------------------
  // CHECK SESSION (APP START)
  // -----------------------------
  async isLoggedIn(): Promise<boolean> {
      const token = await this._storage?.get('token');
      const sessionId = await this._storage?.get('sessionId');

      if (!token || !sessionId) {
        return false;
      }

      return true;
  }

  async hasValidSession(): Promise<boolean> {
    const token = await this._storage?.get('token');
    const sessionId = await this._storage?.get('sessionId');

    if (!token || token === 'undefined') {
      return false;
    }

    if (!sessionId || sessionId === 'undefined') {
      return false;
    }

    return true;
  }

  // TEMP: Create session after OTP (replace with real API later)
    async createOtpSession() {
      const token = 'OTP_STATIC_TOKEN';
      const sessionId = 'OTP_SESSION_' + Date.now();

      await this.setSession(token, sessionId);
    }



  // -----------------------------
  // HELPER: TODAY DATE (YYYY-MM-DD)
  // -----------------------------
  private getTodayDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  async logout() {
    await this._storage?.remove('token');
    await this._storage?.remove('loginDate');
    await this._storage?.remove('sessionId');
  }

  async clearSession() {
    await this.logout();
  }
}
