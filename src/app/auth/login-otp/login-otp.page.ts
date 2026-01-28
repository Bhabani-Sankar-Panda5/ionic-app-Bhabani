import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-otp',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './login-otp.page.html',
  styleUrls: ['./login-otp.page.scss']
})
export class LoginOtpPage {

  otp: string[] = [];
  otpBoxes = new Array(4);
  showKeypad = true;
  isOtpError = false;

  constructor(private router: Router) {}

  openKeypad() {
    this.showKeypad = true;
  }

  goBack() {
    this.router.navigate(['/login']);
  }

  onKeyPress(key: string) {
    if (key === 'BACKSPACE') {
      this.otp.pop();
      this.isOtpError = false;
    } 
    else if (key === 'ENTER') {
      this.verifyOtp();
    } 
    else {
      if (this.otp.length < 4) {
        this.otp.push(key);
        this.isOtpError = false;
      }
    }
  }

  verifyOtp() {
    if (this.otp.join('') !== '5555') {
          this.isOtpError = true;

    // Add class to container for styling
    const container = document.querySelector('.login-container');
    container?.classList.add('otp-error');

    return;
  }

  this.isOtpError = false;

  // Remove class if previously added
  const container = document.querySelector('.login-container');
  container?.classList.remove('otp-error');

  console.log('OTP Verified');
  }

  resendOtp() {
  this.otp = [];
  this.isOtpError = false;
  document.querySelector('.login-container')?.classList.remove('otp-error');
  }
}
