import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';


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
  mobileNumber!: string;

  constructor(
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
      const mobile = this.route.snapshot.queryParamMap.get('mobile');

      if (!mobile) {
        this.router.navigate(['/login-mobile']);
        return;
      }

      this.mobileNumber = mobile;
  }

  openKeypad() {
    this.showKeypad = true;
  }

  goBack() {
    this.router.navigate(['/login-mobile']);
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

async verifyOtp() {
    const otpValue = this.otp.join('');
    const isValid = await this.authService.verifyOtp(otpValue);

    if (!isValid) {
      this.isOtpError = true;
      this.otp = [];
      return;
    }

  await this.authService.markOtpVerified();

  // 🔥 CALL BACKEND LOGIN API
  await this.authService.validateLogin();

  // ✅ NOW USER IS LOGGED IN
  this.router.navigate(['/home']);

    
}




  resendOtp() {
  this.otp = [];
  this.isOtpError = false;
  document.querySelector('.login-container')?.classList.remove('otp-error');
  }
}
