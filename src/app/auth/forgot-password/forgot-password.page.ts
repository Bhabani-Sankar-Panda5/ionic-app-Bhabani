import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss']
})
export class ForgotPasswordPage {

  isError: boolean = false;
  errorMessage: string = '';
  newPassword = '';
  confirmPassword = '';
  username: string = '';

  showKeypad = false;
  keyboardMode: 'abc' | '123' = 'abc';
  activeField: 'newPassword' | 'confirmPassword' = 'newPassword';

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
      private route: ActivatedRoute,
      private authService: AuthService
    ) {
        this.username =
        this.route.snapshot.queryParamMap.get('username') || '';
      }

  toggleKeyboard() {
    this.keyboardMode = this.keyboardMode === 'abc' ? '123' : 'abc';
  }

  closeKeypad() {
    this.showKeypad = false;
  }

  onKeyPress(key: string) {
    const target = this.activeField;

    // clear error when user starts typing again
    this.isError = false;
    this.errorMessage = '';

    if (key === 'BACKSPACE') {
      this[target] = this[target].slice(0, -1);
      return;
    }

    this[target] += key;
  }

async resetPassword() {
  if (!this.newPassword || !this.confirmPassword) {
    this.isError = true;
    this.errorMessage = 'Password fields cannot be empty';
    return;
  }

  if (this.newPassword !== this.confirmPassword) {
    this.isError = true;
    this.errorMessage = 'Passwords do not match';
    return;
  }

  try {
    const username = this.username;

    // ✅ Reset password (backend / mock)
    await this.authService.resetPassword(username, this.newPassword);

    // Password reset successful → force normal login
    this.router.navigate(['/login']);

  } catch (err) {
    this.isError = true;
    this.errorMessage = 'Password reset failed';
  }
}


  goBack() {
    this.router.navigate(['/login']);
  }
}
