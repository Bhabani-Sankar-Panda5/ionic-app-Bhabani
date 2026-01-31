import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule, LoadingController, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
    standalone: true, // 🔥 IMPORTANT
  imports: [
    CommonModule,
    IonicModule, // 🔥 THIS fixes ion-icon, ion-content, ion-spinner
    FormsModule  
  ],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {
  // private readonly STATIC_EMP_ID = 'EMP1';
  // private readonly STATIC_PASSWORD = '5555B';
  employeeId: string = '';
  password: string = '';
  isLoading: boolean = false;
  loginButtonText: string = 'Login';
  keyboardMode: 'abc' | '123' = 'abc';
  activeField: 'employeeId' | 'password' = 'employeeId';
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
    toggleKeyboard() {
      this.keyboardMode = this.keyboardMode === 'abc' ? '123' : 'abc';
    }
  
  // State variables
  showSplash: boolean = true; // Start with splash screen
  showKeypad: boolean = false;
  isError: boolean = false; 

  constructor(
    private router: Router,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private authService: AuthService   // ✅ ADD THIS
  ) {}

  ngOnInit() {
    // 1. Show Splash Screen for 2 seconds, then transition to Login
    setTimeout(() => {
      this.showSplash = false;
    }, 2000);
  }

  // get formattedNumber(): string {
  //   return this.mobileNumber; 
  // }

  // get isValidMobile(): boolean {
  //   return this.mobileNumber.length === 10;
  // }

  // --- Interaction Logic ---

  // openKeypad() {
  //   this.showKeypad = true;
  // }

  closeKeypad() {
    this.showKeypad = false;
  }

  // Triggered by the specific Back Arrow in the error state
  goToThirdScreen() {
    console.log('Navigating to 3rd screen...');
    this.router.navigate(['/third-screen']); 
  }

  openForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }

  openLoginMobile(){
    this.router.navigate(['/login-mobile']);
  }

  onKeyPress(key: string) {
        const target: 'employeeId' | 'password' = this.activeField;

  if (key === 'BACKSPACE') {
    this[target] = this[target].slice(0, -1);
    return;
  }

  this[target] += key;
  }

  // --- API / Validation Logic ---

async login() {
  // 🔴 BLOCK EMPTY LOGIN
  if (!this.employeeId || !this.password) {
    await this.showToast(
      'Employee ID and Password are required',
      'danger'
    );
    return;
  }

  this.isLoading = true;
  this.isError = false;

  try {
    const result = await this.authService.login({
      employeeId: this.employeeId,
      password: this.password
    });

    this.isLoading = false;

    if (result.isFirstLogin) {
        this.router.navigate(['/forgot-password'], {
      queryParams: { username: this.employeeId }
    });
    } else {
      this.router.navigate(['/home']);
    }


  } catch (error) {
    this.isLoading = false;
    this.isError = true;
    await this.showToast(
      typeof error === 'string' ? error : 'Login failed',
      'danger'
    );
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