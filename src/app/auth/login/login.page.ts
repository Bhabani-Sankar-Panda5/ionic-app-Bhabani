import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule, LoadingController, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
    standalone: true, // 🔥 IMPORTANT
  imports: [
    CommonModule,
    IonicModule, // 🔥 THIS fixes ion-icon, ion-content, ion-spinner
  ],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {
  mobileNumber: string = '';
  countryCode: string = '+91';
  isLoading: boolean = false;
  
  // State variables
  showSplash: boolean = true; // Start with splash screen
  showKeypad: boolean = false;
  isError: boolean = false; 

  constructor(
    private router: Router,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    // 1. Show Splash Screen for 2 seconds, then transition to Login
    setTimeout(() => {
      this.showSplash = false;
    }, 2000);
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

    // Simulate validation failure for demo
    if (!this.isValidMobile) {
      setTimeout(() => {
        this.isLoading = false;
        this.isError = true; // Trigger Error UI + Back Button
      }, 500);
      return;
    }

    // Success Path
    try {
      this.showToast('OTP sent successfully!', 'success');
this.isError = false;
this.closeKeypad();

/* 🔥 ADD THIS */
setTimeout(() => {
  this.router.navigate(['/login-otp'], {
    state: {
        mobile: this.mobileNumber
          }
        });
      }, 500);
    } catch (error) {
      this.showToast('Network Error', 'danger');
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