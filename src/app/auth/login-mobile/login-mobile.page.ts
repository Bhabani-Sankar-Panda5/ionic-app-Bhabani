import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController, IonicModule  } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login-mobile.page.html',
  styleUrls: ['./login-mobile.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
})
export class LoginMobilePage implements OnInit {
  mobileNumber: string = '';
  countryCode: string = '+91';
  isLoading: boolean = false;
  
  // State variables
  showKeypad: boolean = false;
  isError: boolean = false; 

  constructor(
    private router: Router,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private authService: AuthService   // ✅ ADD THIS
  ) {}

  ngOnInit() {

  }

  get formattedNumber(): string {
    return this.mobileNumber; 
  }

  get isValidMobile(): boolean {
    return this.mobileNumber.length === 10;
  }

  // --- Interaction Logic ---

  openKeypad() {
    this.showKeypad = true;
  }

  closeKeypad() {
    this.showKeypad = false;
  }

  // Triggered by the specific Back Arrow in the error state
  goToThirdScreen() {
    console.log('Navigating to 3rd screen...');
    this.router.navigate(['/third-screen']); 
  }

  onKeyPress(key: string) {
    if (key === 'BACKSPACE') {
      this.mobileNumber = this.mobileNumber.slice(0, -1);
      // Reset error on modification
      this.isError = false; 
    } 
    else if (key === 'ENTER') {
      this.requestOTP();
    } 
    else {
      if (this.mobileNumber.length < 10) {
        this.mobileNumber += key;
        this.isError = false; 
      }
    }
  }

  // --- API / Validation Logic ---

  async requestOTP() {
  this.isLoading = true;
  this.isError = false;

  // 1️⃣ Basic length check
  if (!this.isValidMobile) {
    this.isLoading = false;
    this.isError = true;
    return;
  }

  try {
    // 2️⃣ Call validatePhone API
    const isValid = await this.authService.validatePhone(this.mobileNumber);

    if (!isValid) {
      this.isError = true;
      return;
    }

    // 3️⃣ Success → go to OTP page
    this.closeKeypad();

    this.router.navigate(['/login-otp'], {
      queryParams: { mobile: this.mobileNumber }
    });

  } catch (e) {
    this.isError = true;
  } finally {
    this.isLoading = false;
  }
}



  async showToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
      color: color,
      position: 'top',
      cssClass: 'custom-toast'
    });
    await toast.present();
  }

  
}
