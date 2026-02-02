import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private USE_MOCK_RESET_PASSWORD = false; // 🔴 turn OFF when backend is ready
  // private USE_MOCK_VALIDATE_USER = true; // 🔹 temporary for testing

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
// VALIDATE USER BY EMPLOYEE ID
// -----------------------------
async validateUser(empId: string): Promise<{
  valid: boolean;
  contactPhone?: string;
  isFirstLogin?: boolean;
  lastLogin?: string;
  sfEmployeeId?: string;
}> {
  try {
    const response: any = await this.http.get(
      `${this.baseUrl}/api/validateUser?key=${empId}`
    ).toPromise();

    if (response?.message === 'Valid User') {
      return {
        valid: true,
        contactPhone: response.contactPhone,
        isFirstLogin: response.isFirstLogin === 'Y',
        lastLogin: response.lastLogin,
        sfEmployeeId: response.sfEmployeeId   // ✅ ADD THIS
      };
    }

    return { valid: false };

  } catch (error) {
    console.error('Validate user failed', error);
    return { valid: false };
  }
}

//Testing purpose
// async validateUser(empId: string): Promise<{
//   valid: boolean;
//   contactPhone?: string;
//   isFirstLogin?: boolean;
//   lastLogin?: string;
// }> {

//   if (this.USE_MOCK_VALIDATE_USER) {
//     // MOCK DATA FOR TESTING
//     if (empId === 'NEWUSER1') {
//       return {
//         valid: true,
//         contactPhone: '9999999999',
//         isFirstLogin: true,       // first-time user → OTP page
//         lastLogin: undefined      
//       };
//     }
//     if (empId === 'EXISTING1') {
//       const yesterday = new Date();
//       yesterday.setDate(yesterday.getDate() - 1);
//       return {
//         valid: true,
//         contactPhone: '8888888888',
//         isFirstLogin: false,      // existing user
//         lastLogin: yesterday.toISOString().split('T')[0] // new day → OTP page
//       };
//     }
//     if (empId === 'YESTERDAY1') {
//       const yesterday = new Date();
//       yesterday.setDate(yesterday.getDate() - 1);
//       return {
//         valid: true,
//         contactPhone: '7777777777',
//         isFirstLogin: false,      // existing user
//         lastLogin: yesterday.toISOString().split('T')[0] // yesterday → EMP ID
//       };
//     }
//   }

//   // Original API call
//   try {
//     const response: any = await this.http.get(
//       `${this.baseUrl}/api/validateUser?key=${empId}`
//     ).toPromise();

//     if (response?.message === 'Valid User') {
//       return {
//         valid: true,
//         contactPhone: response.contactPhone,
//         isFirstLogin: response.isFirstLogin === 'Y',
//         lastLogin: response.lastLogin
//       };
//     }

//     return { valid: false };
//   } catch (error) {
//     console.error('Validate user failed', error);
//     return { valid: false };
//   }
// }


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
      const loginDate = await this._storage?.get('loginDate');

      if (!token || !sessionId || !loginDate) {
        return 'INVALID';
      }

      return 'VALID'; // ✅ trust JWT for now
    }

// -----------------------------
// CHECK IF USER IS KNOWN (TOKEN EXISTS)
// -----------------------------
async hasToken(): Promise<boolean> {
  const token = await this._storage?.get('token');
  return !!token && token !== 'undefined';
}

    // -----------------------------
// CHECK PARTIAL SESSION STATE
// -----------------------------
async hasTokenButNoSession(): Promise<boolean> {
  const token = await this._storage?.get('token');
  const sessionId = await this._storage?.get('sessionId');

  return !!token && !sessionId;
}

async storeUsername(username: string) {
  await this._storage?.set('username', username);
}

async getUsername(): Promise<string | null> {
  return await this._storage?.get('username');
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
: Promise<{ isFirstLogin: boolean }> {

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
    const decodedToken: any = JSON.parse(
  atob(response.token.split('.')[1])
);

await this.setSession({
  token: response.token,
  sessionId: decodedToken.sessionId, // ✅ REAL sessionId
  lastLogin: response.lastLogin,      // ✅ BACKEND DATE
  sfEmployeeId: response.sfEmployeeId,
  sfManagerId: response.sfManagerId || null,
  employeeType: response.employeetype || null
});


    return {
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

async storeSfEmployeeId(sfEmployeeId: string) {
  await this._storage?.set('sfEmployeeId', sfEmployeeId);
}

async getSfEmployeeId(): Promise<string | null> {
  return await this._storage?.get('sfEmployeeId');
}

async validateLogin(): Promise<void> {
  const empId = await this.getSfEmployeeId();
  const username = await this.getUsername(); // 🔥 REAL EMPLOYEE ID

  if (!empId || !username) {
    throw 'Employee ID or Username missing';
  }

  const payload = {
    empId,
    username
  };

  const response: any = await this.http
    .post(`${this.baseUrl}/api/validateLogin`, payload)
    .toPromise();

  const decodedToken: any = JSON.parse(
    atob(response.token.split('.')[1])
  );

  await this.setSession({
    token: response.token,
    sessionId: decodedToken.sessionId,
    lastLogin: response.lastLogin,
    sfEmployeeId: response.sfEmployeeId,
    sfManagerId: response.sfManagerId,
    employeeType: response.employeetype
  });
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
  async setSession(data: {
      token: string;
      sessionId: string;
      lastLogin: string;
      sfEmployeeId: string | null;
      sfManagerId: string | null;
      employeeType: string | null;
    }) {
        const normalizedDate = data.lastLogin
    ? data.lastLogin.split('T')[0].split(' ')[0]
    : this.getTodayDate();

      await this._storage?.set('token', data.token);
      await this._storage?.set('sessionId', data.sessionId);
      await this._storage?.set('loginDate', normalizedDate);
      await this._storage?.set('sfEmployeeId', data.sfEmployeeId);
      await this._storage?.set('sfManagerId', data.sfManagerId);
      await this._storage?.set('employeeType', data.employeeType);
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
