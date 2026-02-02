import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-empid',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
  templateUrl: './login-empid.page.html',
  styleUrls: ['./login-empid.page.scss']
})
export class LoginEmpidPage implements OnInit {

  employeeId = '';
  isLoading = false;
  isError = false;

  showSplash = true;
  showKeypad = false;

  keyboardMode: 'abc' | '123' = 'abc';
  activeField: 'employeeId' = 'employeeId';

  abcKeys = [
    ['Q','W','E','R','T','Y','U','I','O','P'],
    ['A','S','D','F','G','H','J','K','L'],
    ['Z','X','C','V','B','N','M']
  ];

  numKeys = [
    ['1','2','3'],
    ['4','5','6'],
    ['7','8','9']
  ];

  get currentKeys() {
    return this.keyboardMode === 'abc' ? this.abcKeys : this.numKeys;
  }

  constructor(
    private router: Router,
    private toastCtrl: ToastController,
    private authService: AuthService   // ✅ ADD
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.showSplash = false;
    }, 2000);
  }

  toggleKeyboard() {
    this.keyboardMode = this.keyboardMode === 'abc' ? '123' : 'abc';
  }

  onKeyPress(key: string) {
    if (key === 'BACKSPACE') {
      this.employeeId = this.employeeId.slice(0, -1);
      return;
    }
    this.employeeId += key;
  }

async verifyEmpId() {
  if (!this.employeeId) {
    this.showToast('Employee ID is required', 'danger');
    return;
  }

  this.isLoading = true;
  this.isError = false;

  try {
    const result = await this.authService.validateUser(this.employeeId);

    if (!result.valid) {
      this.isError = true;
      this.showToast('Invalid Employee ID', 'danger');
      return;
    }

    const isFirstLogin = result.isFirstLogin === true;
    const isLastLoginToday =
      result.lastLogin && this.isSameDay(result.lastLogin);

    /**
     * 🔑 DECISION POINT
     */
    if (isFirstLogin || !isLastLoginToday) {
      // 👉 OTP required
      this.router.navigate(['/login-otp'], {
        queryParams: {
          empId: this.employeeId,
          mobile: result.contactPhone
        }
      });
    } else {
      // 👉 Same day + not first login → ID & Password
      this.router.navigate(['/login'], {
        queryParams: {
          empId: this.employeeId
        }
      });
    }

  } catch (e) {
    this.isError = true;
    this.showToast('Something went wrong', 'danger');
  } finally {
    this.isLoading = false;
  }
}


private isSameDay(dateStr: string): boolean {
  const apiDate = new Date(dateStr).toISOString().split('T')[0];
  const today = new Date().toISOString().split('T')[0];
  return apiDate === today;
}



  async showToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color,
      position: 'top'
    });
    await toast.present();
  }
}
